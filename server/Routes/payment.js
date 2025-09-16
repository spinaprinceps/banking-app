const express = require("express");
const router = express.Router();
const User = require("../Model/user");
const Transaction = require("../Model/transaction");

// 🔹 Transfer money
router.post("/transfer", async (req, res) => {
  try {
    const { senderAadhar, receiverAadhar, amount } = req.body;

    // Validate input
    if (!senderAadhar || !receiverAadhar || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find sender and receiver
    const sender = await User.findOne({ aadhar: senderAadhar });
    const receiver = await User.findOne({ aadhar: receiverAadhar });

    if (!sender || !receiver) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    // Check balance
    if (sender.balance < amount) {
      // Record failed transaction
      const failedTx = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        status: "FAILED"
      });
      await failedTx.save();

      return res.status(400).json({ message: "Insufficient balance", transaction: failedTx });
    }

    // Deduct from sender, credit to receiver
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    // Create transaction record
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      status: "SUCCESS"
    });

    await transaction.save();

    return res.status(201).json({
      message: "Transaction successful",
      transaction,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    });

  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
