import mongoose from "mongoose";

const optschema = new mongoose.Schema({
  email: String,
  otp: String,
  expiresAt: Date,
});

const OTP = mongoose.model("OtpVerification", optschema);
export default OTP;
