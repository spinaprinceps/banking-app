const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const User = require("../Model/user");
const FixedDeposit = require("../Model/fixedDeposit");

// Calculate maturity amount
const calculateMaturityAmount = (principal, rate, tenure) => {
  // Simple interest calculation: A = P(1 + rt/12)
  const amount = principal * (1 + (rate * tenure) / (12 * 100));
  return Math.round(amount * 100) / 100;
};

// POST /auth/fd/create - Create a fixed deposit
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { amount, tenure } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!amount || !tenure) {
      return res.status(400).json({ message: "Amount and tenure are required" });
    }

    if (amount < 1000) {
      return res.status(400).json({ message: "Minimum FD amount is ₹1000" });
    }

    if (tenure < 6 || tenure > 120) {
      return res.status(400).json({ message: "Tenure must be between 6-120 months" });
    }

    if (user.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Interest rates based on tenure
    let interestRate = 6.5;
    if (tenure >= 12) interestRate = 7.0;
    if (tenure >= 24) interestRate = 7.5;
    if (tenure >= 36) interestRate = 8.0;

    const maturityAmount = calculateMaturityAmount(amount, interestRate, tenure);
    const startDate = new Date();
    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenure);

    // Deduct from balance
    user.balance -= amount;
    await user.save();

    const fd = new FixedDeposit({
      user: user._id,
      amount,
      interestRate,
      tenure,
      maturityAmount,
      startDate,
      maturityDate,
    });
    await fd.save();

    res.status(201).json({
      message: "Fixed deposit created successfully",
      fd: {
        id: fd._id,
        amount: fd.amount,
        interestRate: fd.interestRate,
        tenure: fd.tenure,
        maturityAmount: fd.maturityAmount,
        startDate: fd.startDate.toISOString().split("T")[0],
        maturityDate: fd.maturityDate.toISOString().split("T")[0],
        status: fd.status,
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("FD creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/fd - Get all fixed deposits
router.get("/", authMiddleware, async (req, res) => {
  try {
    const fds = await FixedDeposit.find({ user: req.user._id })
      .sort({ startDate: -1 });

    const formattedFDs = fds.map(fd => ({
      id: fd._id,
      amount: fd.amount,
      interestRate: fd.interestRate,
      tenure: fd.tenure,
      maturityAmount: fd.maturityAmount,
      startDate: fd.startDate.toISOString().split("T")[0],
      maturityDate: fd.maturityDate.toISOString().split("T")[0],
      status: fd.status,
      autoRenew: fd.autoRenew,
    }));

    res.status(200).json({ fds: formattedFDs });
  } catch (error) {
    console.error("Error fetching FDs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/fd/:id/close - Close/withdraw FD
router.post("/:id/close", authMiddleware, async (req, res) => {
  try {
    const fd = await FixedDeposit.findOne({ _id: req.params.id, user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!fd) {
      return res.status(404).json({ message: "Fixed deposit not found" });
    }

    if (fd.status === "CLOSED") {
      return res.status(400).json({ message: "FD already closed" });
    }

    const currentDate = new Date();
    let amountToCredit = fd.amount;

    // Check if matured
    if (currentDate >= fd.maturityDate) {
      amountToCredit = fd.maturityAmount;
      fd.status = "MATURED";
    } else {
      // Premature withdrawal - only principal
      fd.status = "CLOSED";
    }

    // Credit to balance
    user.balance += amountToCredit;
    await user.save();
    await fd.save();

    res.status(200).json({
      message: fd.status === "MATURED" ? "FD matured and credited" : "FD closed (premature)",
      amountCredited: amountToCredit,
      balance: user.balance,
    });
  } catch (error) {
    console.error("FD closure error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
