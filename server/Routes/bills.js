const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const User = require("../Model/user");
const Bill = require("../Model/bill");

// POST /auth/bills/pay - Pay a bill
router.post("/pay", authMiddleware, async (req, res) => {
  try {
    const { billType, provider, accountNumber, amount } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!billType || !provider || !accountNumber || !amount) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct amount from user balance
    user.balance -= amount;
    await user.save();

    // Create bill record
    const bill = new Bill({
      user: user._id,
      billType,
      provider,
      accountNumber,
      amount,
      status: "SUCCESS",
    });
    await bill.save();

    res.status(201).json({
      message: "Bill payment successful",
      bill: {
        id: bill._id,
        billType: bill.billType,
        provider: bill.provider,
        amount: bill.amount,
        status: bill.status,
        paymentDate: bill.paymentDate,
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("Bill payment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/bills/history - Get bill payment history
router.get("/history", authMiddleware, async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user._id })
      .sort({ paymentDate: -1 });

    const formattedBills = bills.map(bill => ({
      id: bill._id,
      billType: bill.billType,
      provider: bill.provider,
      accountNumber: bill.accountNumber,
      amount: bill.amount,
      status: bill.status,
      paymentDate: bill.paymentDate.toISOString().split("T")[0],
      time: bill.paymentDate.toISOString().split("T")[1].slice(0, 5),
    }));

    res.status(200).json({ bills: formattedBills });
  } catch (error) {
    console.error("Error fetching bill history:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
