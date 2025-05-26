import mongoose from "mongoose";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected: ", conn.connection.host);
      await createDefaultAdmin();
  } catch (error) {
    console.log(error);
  }
};

const createDefaultAdmin = async () => {
  const { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD } = process.env;

  if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
    console.warn("⚠️  Admin credentials missing in .env - skipping setup");
    return;
  }

  const existingAdmin = await User.findOne({ email: DEFAULT_ADMIN_EMAIL });
  if (existingAdmin) {
    return;
  }

  await User.create({
    email: DEFAULT_ADMIN_EMAIL,
    password: await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10),
    role: "admin",
    isVerified: true,
  });

  console.log("Default admin created:", DEFAULT_ADMIN_EMAIL);
};

export default connectDB;
