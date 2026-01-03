const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  loanType: {
    type: String,
    enum: ["PERSONAL", "AGRICULTURE", "BUSINESS", "EDUCATION", "EMERGENCY"],
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
    default: 12, // 12% annual
  },
  tenure: {
    type: Number, // in months
    required: true,
  },
  monthlyEMI: {
    type: Number,
    required: true,
  },
  totalRepayment: {
    type: Number,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED", "ACTIVE", "CLOSED"],
    default: "PENDING",
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  approvalDate: {
    type: Date,
  },
  purpose: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Loan = mongoose.model("Loan", loanSchema);
module.exports = Loan;
