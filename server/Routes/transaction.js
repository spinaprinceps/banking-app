const express = require("express");
const router = express.Router();
const User = require("../Model/user");
const Transaction = require("../Model/transaction");


router.get("/history/:aadhar", async (req, res) => {
  try {
    const { aadhar } = req.params;

    // Find user
    const user = await User.findOne({ aadhar });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const transactions = await Transaction.find({
      $or: [{ sender: user._id }, { receiver: user._id }]
    })
      .populate("sender", "name aadhar")    
      .populate("receiver", "name aadhar")  
      .sort({ date: -1 });                  

    return res.status(200).json({
      balance: user.balance,
      transactions
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
