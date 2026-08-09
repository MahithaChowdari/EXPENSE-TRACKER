import Transaction from "../models/Transaction.js";

export const getAnalytics = async (req, res) => {
  try {
    // ==========================================
    // CURRENT USER
    // ==========================================

    const userId = req.user.id;

    // Get ONLY this user's transactions
    const transactions = await Transaction.find({
      user: userId,
    }).sort({
      date: -1,
      createdAt: -1,
    });
    console.log("Analytics User ID:", userId);

console.log(
  "Transactions found:",
  transactions.length
);

console.log(
  "Transactions:",
  transactions.map((t) => ({
    id: t._id,
    title: t.title,
    amount: t.amount,
    type: t.type,
    category: t.category,
    user: t.user,
  }))
);

    // ==========================================
    // BASIC TOTALS
    // ==========================================

    let totalIncome = 0;
    let totalExpenses = 0;

    // ==========================================
    // CATEGORY TOTALS
    // ==========================================

    const categoryTotals = {};

    // ==========================================
    // MONTHLY TOTALS
    // ==========================================

    const monthlyTotals = {};

    // ==========================================
    // HIGHEST EXPENSE
    // ==========================================

    let highestExpense = null;

    // ==========================================
    // PROCESS TRANSACTIONS
    // ==========================================

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;

      // ----------------------------------------
      // INCOME
      // ----------------------------------------

      if (transaction.type === "income") {
        totalIncome += amount;
      }

      // ----------------------------------------
      // EXPENSE
      // ----------------------------------------

      if (transaction.type === "expense") {
        totalExpenses += amount;

        // Category
        const category =
          transaction.category || "Other Expense";

        categoryTotals[category] =
          (categoryTotals[category] || 0) + amount;

        // Highest expense
        if (
          !highestExpense ||
          amount > Number(highestExpense.amount)
        ) {
          highestExpense = transaction;
        }
      }

      // ========================================
      // MONTHLY ANALYTICS
      // ========================================

      const transactionDate = new Date(
        transaction.date
      );

      if (!isNaN(transactionDate.getTime())) {
        const year =
          transactionDate.getFullYear();

        const month =
          transactionDate.getMonth();

        const monthKey =
          `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}`;

        if (!monthlyTotals[monthKey]) {
          monthlyTotals[monthKey] = {
            year,
            month,
            income: 0,
            expenses: 0,
          };
        }

        if (transaction.type === "income") {
          monthlyTotals[monthKey].income +=
            amount;
        }

        if (transaction.type === "expense") {
          monthlyTotals[monthKey].expenses +=
            amount;
        }
      }
    });

    // ==========================================
    // BALANCE
    // ==========================================

    const balance =
      totalIncome - totalExpenses;

    // ==========================================
    // TRANSACTION COUNTS
    // ==========================================

    const expenseTransactions =
      transactions.filter(
        (transaction) =>
          transaction.type === "expense"
      );

    const incomeTransactions =
      transactions.filter(
        (transaction) =>
          transaction.type === "income"
      );

    // ==========================================
    // AVERAGE EXPENSE
    // ==========================================

    const averageExpense =
      expenseTransactions.length > 0
        ? totalExpenses /
          expenseTransactions.length
        : 0;

    // ==========================================
    // SAVINGS RATE
    // ==========================================

    const savingsRate =
      totalIncome > 0
        ? (balance / totalIncome) * 100
        : 0;

    // ==========================================
    // MONTHLY ANALYTICS ARRAY
    // ==========================================

    const monthlyAnalytics = Object.entries(
      monthlyTotals
    )
      .map(([key, data]) => {
        const monthName = new Date(
          data.year,
          data.month
        ).toLocaleString("en-US", {
          month: "long",
        });

        return {
          month: `${monthName} ${data.year}`,
          income: data.income,
          expenses: data.expenses,
          balance:
            data.income - data.expenses,
        };
      })
      .sort((a, b) => {
        return (
          new Date(`1 ${b.month}`) -
          new Date(`1 ${a.month}`)
        );
      });

    // ==========================================
    // CATEGORY ARRAY
    // ==========================================

    const expenseByCategory =
      Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount,
        }))
        .sort(
          (a, b) =>
            b.amount - a.amount
        );

    // ==========================================
    // SEND RESPONSE
    // ==========================================

    res.status(200).json({
      success: true,

      analytics: {
        // --------------------------------------
        // SUMMARY
        // --------------------------------------

        summary: {
          totalIncome,
          totalExpenses,
          balance,
          averageExpense,
          savingsRate,
        },

        // --------------------------------------
        // CATEGORY DATA
        // --------------------------------------

        expenseByCategory,

        // --------------------------------------
        // MONTHLY DATA
        // --------------------------------------

        monthlyAnalytics,

        // --------------------------------------
        // HIGHEST EXPENSE
        // --------------------------------------

        highestExpense,

        // --------------------------------------
        // COUNTS
        // --------------------------------------

        transactionCount:
          transactions.length,

        incomeTransactionCount:
          incomeTransactions.length,

        expenseTransactionCount:
          expenseTransactions.length,
      },
    });
  } catch (error) {
    console.error(
      "Analytics Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load analytics",
    });
  }
};