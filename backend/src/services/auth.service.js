import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.js";
import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";

dotenv.config({ quiet: true });

// --------------------------------------------------- Register User -------------------------------------------
export const registerUser = async ({ name, email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await bcryptjs.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const { password: pwd, ...userData } = user._doc;
  return userData;
};

// --------------------------------------------------- Login User -------------------------------------------
export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const match = await bcryptjs.compare(password, user.password);

  if (!match) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = generateToken(user);

  return { user, token };
};
