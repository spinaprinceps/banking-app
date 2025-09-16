// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const twilio = require('twilio');


const User = require('../Model/user.js');

const router = express.Router();
const JWT_SECRET =  'defaultsecret';

// Twilio (Verify service) 
const TWILIO_ACCOUNT_SID=process.env.TWILIO_ACCOUNT_SID
const TWILIO_AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN
const TWILIO_VERIFY_SID=process.env.TWILIO_VERIFY_SID
// required for Verify usage

if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_VERIFY_SID) {
  console.warn('TWILIO environment variables are not fully set. Twilio Verify calls will fail until TWILIO_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SID are present.');
}
const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

/* -------------------- Validation Schemas -------------------- */
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  aadhar: z.string().regex(/^\d{12}$/, 'Aadhar number must be 12 digits'),
  gender: z.enum(['Male', 'Female', 'Other']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
const loginSchema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});


/* -------------------- Helper: send verification (Twilio Verify) -------------------- */
async function sendVerificationSms(mobile) {
  // mobile must be 10-digit string -> prefix with country code (India assumed)
  const to = `+91${mobile}`;
  if (!TWILIO_VERIFY_SID) throw new Error('TWILIO_VERIFY_SID not configured');

  return twilioClient.verify
    .services(TWILIO_VERIFY_SID)
    .verifications.create({ to, channel: 'sms' });
}

async function checkVerificationCode(mobile, code) {
  const to = `+91${mobile}`;
  if (!TWILIO_VERIFY_SID) throw new Error('TWILIO_VERIFY_SID not configured');

  return twilioClient.verify
    .services(TWILIO_VERIFY_SID)
    .verificationChecks.create({ to, code });
}

/* -------------------- Signup: create user + send OTP -------------------- */
router.post('/signup', async (req, res) => {
  try {
    const { name, mobile, aadhar, gender, password } = signupSchema.parse(req.body);

    // Check duplicates by mobile or aadhar
    const existing = await User.findOne({ $or: [{ mobile }, { aadhar }] });
    if (existing) {
      return res.status(400).json({ message: 'User with this mobile or aadhar already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      mobile,
      aadhar,
      gender,
      password: hashedPassword,
      isVerified: false,
    });
    await user.save();

    // Send verification code (Twilio Verify)
    await sendVerificationSms(mobile);

    return res.status(201).json({ message: 'User created. OTP sent to mobile for verification.' });
  } catch (err) {
    // zod throws an error with issues array; send useful error message
    if (err?.errors || err?.issues) {
      return res.status(400).json({ error: err.message, details: err.issues || err.errors });
    }
    return res.status(400).json({ error: err.message });
  }
});

/* -------------------- Verify signup OTP -------------------- */
router.post('/verify-signup-otp', async (req, res) => {
  try {
    const { mobile, code } = z.object({
      mobile: z.string().regex(/^\d{10}$/, 'Mobile number must be 10 digits'),
      code: z.string().min(4),
    }).parse(req.body);

    const verification = await checkVerificationCode(mobile, code);

    if (verification.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOneAndUpdate(
      { mobile },
      { isVerified: true },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ message: 'User verified successfully' });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/* -------------------- Login: mobile + password -> send OTP -------------------- */
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = z.object({
      mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
    }).parse(req.body);

    // Check if user exists
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: 'Invalid mobile or password' });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid mobile or password' });

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(400).json({ message: 'Account not verified. Please complete mobile verification.' });
    }

    // Send OTP for login confirmation
    await sendVerificationSms(user.mobile);

    return res.json({ 
      message: 'Password verified — OTP sent to mobile. Use /verify-login-otp to complete login.' 
    });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

/* -------------------- Verify login OTP -> issue JWT -------------------- */
router.post('/verify-login-otp', async (req, res) => {
  try {
    const { mobile, code } = z.object({
      mobile: z.string().regex(/^\d{10}$/, 'Mobile must be 10 digits'),
      code: z.string().min(4, 'OTP must be at least 4 digits'),
    }).parse(req.body);

    // Fetch user by mobile
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Verify OTP with Twilio
    const verification = await checkVerificationCode(mobile, code);
    if (verification.status !== 'approved') {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // OTP verified => issue JWT
    const token = jwt.sign(
      { userId: user._id, mobile: user.mobile },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({ message: 'Login successful', token });

  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});


module.exports = router;
