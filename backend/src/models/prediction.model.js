import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    predictedWinner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    isCorrect: {
      type: Boolean,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

predictionSchema.index({ user: 1, match: 1 }, { unique: true });

export default mongoose.model("Prediction", predictionSchema);
