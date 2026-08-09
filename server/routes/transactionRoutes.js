import express from "express";

import {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Add transaction
router.post(
  "/",
  authMiddleware,
  addTransaction
);


// Get transactions
router.get(
  "/",
  authMiddleware,
  getTransactions
);


// Update transaction
router.put(
  "/:id",
  authMiddleware,
  updateTransaction
);


// Delete transaction
router.delete(
  "/:id",
  authMiddleware,
  deleteTransaction
);


export default router;