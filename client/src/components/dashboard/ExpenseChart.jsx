import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpenseChart({ transactions = [] }) {
  const [expenseData, setExpenseData] = useState([]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateExpenses(transactions);
    } else {
      fetchTransactions();
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      const data = response.data.transactions || [];

      calculateExpenses(data);
    } catch (error) {
      console.error(
        "Failed to load expense data:",
        error
      );

      setExpenseData([]);
    }
  };

  const calculateExpenses = (data) => {
    const expenses = data.filter(
      (transaction) =>
        transaction.type === "expense"
    );

    const categoryTotals = {};

    expenses.forEach((transaction) => {
      const category =
        transaction.category || "Other";

      categoryTotals[category] =
        (categoryTotals[category] || 0) +
        Number(transaction.amount);
    });

    const result = Object.entries(
      categoryTotals
    ).map(([category, amount]) => ({
      category,
      amount,
    }));

    setExpenseData(result);
  };

  // Beautiful colors for different categories
  const colors = [
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#10B981", // Green
    "#F59E0B", // Yellow
    "#8B5CF6", // Purple
    "#EC4899", // Pink
    "#06B6D4", // Cyan
    "#F97316", // Orange
    "#14B8A6", // Teal
    "#6366F1", // Indigo
    "#84CC16", // Lime
    "#A855F7", // Violet
  ];

  const chartData = {
    labels: expenseData.map(
      (item) => item.category
    ),

    datasets: [
      {
        label: "Expenses",

        data: expenseData.map(
          (item) => item.amount
        ),

        backgroundColor: expenseData.map(
          (_, index) =>
            colors[index % colors.length]
        ),

        borderColor: "#ffffff",

        borderWidth: 3,

        hoverOffset: 10,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          padding: 18,

          usePointStyle: true,

          pointStyle: "circle",

          font: {
            size: 13,
          },
        },
      },

      tooltip: {
        backgroundColor: "#111827",

        padding: 12,

        titleFont: {
          size: 14,
        },

        bodyFont: {
          size: 13,
        },

        callbacks: {
          label: function (context) {
            return ` ₹${Number(
              context.raw
            ).toLocaleString("en-IN")}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Expense Breakdown
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          See where your money is going
        </p>

      </div>

      {expenseData.length === 0 ? (

        <div className="h-64 flex items-center justify-center text-gray-500">

          <div className="text-center">

            <div className="text-4xl mb-3">
              📊
            </div>

            <p className="text-lg">
              No expenses yet
            </p>

            <p className="text-sm mt-1">
              Add an expense to see the chart.
            </p>

          </div>

        </div>

      ) : (

        <div className="h-80">

          <Pie
            data={chartData}
            options={chartOptions}
          />

        </div>

      )}

    </div>
  );
}

export default ExpenseChart;