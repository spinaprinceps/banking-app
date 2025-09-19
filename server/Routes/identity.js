// routes/auth.js
const express = require("express");
const authMiddleware = require("../Middleware/middleware.js");
const User = require("../Model/user.js");

const router = express.Router();

// Fetch logged-in user identity
router.get("/identity", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name mobile aadhar gender balance");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    res.status(200).json({
      user: {
        name: user.name,
        mobile: user.mobile,
        aadhar: user.aadhar,
        gender: user.gender,
        balance:user.balance
      },
    });
  } catch (err) {
    console.error("Error fetching identity:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
