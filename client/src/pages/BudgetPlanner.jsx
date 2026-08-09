import { useEffect, useState } from "react";
import api from "../services/api";

function BudgetPlanner() {
  const categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Education",
    "Health",
    "Entertainment",
    "Business",
    "Other Expense",
  ];

  const [monthlyBudget, setMonthlyBudget] = useState("");

  const [categoryBudgets, setCategoryBudgets] = useState({
    Food: "",
    Travel: "",
    Shopping: "",
    Bills: "",
    Education: "",
    Health: "",
    Entertainment: "",
    Business: "",
    "Other Expense": "",
  });

  const [spending, setSpending] = useState({
    totalSpent: 0,
    remaining: 0,
    percentageUsed: 0,
    categorySpent: {},
    categoryDetails: {},
    transactionCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // ==========================================
  // LOAD BUDGET
  // ==========================================

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    try {
      setLoading(true);

      const response = await api.get("/budgets");

      console.log(
        "Budget response:",
        response.data
      );

      const budget = response.data?.budget;
      const spendingData =
        response.data?.spending;

      // Load budget values
      if (budget) {
        setMonthlyBudget(
          budget.monthlyBudget?.toString() || ""
        );

        setCategoryBudgets({
          Food:
            budget.categoryBudgets?.Food || "",
          Travel:
            budget.categoryBudgets?.Travel || "",
          Shopping:
            budget.categoryBudgets?.Shopping || "",
          Bills:
            budget.categoryBudgets?.Bills || "",
          Education:
            budget.categoryBudgets?.Education || "",
          Health:
            budget.categoryBudgets?.Health || "",
          Entertainment:
            budget.categoryBudgets
              ?.Entertainment || "",
          Business:
            budget.categoryBudgets?.Business || "",
          "Other Expense":
            budget.categoryBudgets?.[
              "Other Expense"
            ] || "",
        });
      }

      // Load spending information
      if (spendingData) {
        setSpending({
          totalSpent:
            Number(
              spendingData.totalSpent
            ) || 0,

          remaining:
            Number(
              spendingData.remaining
            ) || 0,

          percentageUsed:
            Number(
              spendingData.percentageUsed
            ) || 0,

          categorySpent:
            spendingData.categorySpent || {},

          categoryDetails:
            spendingData.categoryDetails || {},

          transactionCount:
            Number(
              spendingData.transactionCount
            ) || 0,
        });
      } else {
        setSpending({
          totalSpent: 0,
          remaining: 0,
          percentageUsed: 0,
          categorySpent: {},
          categoryDetails: {},
          transactionCount: 0,
        });
      }

      if (budget) {
        setMessage(
          "🟢 Saved budget loaded"
        );
      } else {
        setMessage(
          "ℹ️ No budget set for this month"
        );
      }
    } catch (error) {
      console.error(
        "Load budget error:",
        error
      );

      if (
        error.response?.status === 401
      ) {
        setMessage(
          "🔴 Please login again."
        );
      } else {
        setMessage(
          error.response?.data?.message ||
            "🔴 Failed to load budget."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CATEGORY CHANGE
  // ==========================================

  const handleCategoryChange = (
    category,
    value
  ) => {
    setCategoryBudgets((previous) => ({
      ...previous,
      [category]: value,
    }));
  };

  // ==========================================
  // SAVE BUDGET
  // ==========================================

  const handleSaveBudget = async (e) => {
    e.preventDefault();

    if (
      !monthlyBudget ||
      Number(monthlyBudget) <= 0
    ) {
      setMessage(
        "🔴 Please enter a valid monthly budget."
      );
      return;
    }

    try {
      setSaving(true);
      setMessage("🔵 Saving budget...");

      const cleanedCategories = {};

      categories.forEach((category) => {
        cleanedCategories[category] =
          Number(
            categoryBudgets[category]
          ) || 0;
      });

      const budgetData = {
        monthlyBudget:
          Number(monthlyBudget),

        categoryBudgets:
          cleanedCategories,
      };

      console.log(
        "Sending budget:",
        budgetData
      );

      const response = await api.post(
        "/budgets",
        budgetData
      );

      console.log(
        "Save response:",
        response.data
      );

      setMessage(
        "🟢 Budget saved successfully! 🎉"
      );

      // Reload spending and budget data
      await loadBudget();
    } catch (error) {
      console.error(
        "Save budget error:",
        error
      );

      console.error(
        "Server response:",
        error.response?.data
      );

      setMessage(
        error.response?.data?.message ||
          "🔴 Failed to save budget."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  // ==========================================
  // PROGRESS COLOR
  // ==========================================

  const getProgressColor = (
    percentage
  ) => {
    if (percentage >= 100) {
      return "bg-red-500";
    }

    if (percentage >= 80) {
      return "bg-orange-500";
    }

    return "bg-blue-600";
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg font-semibold text-gray-600">
          Loading Budget Planner...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="max-w-6xl mx-auto">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          💰 Budget Planner
        </h1>

        <p className="text-gray-500 mt-2">
          Plan your monthly spending and
          control your expenses.
        </p>
      </div>

      {/* ======================================
          STATUS MESSAGE
      ====================================== */}

      {message && (
        <div className="mb-6 bg-white rounded-xl shadow p-4 border border-gray-100">
          <p className="font-medium">
            {message}
          </p>
        </div>
      )}

      {/* ======================================
          BUDGET SUMMARY
      ====================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* MONTHLY BUDGET */}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

          <p className="text-gray-500 text-sm font-medium">
            Monthly Budget
          </p>

          <h2 className="text-3xl font-bold text-blue-600 mt-2">
            {formatMoney(monthlyBudget)}
          </h2>

        </div>

        {/* TOTAL SPENT */}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

          <p className="text-gray-500 text-sm font-medium">
            Spent This Month
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {formatMoney(
              spending.totalSpent
            )}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {spending.transactionCount} expense
            {spending.transactionCount !== 1
              ? "s"
              : ""}
          </p>

        </div>

        {/* REMAINING */}

        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">

          <p className="text-gray-500 text-sm font-medium">
            Remaining Budget
          </p>

          <h2
            className={`text-3xl font-bold mt-2 ${
              spending.remaining >= 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatMoney(
              spending.remaining
            )}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            {Math.min(
              Math.max(
                spending.percentageUsed,
                0
              ),
              100
            ).toFixed(1)}
            % used
          </p>

        </div>

      </div>

      {/* ======================================
          OVERALL PROGRESS
      ====================================== */}

      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">

        <div className="flex justify-between items-center mb-3">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Monthly Spending
            </h2>

            <p className="text-gray-500 mt-1">
              Track how much of your budget
              you have used.
            </p>
          </div>

          <span
            className={`font-bold ${
              spending.percentageUsed >= 100
                ? "text-red-600"
                : spending.percentageUsed >= 80
                ? "text-orange-600"
                : "text-blue-600"
            }`}
          >
            {Number(
              spending.percentageUsed || 0
            ).toFixed(1)}
            %
          </span>

        </div>

        <div className="h-5 bg-gray-100 rounded-full overflow-hidden">

          <div
            className={`h-full rounded-full transition-all ${getProgressColor(
              spending.percentageUsed
            )}`}
            style={{
              width: `${Math.min(
                Math.max(
                  spending.percentageUsed,
                  0
                ),
                100
              )}%`,
            }}
          />

        </div>

        {spending.percentageUsed >=
          100 && (
          <p className="mt-4 text-red-600 font-semibold">
            ⚠️ You have exceeded your monthly
            budget.
          </p>
        )}

        {spending.percentageUsed >= 80 &&
          spending.percentageUsed < 100 && (
            <p className="mt-4 text-orange-600 font-semibold">
              ⚠️ You are close to your monthly
              budget limit.
            </p>
          )}

        {spending.percentageUsed < 80 && (
          <p className="mt-4 text-green-600 font-semibold">
            ✅ Your spending is within your
            monthly budget.
          </p>
        )}

      </div>

      {/* ======================================
          BUDGET FORM
      ====================================== */}

      <form
        onSubmit={handleSaveBudget}
        className="space-y-8"
      >

        {/* MONTHLY BUDGET */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Monthly Budget
          </h2>

          <p className="text-gray-500 mb-6">
            Set the maximum amount you want
            to spend this month.
          </p>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              ₹
            </span>

            <input
              type="number"
              min="0"
              value={monthlyBudget}
              onChange={(e) =>
                setMonthlyBudget(
                  e.target.value
                )
              }
              placeholder="Enter monthly budget"
              className="w-full border border-gray-300 rounded-xl px-10 py-4 text-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* ====================================
            CATEGORY BUDGETS
        ==================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Category Budgets
          </h2>

          <p className="text-gray-500 mb-6">
            Set individual limits for each
            spending category.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {categories.map(
              (category) => {

                const details =
                  spending.categoryDetails?.[
                    category
                  ];

                const budgetAmount =
                  Number(
                    details?.budget
                  ) ||
                  Number(
                    categoryBudgets[
                      category
                    ]
                  ) ||
                  0;

                const spentAmount =
                  Number(
                    details?.spent
                  ) || 0;

                const remainingAmount =
                  Number(
                    details?.remaining
                  ) ||
                  budgetAmount -
                    spentAmount;

                const percentage =
                  budgetAmount > 0
                    ? (spentAmount /
                        budgetAmount) *
                      100
                    : 0;

                const exceeded =
                  budgetAmount > 0 &&
                  spentAmount >
                    budgetAmount;

                return (
                  <div
                    key={category}
                    className="border border-gray-200 rounded-2xl p-5"
                  >

                    {/* CATEGORY NAME */}

                    <div className="flex justify-between items-center mb-3">

                      <label className="font-semibold text-gray-700">
                        {category}
                      </label>

                      {exceeded && (
                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                          OVER BUDGET
                        </span>
                      )}

                    </div>

                    {/* INPUT */}

                    <div className="relative">

                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        ₹
                      </span>

                      <input
                        type="number"
                        min="0"
                        value={
                          categoryBudgets[
                            category
                          ]
                        }
                        onChange={(e) =>
                          handleCategoryChange(
                            category,
                            e.target.value
                          )
                        }
                        placeholder={`Budget for ${category}`}
                        className="w-full border border-gray-300 rounded-xl px-10 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                      />

                    </div>

                    {/* SPENDING */}

                    <div className="flex justify-between mt-4 text-sm">

                      <span className="text-gray-500">
                        Spent
                      </span>

                      <span className="font-semibold text-red-600">
                        {formatMoney(
                          spentAmount
                        )}
                      </span>

                    </div>

                    <div className="flex justify-between mt-1 text-sm">

                      <span className="text-gray-500">
                        Remaining
                      </span>

                      <span
                        className={`font-semibold ${
                          remainingAmount >=
                          0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatMoney(
                          remainingAmount
                        )}
                      </span>

                    </div>

                    {/* PROGRESS */}

                    {budgetAmount > 0 && (
                      <div className="mt-4">

                        <div className="flex justify-between text-xs text-gray-400 mb-1">

                          <span>
                            Budget used
                          </span>

                          <span>
                            {percentage.toFixed(
                              1
                            )}
                            %
                          </span>

                        </div>

                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">

                          <div
                            className={`h-full rounded-full ${getProgressColor(
                              percentage
                            )}`}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  percentage,
                                  0
                                ),
                                100
                              )}%`,
                            }}
                          />

                        </div>

                      </div>
                    )}

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* ====================================
            SAVE BUTTON
        ==================================== */}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition disabled:opacity-50"
        >
          {saving
            ? "🔵 Saving Budget..."
            : "💾 Save Budget"}
        </button>

      </form>

    </div>
  );
}

export default BudgetPlanner;