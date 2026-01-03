const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const SavingsGoal = require("../Model/savingsGoal");

// POST /auth/goals/create - Create a savings goal
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { goalName, targetAmount, targetDate, category } = req.body;

    if (!goalName || !targetAmount || !targetDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (targetAmount < 100) {
      return res.status(400).json({ message: "Minimum target amount is ₹100" });
    }

    const goal = new SavingsGoal({
      user: req.user._id,
      goalName,
      targetAmount,
      targetDate,
      category: category || "OTHER",
    });
    await goal.save();

    res.status(201).json({
      message: "Savings goal created successfully",
      goal: {
        id: goal._id,
        goalName: goal.goalName,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate.toISOString().split("T")[0],
        category: goal.category,
        status: goal.status,
      },
    });
  } catch (error) {
    console.error("Goal creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/goals - Get all savings goals
router.get("/", authMiddleware, async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    const formattedGoals = goals.map(goal => {
      const progress = (goal.currentAmount / goal.targetAmount) * 100;
      return {
        id: goal._id,
        goalName: goal.goalName,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount,
        targetDate: goal.targetDate.toISOString().split("T")[0],
        category: goal.category,
        status: goal.status,
        progress: Math.min(progress, 100).toFixed(1),
      };
    });

    res.status(200).json({ goals: formattedGoals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/goals/:id/contribute - Add money to savings goal
router.post("/:id/contribute", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const goal = await SavingsGoal.findOne({ _id: req.params.id, user: req.user._id });

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    goal.currentAmount += amount;

    // Check if goal completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "COMPLETED";
    }

    await goal.save();

    res.status(200).json({
      message: "Contribution successful",
      goal: {
        id: goal._id,
        currentAmount: goal.currentAmount,
        targetAmount: goal.targetAmount,
        status: goal.status,
        progress: ((goal.currentAmount / goal.targetAmount) * 100).toFixed(1),
      },
    });
  } catch (error) {
    console.error("Goal contribution error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /auth/goals/:id - Delete a goal
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!goal) {
      return res.status(404).json({ message: "Savings goal not found" });
    }

    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    console.error("Goal deletion error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
