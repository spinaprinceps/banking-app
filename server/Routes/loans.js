const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/middleware");
const User = require("../Model/user");
const Loan = require("../Model/loan");

// Calculate EMI
const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi * 100) / 100;
};

// POST /auth/loans/apply - Apply for a loan
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { loanType, amount, tenure, purpose } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!loanType || !amount || !tenure || !purpose) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (amount < 1000) {
      return res.status(400).json({ message: "Minimum loan amount is ₹1000" });
    }

    if (tenure < 3 || tenure > 60) {
      return res.status(400).json({ message: "Tenure must be between 3-60 months" });
    }

    // Interest rates based on loan type
    const interestRates = {
      PERSONAL: 14,
      AGRICULTURE: 9,
      BUSINESS: 12,
      EDUCATION: 10,
      EMERGENCY: 15,
    };

    const interestRate = interestRates[loanType] || 12;
    const monthlyEMI = calculateEMI(amount, interestRate, tenure);
    const totalRepayment = monthlyEMI * tenure;

    const loan = new Loan({
      user: user._id,
      loanType,
      amount,
      interestRate,
      tenure,
      monthlyEMI,
      totalRepayment,
      purpose,
      status: "PENDING", // Application pending for review
    });
    await loan.save();

    res.status(201).json({
      message: "Loan application submitted successfully. It will be reviewed within 24-48 hours.",
      loan: {
        id: loan._id,
        loanType: loan.loanType,
        amount: loan.amount,
        interestRate: loan.interestRate,
        tenure: loan.tenure,
        monthlyEMI: loan.monthlyEMI,
        totalRepayment: loan.totalRepayment,
        status: loan.status,
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("Loan application error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /auth/loans - Get all loans
router.get("/", authMiddleware, async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id })
      .sort({ applicationDate: -1 });

    const formattedLoans = loans.map(loan => ({
      id: loan._id,
      loanType: loan.loanType,
      amount: loan.amount,
      interestRate: loan.interestRate,
      tenure: loan.tenure,
      monthlyEMI: loan.monthlyEMI,
      totalRepayment: loan.totalRepayment,
      amountPaid: loan.amountPaid,
      status: loan.status,
      applicationDate: loan.applicationDate.toISOString().split("T")[0],
      purpose: loan.purpose,
    }));

    res.status(200).json({ loans: formattedLoans });
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /auth/loans/:id/repay - Make EMI payment
router.post("/:id/repay", authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;
    const loan = await Loan.findOne({ _id: req.params.id, user: req.user._id });
    const user = await User.findById(req.user._id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
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

    // Update loan
    loan.amountPaid += amount;
    if (loan.amountPaid >= loan.totalRepayment) {
      loan.status = "CLOSED";
    }
    await loan.save();

    res.status(200).json({
      message: "EMI payment successful",
      loan: {
        id: loan._id,
        amountPaid: loan.amountPaid,
        remainingAmount: loan.totalRepayment - loan.amountPaid,
        status: loan.status,
      },
      balance: user.balance,
    });
  } catch (error) {
    console.error("Loan repayment error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
