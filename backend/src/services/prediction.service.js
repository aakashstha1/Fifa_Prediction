import Match from "../models/match.model.js";
import Prediction from "../models/prediction.model.js";
import Team from "../models/team.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/AppError.js";

// ---------------------------------------------------- Create Prediction -------------------------------------------
export const createPredictionService = async (data, userId) => {
  const { match: matchId, predictedWinner } = data;

  const match = await Match.findById(matchId);
  if (!match) {
    throw new AppError("Match not found", 404);
  }

  if (match.ended) {
    throw new AppError("Match already ended", 400);
  }

  const winner = await Team.findById(predictedWinner);
  if (!winner) {
    throw new AppError("Team not found", 404);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const existingPrediction = await Prediction.findOne({
    user: userId,
    match: matchId,
  });

  if (existingPrediction) {
    throw new AppError("Prediction already submitted for this match", 400);
  }

  const prediction = await Prediction.create({
    user: userId,
    match: matchId,
    predictedWinner,
  });

  return prediction;
};

// ----------------------------------------------------- Get My Predictions --------------------------------------------
export const getAllMyPredictions = async (userId) => {
  const predictions = await Prediction.find({ user: userId })
    .populate("user")
    .populate("predictedWinner")
    .populate({
      path: "match",
      populate: [{ path: "team1" }, { path: "team2" }, { path: "winningTeam" }],
    });
  return predictions;
};

// ------------------------------------------------------ Get Predictions --------------------------------------------
// export const getAllPredictions = async () => {
//   const predictions = await Prediction.find()
//     .populate("user")
//     .populate("predictedWinner")
//     .populate({
//       path: "match",
//       populate: [{ path: "team1" }, { path: "team2" }, { path: "winningTeam" }],
//     });
//   return predictions;
// };
export const getAllPredictions = async ({
  page = 1,
  limit = 20,
  userId,
  matchId,
}) => {
  const skip = (page - 1) * limit;

  const query = {};

  if (userId) query.user = userId;
  if (matchId) query.match = matchId;

  const predictions = await Prediction.find(query)
    .populate("user")
    .populate("predictedWinner")
    .populate({
      path: "match",
      populate: [{ path: "team1" }, { path: "team2" }, { path: "winningTeam" }],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Prediction.countDocuments(query);

  return {
    data: predictions,
    nextPage: page + 1,
    hasMore: skip + limit < total,
    total,
  };
};
