const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  date: {
    type: Date,
    default: Date.now,   // 🔹 Explicit transaction date
  }
}, { timestamps: true }); // 🔹 Auto adds createdAt, updatedAt

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
