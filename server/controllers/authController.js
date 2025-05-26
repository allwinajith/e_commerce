import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import OTP from "../models/OtpVerification.js";
import sendOTP from "../utils/sendEmail.js";

const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  }
  
  const hashed = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    email,
    password: hashed,
    role: "customer",
    isVerified: false,
  });

  const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
  const expires = new Date(Date.now() + 10 * 60 * 1000);

  await OTP.create({ email, otp, expiresAt: expires });
  await sendOTP(email, otp);

  res.status(201).json({ message: "OTP sent to email. Please verify." });
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await OTP.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await User.updateOne({ email }, { isVerified: true });
  await OTP.deleteMany({ email });

  res.json({ message: "Account verified. You can now login." });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });
  if (!user.isVerified)
    return res.status(401).json({ message: "Please verify your email first." });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      permissions: user.permissions,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role,
    permissions: user.permissions,
  });
};

export { register, login, verifyOtp };
