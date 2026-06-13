import {
  createNewTeam,
  deleteTeamName,
  getAllTeams,
  toggleTeamStatus,
} from "../services/team.service.js";

// ------------------------------------------------------------- get Teams -------------------------------------------
export const getTeams = async (req, res, next) => {
  try {
    const teams = await getAllTeams();
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------- Create Team -------------------------------------------
export const createTeam = async (req, res, next) => {
  try {
    const team = await createNewTeam(req.body);
    res.status(201).json({ message: "Team created successfully", team });
  } catch (err) {
    next(err);
  }
};

// ------------------------------------------- Delete Team -------------------------------------------
export const deleteTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;
    const team = await deleteTeamName(teamId);
    res.json({ message: "Team deleted successfully", team });
  } catch (err) {
    next(err);
  }
};

export const toggleTeam = async (req, res, next) => {
  try {
    const teamId = req.params.id;

    const team = await toggleTeamStatus(teamId);

    res.json({
      message: `Team ${team.isOut ? "disabled" : "enabled"} successfully`,
      team,
    });
  } catch (err) {
    next(err);
  }
};