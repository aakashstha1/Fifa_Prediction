import mongoose from "mongoose";
import AppError from "./AppError.js";

export const validateObjectId = (id, fieldName = "Id") => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError(`Invalid ${fieldName}`, 400);
  }
};
