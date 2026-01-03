const mongoose = require("mongoose");

const fixedDepositSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 1000,
  },
  interestRate: {
    type: Number,
    required: true,
    default: 7.5, // 7.5% annual
  },
  tenure: {
    type: Number, // in months
    required: true,
  },
  maturityAmount: {
    type: Number,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  maturityDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "MATURED", "CLOSED"],
    default: "ACTIVE",
  },
  autoRenew: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const FixedDeposit = mongoose.model("FixedDeposit", fixedDepositSchema);
module.exports = FixedDeposit;
