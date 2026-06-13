import AppError from "../utils/AppError.js";
import User from "../models/user.model.js";

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

// -------------------------------------------------- Get All Users -------------------------------------------
export const getAllUsers = async () => {
  const users = await User.find({ role: { $ne: "admin" } });
  return users;
};
