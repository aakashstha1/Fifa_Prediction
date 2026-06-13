import Match from "../models/match.model.js";
import User from "../models/user.model.js";
import Team from "../models/team.model.js";
import Prediction from "../models/prediction.model.js";
import { validateObjectId } from "../utils/MongooseIdValidator.js";
import AppError from "../utils/AppError.js";
import { DateTime } from "luxon";

// ------------------------------------------------- Create Match -------------------------------------------
export const createMatchService = async (matchData) => {
  const { team1, team2, matchNo } = matchData;

  if (!matchNo) {
    throw new AppError("matchNo is required", 400);
  }

  const matchTime = DateTime.fromISO(matchData.matchTime, {
    zone: "Asia/Kathmandu",
  })
    .toUTC()
    .toJSDate();

  if (team1 === team2) {
    throw new AppError("Teams must be different", 400);
  }

  const [t1, t2] = await Promise.all([
    Team.findById(team1),
    Team.findById(team2),
  ]);

  if (!t1 || !t2) {
    throw new AppError("Team not found", 404);
  }

  const existingMatch = await Match.findOne({ matchNo });

  if (existingMatch) {
    throw new AppError("Match number already exists", 400);
  }

  const match = await Match.create({
    ...matchData,
    matchTime,
  });

  return match;
};

// ------------------------------------------------ Get All Matches -------------------------------------------

export const getAllMatches = async () => {
  const matches = await Match.find()
    .populate("team1")
    .populate("team2")
    .populate("winningTeam")
    .sort({ matchNo: 1 });
  return matches;
};

// ---------------------------------------------- Delete Match -------------------------------------------
export const deleteMatchService = async (id) => {
  validateObjectId(id, "matchId");
  const match = await Match.findByIdAndDelete(id);
  return match;
};

// ------------------------------------------------------- Update Match -------------------------------------------

// export const updateMatchWin = async (id, teamId) => {
//   console.log(id, teamId);
//   validateObjectId(id, "matchId");
//   validateObjectId(teamId, "teamId");

//   const match = await Match.findById(id);

//   if (!match) {
//     throw new Error("Match not found");
//   }

//   if (match.team1.toString() !== teamId && match.team2.toString() !== teamId) {
//     throw new Error("Winning team must be one of the teams in the match");
//   }

//   match.winningTeam = teamId;
//   match.ended = true;

//   await match.save();

//   const predictions = await Prediction.find({ match: id });

//   const userUpdates = [];

//   const bulkPredictions = predictions.map((p) => {
//     const isCorrect = p.predictedWinner.toString() === teamId;

//     userUpdates.push({
//       updateOne: {
//         filter: { _id: p.user },
//         update: {
//           $inc: {
//             correctPredictions: isCorrect ? 1 : 0,
//             wrongPredictions: isCorrect ? 0 : 1,
//           },
//         },
//       },
//     });

//     return {
//       updateOne: {
//         filter: { _id: p._id },
//         update: {
//           $set: { isCorrect },
//         },
//       },
//     };
//   });

//   await Prediction.bulkWrite(bulkPredictions);
//   await User.bulkWrite(userUpdates);

//   return match;
// };

export const updateMatchWin = async (id, { teamId, isDraw }) => {

  validateObjectId(id, "matchId");

  // ❌ prevent both
  if (teamId && isDraw) {
    throw new Error("Provide either teamId or isDraw, not both");
  }

  const match = await Match.findById(id);

  if (!match) {
    throw new Error("Match not found");
  }

  const predictions = await Prediction.find({ match: id });

  // =====================================================
  // CASE 1: DRAW MATCH
  // =====================================================
  if (isDraw === true) {
    match.isDraw = true;
    match.winningTeam = null;
    match.ended = true;

    await match.save();

    const bulkPredictions = [];
    const userUpdates = [];

    predictions.forEach((p) => {
      bulkPredictions.push({
        updateOne: {
          filter: { _id: p._id },
          update: {
            $set: { isCorrect: false },
          },
        },
      });

      userUpdates.push({
        updateOne: {
          filter: { _id: p.user },
          update: {
            $inc: {
              wrongPredictions: 1,
            },
          },
        },
      });
    });

    await Prediction.bulkWrite(bulkPredictions);
    await User.bulkWrite(userUpdates);

    return match;
  }

  // =====================================================
  // CASE 2: WINNER TEAM
  // =====================================================
  if (teamId) {
    validateObjectId(teamId, "teamId");

    if (
      match.team1.toString() !== teamId &&
      match.team2.toString() !== teamId
    ) {
      throw new Error("Winning team must be one of the teams in the match");
    }

    match.winningTeam = teamId;
    match.isDraw = false;
    match.ended = true;

    await match.save();

    const bulkPredictions = [];
    const userUpdates = [];

    predictions.forEach((p) => {
      const isCorrect = p.predictedWinner.toString() === teamId;

      bulkPredictions.push({
        updateOne: {
          filter: { _id: p._id },
          update: {
            $set: { isCorrect },
          },
        },
      });

      userUpdates.push({
        updateOne: {
          filter: { _id: p.user },
          update: {
            $inc: {
              correctPredictions: isCorrect ? 1 : 0,
              wrongPredictions: isCorrect ? 0 : 1,
            },
          },
        },
      });
    });

    await Prediction.bulkWrite(bulkPredictions);
    await User.bulkWrite(userUpdates);

    return match;
  }

  // =====================================================
  // INVALID INPUT
  // =====================================================
  throw new Error("Either teamId or isDraw must be provided");
};
