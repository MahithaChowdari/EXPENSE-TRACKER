import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

import Sidebar from "../components/dashboard/Sidebar";
import Topbar from "../components/dashboard/Topbar";
import BalanceCard from "../components/dashboard/BalanceCard";
import SummaryCards from "../components/dashboard/SummaryCards";
import ExpenseChart from "../components/dashboard/ExpenseChart";
import IncomeExpenseChart from "../components/dashboard/IncomeExpenseChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState(null);
  const [budgetLoading, setBudgetLoading] = useState(true);

  // ==========================================
  // FETCH TRANSACTIONS
  // ==========================================

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");

      setTransactions(
        response.data.transactions || []
      );
    } catch (error) {
      console.error(
        "Failed to fetch transactions:",
        error
      );

      setTransactions([]);
    }
  };

  // ==========================================
  // FETCH CURRENT MONTH BUDGET
  // ==========================================

  const fetchBudget = async () => {
    try {
      setBudgetLoading(true);

      const response = await api.get("/budgets");

      console.log(
        "Dashboard budget:",
        response.data
      );

      setBudget(
        response.data?.budget || null
      );
    } catch (error) {
      console.error(
        "Failed to fetch budget:",
        error
      );

      setBudget(null);
    } finally {
      setBudgetLoading(false);
    }
  };

  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchTransactions();
    fetchBudget();
  }, []);

  // ==========================================
  // ALL-TIME TOTALS
  // Used for balance / summary cards
  // ==========================================

  const income = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.amount) || 0),
        0
      );
  }, [transactions]);

  const expenses = useMemo(() => {
    return transactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.amount) || 0),
        0
      );
  }, [transactions]);

  const balance = income - expenses;

  const savings = balance;

  // ==========================================
  // CURRENT MONTH EXPENSES
  // Important for budget calculations
  // ==========================================

  const currentMonthExpenses = useMemo(() => {
    const now = new Date();

    const currentMonth =
      now.getMonth();

    const currentYear =
      now.getFullYear();

    return transactions
      .filter((transaction) => {
        if (
          transaction.type !==
          "expense"
        ) {
          return false;
        }

        const transactionDate =
          new Date(transaction.date);

        if (
          Number.isNaN(
            transactionDate.getTime()
          )
        ) {
          return false;
        }

        return (
          transactionDate.getMonth() ===
            currentMonth &&
          transactionDate.getFullYear() ===
            currentYear
        );
      })
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.amount) || 0),
        0
      );
  }, [transactions]);

  // ==========================================
  // MONTHLY CATEGORY EXPENSES
  // ==========================================

  const currentMonthCategoryExpenses =
    useMemo(() => {
      const now = new Date();

      const currentMonth =
        now.getMonth();

      const currentYear =
        now.getFullYear();

      const totals = {};

      transactions.forEach(
        (transaction) => {
          if (
            transaction.type !==
            "expense"
          ) {
            return;
          }

          const transactionDate =
            new Date(transaction.date);

          if (
            Number.isNaN(
              transactionDate.getTime()
            )
          ) {
            return;
          }

          if (
            transactionDate.getMonth() !==
              currentMonth ||
            transactionDate.getFullYear() !==
              currentYear
          ) {
            return;
          }

          const category =
            transaction.category ||
            "Other Expense";

          const amount =
            Number(transaction.amount) ||
            0;

          totals[category] =
            (totals[category] || 0) +
            amount;
        }
      );

      return totals;
    }, [transactions]);

  // ==========================================
  // BUDGET CALCULATIONS
  // ==========================================

  const monthlyBudget =
    Number(budget?.monthlyBudget) || 0;

  const budgetRemaining =
    monthlyBudget -
    currentMonthExpenses;

  let budgetPercentage = 0;

  if (monthlyBudget > 0) {
    budgetPercentage =
      (currentMonthExpenses /
        monthlyBudget) *
      100;
  }

  const progressWidth = Math.min(
    Math.max(budgetPercentage, 0),
    100
  );

  // ==========================================
  // BUDGET STATUS
  // ==========================================

  let budgetStatus =
    "No budget set";

  if (monthlyBudget > 0) {
    if (budgetPercentage >= 100) {
      budgetStatus =
        "Budget exceeded";
    } else if (
      budgetPercentage >= 80
    ) {
      budgetStatus =
        "Almost reached";
    } else {
      budgetStatus =
        "Within budget";
    }
  }

  // ==========================================
  // CATEGORY BUDGET STATUS
  // ==========================================

  const categoryBudgetEntries =
    budget?.categoryBudgets
      ? Object.entries(
          budget.categoryBudgets
        )
      : [];

  // ==========================================
  // FORMAT MONEY
  // ==========================================

  const formatMoney = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen flex bg-slate-50">

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= MAIN CONTENT ================= */}

      <div className="flex-1">

        {/* ================= TOPBAR ================= */}

        <Topbar />

        {/* ================= DASHBOARD ================= */}

        <div className="p-8">

          {/* ================= BALANCE ================= */}

          <BalanceCard
            balance={balance}
          />

          {/* ================= SUMMARY ================= */}

          <SummaryCards
            income={income}
            expenses={expenses}
            savings={savings}
          />

          {/* ================= BUDGET CARD ================= */}

          <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  💰 Monthly Budget
                </h2>

                <p className="text-gray-500 mt-1">
                  Track your current month's
                  spending against your budget.
                </p>
              </div>

              {budget && (
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    budgetStatus ===
                    "Budget exceeded"
                      ? "bg-red-100 text-red-700"
                      : budgetStatus ===
                        "Almost reached"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {budgetStatus}
                </div>
              )}

            </div>

            {budgetLoading ? (

              <div className="mt-6 text-gray-500">
                Loading budget...
              </div>

            ) : !budget ? (

              /* NO BUDGET */

              <div className="mt-6 bg-gray-50 rounded-xl p-6 text-center">

                <div className="text-4xl mb-3">
                  💰
                </div>

                <h3 className="font-semibold text-gray-700 text-lg">
                  No budget set for this month
                </h3>

                <p className="text-gray-500 mt-2">
                  Go to Budget Planner and
                  set your monthly budget.
                </p>

              </div>

            ) : (

              /* BUDGET EXISTS */

              <div className="mt-6">

                {/* ================= AMOUNTS ================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* BUDGET */}

                  <div className="bg-blue-50 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Monthly Budget
                    </p>

                    <p className="text-2xl font-bold text-blue-600 mt-2">
                      {formatMoney(
                        monthlyBudget
                      )}
                    </p>

                  </div>

                  {/* SPENT */}

                  <div className="bg-red-50 rounded-xl p-5">

                    <p className="text-sm text-gray-500">
                      Spent This Month
                    </p>

                    <p className="text-2xl font-bold text-red-600 mt-2">
                      {formatMoney(
                        currentMonthExpenses
                      )}
                    </p>

                  </div>

                  {/* REMAINING */}

                  <div
                    className={`rounded-xl p-5 ${
                      budgetRemaining >= 0
                        ? "bg-green-50"
                        : "bg-red-50"
                    }`}
                  >

                    <p className="text-sm text-gray-500">
                      Remaining
                    </p>

                    <p
                      className={`text-2xl font-bold mt-2 ${
                        budgetRemaining >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {budgetRemaining >= 0
                        ? formatMoney(
                            budgetRemaining
                          )
                        : `-${formatMoney(
                            Math.abs(
                              budgetRemaining
                            )
                          )}`}
                    </p>

                    {budgetRemaining < 0 && (
                      <p className="text-xs text-red-500 mt-1">
                        Over budget
                      </p>
                    )}

                  </div>

                </div>

                {/* ================= PROGRESS ================= */}

                <div className="mt-6">

                  <div className="flex justify-between items-center mb-2">

                    <span className="text-sm font-medium text-gray-600">
                      Budget used
                    </span>

                    <span className="text-sm font-semibold text-gray-700">
                      {budgetPercentage.toFixed(
                        0
                      )}
                      %
                    </span>

                  </div>

                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        budgetPercentage >=
                        100
                          ? "bg-red-500"
                          : budgetPercentage >=
                            80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${progressWidth}%`,
                      }}
                    />

                  </div>

                </div>

                {/* ================= WARNING ================= */}

                {budgetPercentage >=
                  80 && (
                  <div
                    className={`mt-5 p-4 rounded-xl ${
                      budgetPercentage >=
                      100
                        ? "bg-red-50 text-red-700"
                        : "bg-yellow-50 text-yellow-700"
                    }`}
                  >
                    {budgetPercentage >=
                    100
                      ? "⚠️ You have exceeded your monthly budget."
                      : "⚠️ You have used more than 80% of your monthly budget."}
                  </div>
                )}

                {/* ================= CATEGORY BUDGETS ================= */}

                {categoryBudgetEntries.length >
                  0 && (
                  <div className="mt-8">

                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                      Category Budget Usage
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {categoryBudgetEntries.map(
                        ([category, limit]) => {
                          const categoryLimit =
                            Number(limit) || 0;

                          const spent =
                            Number(
                              currentMonthCategoryExpenses[
                                category
                              ]
                            ) || 0;

                          const percentage =
                            categoryLimit >
                            0
                              ? (spent /
                                  categoryLimit) *
                                100
                              : 0;

                          const width =
                            Math.min(
                              Math.max(
                                percentage,
                                0
                              ),
                              100
                            );

                          return (
                            <div
                              key={category}
                              className="border border-gray-100 rounded-xl p-4"
                            >

                              <div className="flex justify-between items-center mb-2">

                                <span className="font-semibold text-gray-700">
                                  {category}
                                </span>

                                <span className="text-sm text-gray-500">
                                  {formatMoney(
                                    spent
                                  )}{" "}
                                  /{" "}
                                  {formatMoney(
                                    categoryLimit
                                  )}
                                </span>

                              </div>

                              {categoryLimit >
                                0 ? (
                                <>
                                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                                    <div
                                      className={`h-full rounded-full ${
                                        percentage >=
                                        100
                                          ? "bg-red-500"
                                          : percentage >=
                                            80
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                      }`}
                                      style={{
                                        width: `${width}%`,
                                      }}
                                    />

                                  </div>

                                  <div className="flex justify-between mt-2">

                                    <span
                                      className={`text-xs font-semibold ${
                                        percentage >=
                                        100
                                          ? "text-red-600"
                                          : percentage >=
                                            80
                                          ? "text-yellow-600"
                                          : "text-green-600"
                                      }`}
                                    >
                                      {percentage.toFixed(
                                        0
                                      )}
                                      % used
                                    </span>

                                    {percentage >=
                                      100 && (
                                      <span className="text-xs font-semibold text-red-600">
                                        ⚠️ Over budget
                                      </span>
                                    )}

                                  </div>
                                </>
                              ) : (
                                <p className="text-xs text-gray-400 mt-2">
                                  No category limit set
                                </p>
                              )}

                            </div>
                          );
                        }
                      )}

                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* ================= CHARTS ================= */}

          <div className="grid lg:grid-cols-2 gap-8 mt-8">

            <ExpenseChart
              transactions={transactions}
            />

            <IncomeExpenseChart
              transactions={transactions}
            />

          </div>

          {/* ================= TRANSACTIONS ================= */}

          <div className="mt-8">

            <RecentTransactions />

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;




