import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";


// ======================================================
// REGISTER USER
// ======================================================

export const registerUser = async (req, res) => {
  try {
    const {
      fullName,
      username,
      email,
      password,
    } = req.body;

    if (
      !fullName ||
      !username ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const existingEmail = await User.findOne({
      email,
    });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const existingUsername = await User.findOne({
      username,
    });

    if (existingUsername) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Registration Successful",

      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ======================================================
// LOGIN USER
// ======================================================

export const loginUser = async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      token,

      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ======================================================
// ADD TRANSACTION
// ======================================================

export const addTransaction = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      title,
      amount,
      category,
      type,
      date,
      customCategory,
    } = req.body;

    if (
      !title ||
      !amount ||
      !category ||
      !type
    ) {
      return res.status(400).json({
        message:
          "Please fill all required fields",
      });
    }

    const transaction =
      await Transaction.create({
        title,
        amount,
        category,
        customCategory:
          customCategory || "",
        type,
        date: date || new Date(),
        user: req.user.id,
      });

    res.status(201).json({
      success: true,
      message:
        "Transaction added successfully",
      transaction,
    });

  } catch (error) {
    console.error(
      "Add Transaction Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ======================================================
// GET TRANSACTIONS
// ======================================================

export const getTransactions = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const transactions =
      await Transaction.find({
        user: req.user.id,
      }).sort({
        date: -1,
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      transactions,
    });

  } catch (error) {
    console.error(
      "Get Transactions Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ======================================================
// UPDATE TRANSACTION
// ======================================================

export const updateTransaction = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const {
      title,
      amount,
      category,
      type,
      date,
      customCategory,
    } = req.body;

    if (
      !title ||
      !amount ||
      !category ||
      !type
    ) {
      return res.status(400).json({
        message:
          "Please fill all required fields",
      });
    }

    const transaction =
      await Transaction.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user.id,
        },
        {
          title,
          amount,
          category,
          type,
          date,
          customCategory:
            customCategory || "",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Transaction updated successfully",
      transaction,
    });

  } catch (error) {
    console.error(
      "Update Transaction Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};


// ======================================================
// DELETE TRANSACTION
// ======================================================

export const deleteTransaction = async (
  req,
  res
) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const transaction =
      await Transaction.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!transaction) {
      return res.status(404).json({
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Transaction deleted successfully",
    });

  } catch (error) {
    console.error(
      "Delete Transaction Error:",
      error
    );

    res.status(500).json({
      message: "Server Error",
    });
  }
};