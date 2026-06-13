import { loginUser, registerUser } from "../services/auth.service.js";

// ------------------------------------------- Register -------------------------------------------
export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------- Login -------------------------------------------
export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.json({
      message: "Logged in successfully",
      user: userObj,
      token
    });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------- Logout -------------------------------------------
export const logout = (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.json({ message: "Logged out successfully" });
};
