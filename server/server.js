import "dotenv/config";
console.log("EMAIL_USER exists:", Boolean(process.env.EMAIL_USER));
console.log(
  "EMAIL_PASSWORD exists:",
  Boolean(process.env.EMAIL_PASSWORD)
);
console.log(
  "EMAIL_FROM exists:",
  Boolean(process.env.EMAIL_FROM)
);
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use(
  "/api/analytics",
  analyticsRoutes
);
// Test Route
app.get("/", (req, res) => {
  res.send("Expense Tracker API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});