const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const User = require("../Model/user");
const Withdrawal = require("../Model/withdrawal");

// POST /auth/withdrawals/withdraw - Withdraw cash
router.post("/withdraw", authMiddleware, async (req, res) => {
  try {
    const { amount, method, location } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from balance
    user.balance -= amount;
    await user.save();

    const withdrawal = new Withdrawal({
      user: user._id,
      amount,
      method: method || "ATM",
      location: location || "Unknown",
      status: "SUCCESS",
    });
    await withdrawal.save();

    res.status(201).json({
      message: "Withdrawal successful",
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        method: withdrawal.method,
        location: withdrawal.location,
        status: withdrawal.status,
        withdrawalDate: withdrawal.withdrawalDate.toISOString().split("T")[0],
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("Withdrawal error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/withdrawals/history - Get withdrawal history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ user: req.user._id })
      .sort({ withdrawalDate: -1 });

    const formattedWithdrawals = withdrawals.map(w => ({
      id: w._id,
      amount: w.amount,
      method: w.method,
      location: w.location,
      status: w.status,
      withdrawalDate: w.withdrawalDate.toISOString().split("T")[0],
      time: w.withdrawalDate.toISOString().split("T")[1].slice(0, 5),
    }));

    res.status(200).json({ withdrawals: formattedWithdrawals });
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
