import {
  createMatchService,
  deleteMatchService,
  getAllMatches,
  updateMatchWin,
} from "../services/match.service.js";

export const createMatch = async (req, res, next) => {
  try {
    const match = await createMatchService(req.body);
    res.status(201).json({ message: "Match created successfully", match });
  } catch (err) {
    next(err);
  }
};

export const getMatches = async (req, res, next) => {
  try {
    const matches = await getAllMatches();
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const deleteMatch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const match = await deleteMatchService(id);
    res.json({ message: "Match deleted successfully", match });
  } catch (err) {
    next(err);
  }
};

export const updateMatchWinner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { teamId, isDraw } = req.body;

    const match = await updateMatchWin(id, { teamId, isDraw });

    res.json({
      message: "Match updated successfully",
      match,
    });
  } catch (err) {
    next(err);
  }
};
