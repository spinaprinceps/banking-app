// routes/transaction.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const Transaction = require("../Model/transaction");
const User = require("../Model/user");

// GET /auth/transaction/history
// Fetch transaction history for logged-in user with filters
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, type, status, search } = req.query;

    // Build query
    let query = {
      $or: [{ sender: userId }, { receiver: userId }]
    };

    // Date filter
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    // Status filter
    if (status) {
      query.status = status.toUpperCase();
    }

    // Fetch transactions
    let transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .populate("sender", "name mobile")
      .populate("receiver", "name mobile");

    // Format response
    let formattedTransactions = transactions.map(tx => ({
      id: tx._id,
      sender: tx.sender.mobile,
      senderName: tx.sender.name,
      receiver: tx.receiver.mobile,
      receiverName: tx.receiver.name,
      amount: tx.amount,
      status: tx.status.toLowerCase(),
      date: tx.date.toISOString().split("T")[0],
      time: tx.date.toISOString().split("T")[1].slice(0, 5),
      type: tx.sender._id.equals(userId) ? "sent" : "received"
    }));

    // Type filter (sent/received)
    if (type) {
      formattedTransactions = formattedTransactions.filter(tx => tx.type === type);
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      formattedTransactions = formattedTransactions.filter(tx =>
        tx.sender.includes(search) ||
        tx.receiver.includes(search) ||
        tx.senderName.toLowerCase().includes(searchLower) ||
        tx.receiverName.toLowerCase().includes(searchLower) ||
        tx.amount.toString().includes(search)
      );
    }

    res.status(200).json({ transactions: formattedTransactions });
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
