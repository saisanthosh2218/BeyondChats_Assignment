const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const router = express.Router();

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// 📩 Send Verification Email
async function sendVerificationEmail(email, code) {
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your verification code is: ${code}`,
  });
}

// 📝 User Registration (Email & Password)
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode,
    });
    await user.save();

    await sendVerificationEmail(email, verificationCode);
    res.json({ message: "Verification code sent to your email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Verify Email Code
router.post("/verify-email", async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });
  if (user.verificationCode !== code)
    return res.status(400).json({ message: "Invalid verification code" });

  user.isVerified = true;
  await user.save();

  const token = generateToken(user);
  res.json({ message: "Email verified", token });
});

// 🔐 Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  if (!user.isVerified)
    return res.status(400).json({ message: "Please verify your email first" });

  const token = generateToken(user);
  res.json({ message: "Login successful", token });
});

// 🌍 Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173",
  }),
  (req, res) => res.redirect("http://localhost:5173/setup-org")
);

module.exports = router;
