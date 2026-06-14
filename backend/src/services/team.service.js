import AppError from "../utils/AppError.js";
import Team from "../models/team.model.js";
import mongoose from "mongoose";

export const getAllTeams = async () => {
  const teams = await Team.find().sort({ name: 1 });
  return teams;
};

// --------------------------------------------------- Create New Team -------------------------------------------
export const createNewTeam = async ({ name }) => {
  const existing = await Team.findOne({
    name: new RegExp(`^${name}$`, "i"),
  });

  if (existing) {
    throw new AppError("Team already exists", 400);
  }

  const team = new Team({ name });

  await team.save();

  return team;
};

// --------------------------------------------------- Delete Team -------------------------------------------
export const deleteTeamName = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid team id", 400);
  }
  const team = await Team.findByIdAndDelete(id);

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  return team;
};

export const toggleTeamStatus = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new AppError("Invalid team id", 400);
  }

  const team = await Team.findById(id);

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  team.isOut = !team.isOut;

  await team.save();

  return team;
};
