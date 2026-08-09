import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

function RecentTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const navigate = useNavigate();

  // ======================================================
  // FETCH TRANSACTIONS
  // ======================================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await api.get("/transactions");

      setTransactions(
        response.data.transactions || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch transactions:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load transactions"
      );

      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOAD TRANSACTIONS
  // ======================================================

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ======================================================
  // DELETE TRANSACTION
  // ======================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(
        `/transactions/${id}`
      );

      setTransactions((previous) =>
        previous.filter(
          (transaction) =>
            transaction._id !== id
        )
      );

      toast.success(
        "Transaction deleted successfully!"
      );

    } catch (error) {
      console.error(
        "Delete transaction error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">

        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Transactions
        </h2>

        <div className="text-center py-10">

          <div className="text-3xl mb-3">
            ⏳
          </div>

          <p className="text-gray-500">
            Loading transactions...
          </p>

        </div>

      </div>
    );
  }

  // ======================================================
  // MAIN UI
  // ======================================================

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Recent Transactions
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Your latest income and expenses
          </p>
        </div>

        {transactions.length > 0 && (
          <button
            onClick={() =>
              navigate("/add-transaction")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Add
          </button>
        )}

      </div>

      {/* No Transactions */}

      {transactions.length === 0 ? (

        <div className="text-center py-10">

          <div className="text-5xl mb-4">
            💳
          </div>

          <p className="text-gray-600 text-lg font-medium">
            No transactions yet.
          </p>

          <p className="text-gray-400 text-sm mt-2 mb-5">
            Add your first transaction to see it here.
          </p>

          <button
            onClick={() =>
              navigate("/add-transaction")
            }
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold transition"
          >
            + Add Transaction
          </button>

        </div>

      ) : (

        /* Transactions Table */

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b text-gray-500 text-sm">

                <th className="text-left py-3 px-2">
                  Title
                </th>

                <th className="text-left py-3 px-2">
                  Category
                </th>

                <th className="text-left py-3 px-2">
                  Type
                </th>

                <th className="text-right py-3 px-2">
                  Amount
                </th>

                <th className="text-right py-3 px-2">
                  Date
                </th>

                <th className="text-center py-3 px-2">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {transactions.map(
                (transaction) => (

                  <tr
                    key={transaction._id}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition"
                  >

                    {/* Title */}

                    <td className="py-4 px-2 font-medium text-gray-800">

                      {transaction.title}

                    </td>

                    {/* Category */}

                    <td className="py-4 px-2 text-gray-600">

                      {transaction.category ===
                        "Other Expense" ||
                      transaction.category ===
                        "Other Income"
                        ? transaction.customCategory ||
                          transaction.category
                        : transaction.category}

                    </td>

                    {/* Type */}

                    <td className="py-4 px-2">

                      <span
                        className={
                          transaction.type ===
                          "income"
                            ? "px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                            : "px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                        }
                      >
                        {transaction.type ===
                        "income"
                          ? "Income"
                          : "Expense"}
                      </span>

                    </td>

                    {/* Amount */}

                    <td
                      className={
                        transaction.type ===
                        "income"
                          ? "py-4 px-2 text-right font-semibold text-green-600"
                          : "py-4 px-2 text-right font-semibold text-red-600"
                      }
                    >

                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}{" "}
                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString("en-IN")}

                    </td>

                    {/* Date */}

                    <td className="py-4 px-2 text-right text-gray-500">

                      {transaction.date
                        ? new Date(
                            transaction.date
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}

                    </td>

                    {/* ACTIONS */}

                    <td className="py-4 px-2">

                      <div className="flex justify-center gap-2">

                        {/* EDIT BUTTON */}

                        <button
                          type="button"
                          onClick={() => {
                            console.log(
                              "Editing transaction:",
                              transaction._id
                            );

                            navigate(
                              `/edit-transaction/${transaction._id}`
                            );
                          }}
                          title="Edit transaction"
                          className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition flex items-center justify-center"
                        >
                          ✏️
                        </button>

                        {/* DELETE BUTTON */}

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(
                              transaction._id
                            )
                          }
                          disabled={
                            deletingId ===
                            transaction._id
                          }
                          title="Delete transaction"
                          className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition flex items-center justify-center disabled:opacity-50"
                        >
                          {deletingId ===
                          transaction._id
                            ? "..."
                            : "🗑️"}
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default RecentTransactions;