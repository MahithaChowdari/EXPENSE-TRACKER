import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddTransaction() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  title: "",
  amount: "",
  category: "",
  customCategory: "",
  type: "expense",
  date: "",
});

  const [loading, setLoading] = useState(false);

  const expenseCategories = [
    { value: "Food", label: "🍔 Food" },
    { value: "Travel", label: "🚌 Travel" },
    { value: "Shopping", label: "🛍️ Shopping" },
    { value: "Education", label: "📚 Education" },
    { value: "Bills", label: "🧾 Bills" },
    { value: "Entertainment", label: "🎬 Entertainment" },
    { value: "Health", label: "💊 Health" },
    { value: "Rent", label: "🏠 Rent / Hostel" },
    { value: "Subscriptions", label: "📱 Subscriptions" },
    { value: "Personal Care", label: "💅 Personal Care" },
    { value: "Other Expense", label: "📦 Other Expense" },
  ];

  const incomeCategories = [
    { value: "Salary", label: "💰 Salary" },
    { value: "Freelance", label: "💻 Freelance" },
    { value: "Scholarship", label: "🎓 Scholarship" },
    { value: "Pocket Money", label: "💵 Pocket Money" },
    { value: "Business", label: "🏪 Business" },
    { value: "Other Income", label: "💎 Other Income" },
  ];

  const categories =
    formData.type === "income"
      ? incomeCategories
      : expenseCategories;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,

      // Reset category when changing income/expense
      ...(name === "type" && {
        category: "",
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/transactions", {
  ...formData,
  amount: Number(formData.amount),
});

      alert("Transaction Added Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error("Transaction Error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to add transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">

      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Add Transaction
          </h1>

          <p className="text-gray-500 mt-1">
            Record your income or expenses.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Transaction Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Type
              </label>

              <div className="grid grid-cols-2 gap-3">

                <button
                  type="button"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      type: "expense",
                      category: "",
                    }))
                  }
                  className={`py-3 rounded-xl border-2 font-semibold transition ${
                    formData.type === "expense"
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-200 text-gray-500 hover:border-red-300"
                  }`}
                >
                  💸 Expense
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((previous) => ({
                      ...previous,
                      type: "income",
                      category: "",
                    }))
                  }
                  className={`py-3 rounded-xl border-2 font-semibold transition ${
                    formData.type === "income"
                      ? "border-green-500 bg-green-50 text-green-600"
                      : "border-gray-200 text-gray-500 hover:border-green-300"
                  }`}
                >
                  💰 Income
                </button>

              </div>
            </div>

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
                placeholder={
                  formData.type === "income"
                    ? "Example: Part-time salary"
                    : "Example: Lunch at college"
                }
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Amount
              </label>

              <div className="relative">

                <span className="absolute left-4 top-3 text-gray-500 font-semibold">
                  ₹
                </span>

                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />

              </div>
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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">
                  Select a category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>
              {(formData.category === "Other Expense" ||
  formData.category === "Other Income") && (
  <div className="mt-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {formData.category === "Other Expense"
        ? "What is this expense?"
        : "What is this income?"}
    </label>

    <input
      type="text"
      name="customCategory"
      value={formData.customCategory}
      onChange={handleChange}
      placeholder={
        formData.category === "Other Expense"
          ? "Example: Mobile repair"
          : "Example: YouTube earnings"
      }
      className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      required
    />
  </div>
)}
            </div>

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
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-3">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-1/3 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-xl font-semibold transition"
              >
                {loading
                  ? "Saving..."
                  : "Save Transaction"}
              </button>

            </div>

          </form>

        </div>
      </div>
    </div>
  );
}

export default AddTransaction;