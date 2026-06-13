import rateLimit from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});

export const modifyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many requests, please slow down.",
});
