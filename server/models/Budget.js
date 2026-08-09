import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },

    year: {
      type: Number,
      required: true,
    },

    monthlyBudget: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    categoryBudgets: {
      Food: {
        type: Number,
        default: 0,
      },

      Travel: {
        type: Number,
        default: 0,
      },

      Shopping: {
        type: Number,
        default: 0,
      },

      Bills: {
        type: Number,
        default: 0,
      },

      Education: {
        type: Number,
        default: 0,
      },

      Health: {
        type: Number,
        default: 0,
      },

      Entertainment: {
        type: Number,
        default: 0,
      },

      Business: {
        type: Number,
        default: 0,
      },

      "Other Expense": {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

// One budget per user per month
budgetSchema.index(
  {
    user: 1,
    month: 1,
    year: 1,
  },
  {
    unique: true,
  }
);

const Budget = mongoose.model(
  "Budget",
  budgetSchema
);

export default Budget;