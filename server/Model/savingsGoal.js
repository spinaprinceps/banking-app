const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goalName: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 100,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  targetDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
    default: "ACTIVE",
  },
  category: {
    type: String,
    enum: ["EDUCATION", "HEALTH", "FESTIVAL", "EMERGENCY", "AGRICULTURE", "OTHER"],
    default: "OTHER",
  },
}, { timestamps: true });

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);
module.exports = SavingsGoal;
