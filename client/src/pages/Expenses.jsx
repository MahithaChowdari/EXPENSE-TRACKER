import { useEffect, useState } from "react";
import { FaArrowUp, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";

function Expenses() {
  const [expenseTransactions, setExpenseTransactions] =
    useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const response = await api.get("/transactions");

      const allTransactions =
        response.data.transactions || [];

      const expensesOnly = allTransactions.filter(
        (transaction) =>
          transaction.type === "expense"
      );

      setExpenseTransactions(expensesOnly);
    } catch (error) {
      console.error(
        "Failed to fetch expenses:",
        error
      );

      setExpenseTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpenses =
    expenseTransactions.reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1">

        <Topbar />

        <div className="p-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Expenses
              </h1>

              <p className="text-gray-500 mt-1">
                Track all your expenses
              </p>
            </div>

            <button
              onClick={() =>
                navigate("/add-transaction")
              }
              className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              <FaPlus />
              Add Expense
            </button>

          </div>

          {/* Total Expenses */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-xl">
                <FaArrowUp />
              </div>

              <div>

                <p className="text-gray-500 text-sm">
                  Total Expenses
                </p>

                <h2 className="text-3xl font-bold text-red-600">
                  ₹
                  {totalExpenses.toLocaleString(
                    "en-IN"
                  )}
                </h2>

              </div>

            </div>

          </div>

          {/* Expense Transactions */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            <div className="p-6 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                Expense Transactions
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your recorded expenses
              </p>

            </div>

            {loading ? (

              <div className="p-10 text-center text-gray-500">
                Loading expenses...
              </div>

            ) : expenseTransactions.length === 0 ? (

              <div className="p-12 text-center">

                <div className="text-5xl mb-4">
                  💸
                </div>

                <h3 className="text-lg font-semibold text-gray-700">
                  No expense transactions
                </h3>

                <p className="text-gray-500 mt-2">
                  Add your first expense to see
                  it here.
                </p>

                <button
                  onClick={() =>
                    navigate("/add-transaction")
                  }
                  className="mt-5 bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl transition"
                >
                  Add Expense
                </button>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b bg-gray-50 text-gray-500 text-sm">

                      <th className="text-left p-4">
                        Title
                      </th>

                      <th className="text-left p-4">
                        Category
                      </th>

                      <th className="text-left p-4">
                        Amount
                      </th>

                      <th className="text-left p-4">
                        Date
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {expenseTransactions.map(
                      (transaction) => (

                        <tr
                          key={transaction._id}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >

                          <td className="p-4 font-medium text-gray-800">
                            {transaction.title}
                          </td>

                          <td className="p-4 text-gray-600">
                            {transaction.category}
                          </td>

                          <td className="p-4 font-semibold text-red-600">
                            - ₹
                            {Number(
                              transaction.amount
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td className="p-4 text-gray-500">

                            {transaction.date
                              ? new Date(
                                  transaction.date
                                ).toLocaleDateString(
                                  "en-IN"
                                )
                              : "-"}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Expenses;