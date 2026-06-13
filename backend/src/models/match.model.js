import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    matchNo: {
      type: Number,
      required: true,
    },
    team1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    team2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    matchTime: {
      type: Date,
      required: true,
    },

    ended: {
      type: Boolean,
      default: false,
    },
    isDraw: {
      type: Boolean,
      default: false,
    },

    winningTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

matchSchema.index({ matchTime: 1, ended: 1 });

export default mongoose.model("Match", matchSchema);
