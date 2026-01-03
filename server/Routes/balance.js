const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/middleware.js'); 
const User = require('../Model/user.js');

router.get('/balance', authMiddleware, async (req, res) => {
  try {
    res.status(200).json({ balance: req.user.balance });
  } catch (err) {
    console.error("Error fetching balance:", err);
    res.status(500).json({ message: "Server error" });
  } 
});

// POST /auth/balance/deposit - Add money to account (for testing/demo)
router.post('/deposit', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Valid amount is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.balance += parseFloat(amount);
    await user.save();

    res.status(200).json({ 
      message: "Deposit successful",
      balance: user.balance,
      depositedAmount: parseFloat(amount)
    });
  } catch (err) {
    console.error("Error depositing money:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
