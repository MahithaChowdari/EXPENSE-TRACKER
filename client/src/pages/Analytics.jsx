import { useEffect, useState } from "react";
import api from "../services/api";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/analytics");

      console.log("Analytics response:", response.data);

      setAnalytics(response.data.analytics);
    } catch (error) {
      console.error("Analytics error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to load analytics."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg font-semibold text-gray-500">
          Loading Analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <p className="text-gray-500">
            No analytics data available.
          </p>
        </div>
      </div>
    );
  }

  const {
    summary,
    expenseByCategory,
    monthlyAnalytics,
    highestExpense,
    transactionCount,
    incomeTransactionCount,
    expenseTransactionCount,
  } = analytics;

  return (
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          📊 Analytics
        </h1>

        <p className="text-gray-500 mt-2">
          Understand your income, expenses and spending habits.
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* TOTAL INCOME */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Total Income
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-2">
            ₹{Number(summary.totalIncome).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* TOTAL EXPENSES */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Total Expenses
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            ₹{Number(summary.totalExpenses).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* BALANCE */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Balance
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              summary.balance >= 0
                ? "text-blue-600"
                : "text-red-600"
            }`}
          >
            ₹{Number(summary.balance).toLocaleString("en-IN")}
          </h2>
        </div>

        {/* SAVINGS RATE */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Savings Rate
          </p>

          <h2 className="text-3xl font-bold text-indigo-600 mt-2">
            {Number(summary.savingsRate).toFixed(1)}%
          </h2>
        </div>

      </div>

      {/* SECONDARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Average Expense
          </p>

          <p className="text-2xl font-bold text-gray-800 mt-2">
            ₹{Number(summary.averageExpense).toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Income Transactions
          </p>

          <p className="text-2xl font-bold text-green-600 mt-2">
            {incomeTransactionCount}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border">
          <p className="text-sm text-gray-500">
            Expense Transactions
          </p>

          <p className="text-2xl font-bold text-red-600 mt-2">
            {expenseTransactionCount}
          </p>
        </div>

      </div>

      {/* EXPENSE BY CATEGORY */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800">
          💸 Expenses by Category
        </h2>

        <p className="text-gray-500 mt-1 mb-6">
          See where most of your money is going.
        </p>

        {expenseByCategory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expense data available.
          </div>
        ) : (
          <div className="space-y-5">

            {expenseByCategory.map((item) => {
              const percentage =
                summary.totalExpenses > 0
                  ? (item.amount / summary.totalExpenses) * 100
                  : 0;

              return (
                <div key={item.category}>

                  <div className="flex justify-between mb-2">

                    <span className="font-medium text-gray-700">
                      {item.category}
                    </span>

                    <span className="font-semibold text-gray-800">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </span>

                  </div>

                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(percentage, 100)}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(1)}% of total expenses
                  </p>

                </div>
              );
            })}

          </div>
        )}

      </div>

      {/* HIGHEST EXPENSE */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800">
          🔥 Highest Expense
        </h2>

        {highestExpense ? (
          <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <p className="text-xl font-semibold text-gray-800">
                {highestExpense.title}
              </p>

              <p className="text-gray-500 mt-1">
                {highestExpense.category}
              </p>
            </div>

            <p className="text-3xl font-bold text-red-600">
              ₹{Number(highestExpense.amount).toLocaleString("en-IN")}
            </p>

          </div>
        ) : (
          <p className="text-gray-500 mt-4">
            No expenses recorded yet.
          </p>
        )}

      </div>

      {/* MONTHLY ANALYTICS */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

        <h2 className="text-2xl font-bold text-gray-800">
          📅 Monthly Overview
        </h2>

        <p className="text-gray-500 mt-1 mb-6">
          Compare your income and expenses month by month.
        </p>

        {monthlyAnalytics.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No monthly data available.
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b text-left">

                  <th className="py-3 px-2 text-gray-600">
                    Month
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Income
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Expenses
                  </th>

                  <th className="py-3 px-2 text-gray-600">
                    Balance
                  </th>

                </tr>
              </thead>

              <tbody>

                {monthlyAnalytics.map((month) => (
                  <tr
                    key={month.month}
                    className="border-b last:border-0"
                  >

                    <td className="py-4 px-2 font-medium">
                      {month.month}
                    </td>

                    <td className="py-4 px-2 text-green-600 font-semibold">
                      ₹{Number(month.income).toLocaleString("en-IN")}
                    </td>

                    <td className="py-4 px-2 text-red-600 font-semibold">
                      ₹{Number(month.expenses).toLocaleString("en-IN")}
                    </td>

                    <td
                      className={`py-4 px-2 font-semibold ${
                        month.balance >= 0
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      ₹{Number(month.balance).toLocaleString("en-IN")}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* TRANSACTION SUMMARY */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg p-6 mt-8 mb-8">

        <h2 className="text-xl font-bold">
          📈 Transaction Summary
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">

          <div>
            <p className="text-blue-100 text-sm">
              Total Transactions
            </p>

            <p className="text-3xl font-bold mt-1">
              {transactionCount}
            </p>
          </div>

          <div>
            <p className="text-blue-100 text-sm">
              Income Transactions
            </p>

            <p className="text-3xl font-bold mt-1">
              {incomeTransactionCount}
            </p>
          </div>

          <div>
            <p className="text-blue-100 text-sm">
              Expense Transactions
            </p>

            <p className="text-3xl font-bold mt-1">
              {expenseTransactionCount}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;