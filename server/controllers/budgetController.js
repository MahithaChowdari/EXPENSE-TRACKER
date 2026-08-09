import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

// ==========================================
// GET CURRENT MONTH BUDGET + SPENDING
// ==========================================

export const getBudget = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // Start of current month
    const startDate = new Date(year, month - 1, 1);

    // Start of next month
    const endDate = new Date(year, month, 1);

    // Find current month's budget
    const budget = await Budget.findOne({
      user: userId,
      month,
      year,
    });

    // Get current month's expenses
    const transactions = await Transaction.find({
      user: userId,
      type: "expense",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    // ==========================================
    // CALCULATE TOTAL SPENDING
    // ==========================================

    let totalSpent = 0;

    const categorySpent = {};

    transactions.forEach((transaction) => {
      const amount = Number(transaction.amount) || 0;

      totalSpent += amount;

      const category =
        transaction.category || "Other Expense";

      categorySpent[category] =
        (categorySpent[category] || 0) + amount;
    });

    // ==========================================
    // NO BUDGET
    // ==========================================

    if (!budget) {
      return res.status(200).json({
        success: true,
        budget: null,
        spending: {
          totalSpent,
          categorySpent,
        },
        message: "No budget found for this month",
      });
    }

    // ==========================================
    // MONTHLY CALCULATIONS
    // ==========================================

    const monthlyBudget =
      Number(budget.monthlyBudget) || 0;

    const remaining =
      monthlyBudget - totalSpent;

    const percentageUsed =
      monthlyBudget > 0
        ? (totalSpent / monthlyBudget) * 100
        : 0;

    // ==========================================
    // CATEGORY CALCULATIONS
    // ==========================================

    const categoryDetails = {};

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

    categories.forEach((category) => {
      const budgetAmount =
        Number(
          budget.categoryBudgets?.[category]
        ) || 0;

      const spentAmount =
        Number(categorySpent[category]) || 0;

      const categoryRemaining =
        budgetAmount - spentAmount;

      const categoryPercentage =
        budgetAmount > 0
          ? (spentAmount / budgetAmount) * 100
          : 0;

      categoryDetails[category] = {
        budget: budgetAmount,
        spent: spentAmount,
        remaining: categoryRemaining,
        percentageUsed: categoryPercentage,
        exceeded:
          budgetAmount > 0 &&
          spentAmount > budgetAmount,
      };
    });

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(200).json({
      success: true,

      budget: {
        id: budget._id,
        month: budget.month,
        year: budget.year,
        monthlyBudget,
        categoryBudgets:
          budget.categoryBudgets,
      },

      spending: {
        totalSpent,
        remaining,
        percentageUsed,
        categorySpent,
        categoryDetails,
        transactionCount:
          transactions.length,
      },
    });
  } catch (error) {
    console.error(
      "Get budget error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get budget",
    });
  }
};

// ==========================================
// SAVE / UPDATE CURRENT MONTH BUDGET
// ==========================================

export const saveBudget = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      monthlyBudget,
      categoryBudgets,
    } = req.body;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // ==========================================
    // VALIDATE MONTHLY BUDGET
    // ==========================================

    if (
      monthlyBudget === undefined ||
      monthlyBudget === null ||
      Number(monthlyBudget) <= 0
    ) {
      return res.status(400).json({
        message:
          "Please enter a valid monthly budget",
      });
    }

    // ==========================================
    // CLEAN CATEGORY BUDGETS
    // ==========================================

    const cleanedCategoryBudgets = {
      Food: Number(categoryBudgets?.Food) || 0,

      Travel:
        Number(categoryBudgets?.Travel) || 0,

      Shopping:
        Number(categoryBudgets?.Shopping) || 0,

      Bills:
        Number(categoryBudgets?.Bills) || 0,

      Education:
        Number(categoryBudgets?.Education) || 0,

      Health:
        Number(categoryBudgets?.Health) || 0,

      Entertainment:
        Number(
          categoryBudgets?.Entertainment
        ) || 0,

      Business:
        Number(categoryBudgets?.Business) || 0,

      "Other Expense":
        Number(
          categoryBudgets?.["Other Expense"]
        ) || 0,
    };

    // ==========================================
    // FIND EXISTING BUDGET
    // ==========================================

    let budget = await Budget.findOne({
      user: userId,
      month,
      year,
    });

    if (budget) {
      // Update
      budget.monthlyBudget =
        Number(monthlyBudget);

      budget.categoryBudgets =
        cleanedCategoryBudgets;

      await budget.save();
    } else {
      // Create
      budget = await Budget.create({
        user: userId,
        month,
        year,
        monthlyBudget:
          Number(monthlyBudget),
        categoryBudgets:
          cleanedCategoryBudgets,
      });
    }

    console.log(
      "Budget saved:",
      budget._id
    );

    return res.status(200).json({
      success: true,
      message: "Budget saved successfully",
      budget,
    });
  } catch (error) {
    console.error(
      "Save budget error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to save budget",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE CURRENT MONTH BUDGET
// ==========================================

export const deleteBudget = async (req, res) => {
  try {
    const userId = req.user.id;

    const now = new Date();

    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    const budget =
      await Budget.findOneAndDelete({
        user: userId,
        month,
        year,
      });

    if (!budget) {
      return res.status(404).json({
        message: "Budget not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Budget deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete budget error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete budget",
      error: error.message,
    });
  }
};