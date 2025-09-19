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

module.exports = router;
