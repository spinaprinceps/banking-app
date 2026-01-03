const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  billType: {
    type: String,
    enum: ["ELECTRICITY", "WATER", "PHONE_RECHARGE", "GAS", "BROADBAND"],
    required: true,
  },
  provider: {
    type: String,
    required: true,
  },
  accountNumber: {
    type: String,
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
    default: "SUCCESS",
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Bill = mongoose.model("Bill", billSchema);
module.exports = Bill;
