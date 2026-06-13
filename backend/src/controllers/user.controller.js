import { getAllUsers, getUserProfile } from "../services/user.service.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user._id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

// ----------------------------------------- get Users -------------------------------------------

export const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};