// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
  },
  aadhar: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{12}$/, 'Aadhar number must be 12 digits'],
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true,
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  isVerified: { 
    type: Boolean, 
    default: false 
  },

  // 🔹 New fields for banking
  balance: { 
    type: Number, 
    default: 0.0 
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction"
    }
  ]

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
