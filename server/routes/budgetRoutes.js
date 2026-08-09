import express from "express";

import {
  getBudget,
  saveBudget,
  deleteBudget,
} from "../controllers/budgetController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getBudget);

router.post("/", authMiddleware, saveBudget);

router.delete("/", authMiddleware, deleteBudget);

export default router;