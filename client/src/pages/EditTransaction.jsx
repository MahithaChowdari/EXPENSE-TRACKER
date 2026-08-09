import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api";

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    customCategory: "",
    type: "expense",
    date: "",
  });

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    try {
      const response = await api.get("/transactions");

      const transactions =
        response.data.transactions || [];

      const transaction = transactions.find(
        (item) => item._id === id
      );

      if (!transaction) {
        toast.error("Transaction not found");
        navigate("/dashboard");
        return;
      }

      setFormData({
        title: transaction.title || "",
        amount: transaction.amount || "",
        category: transaction.category || "",
        customCategory:
          transaction.customCategory || "",
        type: transaction.type || "expense",
        date: transaction.date
          ? new Date(transaction.date)
              .toISOString()
              .split("T")[0]
          : "",
      });

    } catch (error) {
      console.error(
        "Failed to load transaction:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load transaction"
      );

      navigate("/dashboard");

    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await api.put(
        `/transactions/${id}`,
        {
          ...formData,
          amount: Number(formData.amount),
        }
      );

      toast.success(
        "Transaction updated successfully!"
      );

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Update transaction error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update transaction"
      );

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-gray-500">
          Loading transaction...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-3xl mx-auto">

        <div className="bg-white rounded-3xl shadow-lg p-8">

          {/* Header */}

          <div className="mb-8">

            <button
              type="button"
              onClick={() =>
                navigate("/dashboard")
              }
              className="text-blue-600 hover:text-blue-800 font-medium mb-4"
            >
              ← Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold text-gray-800">
              Edit Transaction
            </h1>

            <p className="text-gray-500 mt-2">
              Update the details of your transaction.
            </p>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Title */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Title
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Example: Grocery shopping"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Amount */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>

              <div className="relative">

                <span className="absolute left-4 top-3 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

            </div>

            {/* Type */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Type
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="expense">
                  💸 Expense
                </option>

                <option value="income">
                  💰 Income
                </option>
              </select>

            </div>

            {/* Category */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

                <option value="">
                  Select Category
                </option>

                <option value="Food">
                  🍔 Food
                </option>

                <option value="Travel">
                  ✈️ Travel
                </option>

                <option value="Shopping">
                  🛍️ Shopping
                </option>

                <option value="Bills">
                  🧾 Bills
                </option>

                <option value="Education">
                  🎓 Education
                </option>

                <option value="Health">
                  ❤️ Health
                </option>

                <option value="Entertainment">
                  🎬 Entertainment
                </option>

                <option value="Salary">
                  💰 Salary
                </option>

                <option value="Business">
                  💼 Business
                </option>

                <option value="Other Expense">
                  📦 Other Expense
                </option>

                <option value="Other Income">
                  💎 Other Income
                </option>

              </select>

            </div>

            {/* Custom Category */}

            {(formData.category ===
              "Other Expense" ||
              formData.category ===
                "Other Income") && (

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {formData.category ===
                  "Other Expense"
                    ? "What is this expense?"
                    : "What is this income?"}
                </label>

                <input
                  type="text"
                  name="customCategory"
                  value={
                    formData.customCategory
                  }
                  onChange={handleChange}
                  placeholder={
                    formData.category ===
                    "Other Expense"
                      ? "Example: Mobile repair"
                      : "Example: YouTube earnings"
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />

              </div>

            )}

            {/* Date */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

            </div>

            {/* Buttons */}

            <div className="flex gap-4 pt-4">

              <button
                type="button"
                onClick={() =>
                  navigate("/dashboard")
                }
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditTransaction;