// routes/transaction.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const Transaction = require("../Model/transaction");
const User = require("../Model/user");

// GET /auth/transaction/history
// Fetch transaction history for logged-in user
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id; // req.user set by authMiddleware

    // Fetch transactions where user is sender or receiver
    const transactions = await Transaction.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .sort({ date: -1 }) // latest first
      .populate("sender", "name mobile")   // fetch sender info
      .populate("receiver", "name mobile"); // fetch receiver info

    // Format response
    const formattedTransactions = transactions.map(tx => ({
      id: tx._id,
      sender: tx.sender.mobile,
      receiver: tx.receiver.mobile,
      amount: tx.amount,
      status: tx.status.toLowerCase(), // "pending", "success", "failed"
      date: tx.date.toISOString().split("T")[0], // yyyy-mm-dd
      time: tx.date.toISOString().split("T")[1].slice(0, 5), // hh:mm
      type: tx.sender._id.equals(userId) ? "sent" : "received"
    }));

    res.status(200).json({ transactions: formattedTransactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
