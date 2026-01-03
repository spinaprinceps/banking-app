const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
  },
  method: {
    type: String,
    enum: ["ATM", "BRANCH", "AGENT"],
    default: "ATM",
  },
  location: {
    type: String,
  },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED"],
    default: "SUCCESS",
  },
  withdrawalDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);
module.exports = Withdrawal;
