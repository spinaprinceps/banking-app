// routes/payment.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const authMiddleware = require("../Middleware/middleware");
const User = require("../Model/user");
const Transaction = require("../Model/transaction");

// POST /auth/payment/transfer
router.post("/transfer", authMiddleware, async (req, res) => {
  try {
    const sender = req.user; // from middleware
    const { receiverNumber, amount, password } = req.body;

    if (!receiverNumber || !amount || !password) {
      return res.status(400).json({ message: "Receiver number, amount, and password are required" });
    }

    // Check if entered password matches sender's stored password
    const isPasswordValid = await bcrypt.compare(password, sender.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const receiver = await User.findOne({ mobile: receiverNumber });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.balance < amount) {
      const failedTx = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        status: "FAILED"
      });
      await failedTx.save();

      return res.status(400).json({ 
        message: "Insufficient balance", 
        transaction: {
          sender: sender.mobile,
          receiver: receiver.mobile,
          amount,
          status: "failed",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toISOString().split("T")[1].slice(0,5),
          type: "sent"
        } 
      });
    }

    // Deduct from sender, credit to receiver
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      status: "SUCCESS"
    });
    await transaction.save();

    const formattedTx = {
      id: transaction._id,
      sender: sender.mobile,
      receiver: receiver.mobile,
      amount,
      status: "success",
      date: transaction.date.toISOString().split("T")[0],
      time: transaction.date.toISOString().split("T")[1].slice(0,5),
      type: "sent"
    };

    return res.status(201).json({
      message: "Transaction successful",
      transaction: formattedTx,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    });

  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/payment/transfer/aadhaar
router.post("/transfer/aadhaar", authMiddleware, async (req, res) => {
  try {
    const sender = req.user; // from middleware
    const { receiverAadhaar, amount, password } = req.body;

    if (!receiverAadhaar || !amount || !password) {
      return res.status(400).json({ message: "Receiver aadhaar, amount, and password are required" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, sender.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Find receiver by aadhaar
    const receiver = await User.findOne({ aadhar: receiverAadhaar });
    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    if (sender.balance < amount) {
      const failedTx = new Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        status: "FAILED"
      });
      await failedTx.save();

      return res.status(400).json({ 
        message: "Insufficient balance", 
        transaction: {
          sender: sender.mobile,
          receiver: receiver.mobile,
          amount,
          status: "failed",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toISOString().split("T")[1].slice(0,5),
          type: "sent"
        } 
      });
    }

    // Perform transfer
    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      status: "SUCCESS"
    });
    await transaction.save();

    const formattedTx = {
      id: transaction._id,
      sender: sender.mobile,
      receiver: receiver.mobile,
      amount,
      status: "success",
      date: transaction.date.toISOString().split("T")[0],
      time: transaction.date.toISOString().split("T")[1].slice(0,5),
      type: "sent"
    };

    return res.status(201).json({
      message: "Transaction successful",
      transaction: formattedTx,
      senderBalance: sender.balance,
      receiverBalance: receiver.balance
    });

  } catch (error) {
    console.error("Aadhaar transfer error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
