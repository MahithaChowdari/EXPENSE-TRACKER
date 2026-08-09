import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import api from "../../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

function IncomeExpenseChart({ transactions = [] }) {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    if (transactions.length > 0) {
      calculateMonthlyData(transactions);
    } else {
      fetchTransactions();
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      const data = response.data.transactions || [];

      calculateMonthlyData(data);
    } catch (error) {
      console.error(
        "Failed to load income/expense data:",
        error
      );

      setMonthlyData([]);
    }
  };

  const calculateMonthlyData = (data) => {
    const months = {};

    data.forEach((transaction) => {
      if (!transaction.date) return;

      const date = new Date(transaction.date);

      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!months[monthKey]) {
        months[monthKey] = {
          income: 0,
          expense: 0,
        };
      }

      if (transaction.type === "income") {
        months[monthKey].income += Number(
          transaction.amount
        );
      }

      if (transaction.type === "expense") {
        months[monthKey].expense += Number(
          transaction.amount
        );
      }
    });

    const result = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => {
        const [year, monthNumber] = month.split("-");

        const date = new Date(
          Number(year),
          Number(monthNumber) - 1
        );

        return {
          month: date.toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
          }),

          income: values.income,
          expense: values.expense,
        };
      });

    setMonthlyData(result);
  };

  const chartData = {
    labels: monthlyData.map(
      (item) => item.month
    ),

    datasets: [
      {
        label: "Income",

        data: monthlyData.map(
          (item) => item.income
        ),

        backgroundColor: "#10B981",

        borderRadius: 8,

        borderSkipped: false,
      },

      {
        label: "Expenses",

        data: monthlyData.map(
          (item) => item.expense
        ),

        backgroundColor: "#EF4444",

        borderRadius: 8,

        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,

    maintainAspectRatio: false,

    interaction: {
      mode: "index",
      intersect: false,
    },

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

        callbacks: {
          label: function (context) {
            return ` ${context.dataset.label}: ₹${Number(
              context.raw
            ).toLocaleString("en-IN")}`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#6B7280",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#6B7280",

          callback: function (value) {
            return `₹${Number(
              value
            ).toLocaleString("en-IN")}`;
          },
        },

        grid: {
          color: "#E5E7EB",
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      <div className="mb-6">

        <h2 className="text-xl font-bold text-gray-800">
          Income vs Expenses
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Compare your income and spending
        </p>

      </div>

      {monthlyData.length === 0 ? (

        <div className="h-80 flex items-center justify-center text-gray-500">

          <div className="text-center">

            <div className="text-4xl mb-3">
              📈
            </div>

            <p className="text-lg">
              No transaction data yet
            </p>

            <p className="text-sm mt-1">
              Add transactions to see the comparison.
            </p>

          </div>

        </div>

      ) : (

        <div className="h-80">

          <Bar
            data={chartData}
            options={chartOptions}
          />

        </div>

      )}

    </div>
  );
}

export default IncomeExpenseChart;