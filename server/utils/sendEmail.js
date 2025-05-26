import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    html: `<h3>Please enter the below OTP in your verification section <h2> OTP: ${otp} </h2> Don't share your OTP with anyone</h3>`,
  };

  return transporter.sendMail(mailOptions);
};

export default sendOTP;
