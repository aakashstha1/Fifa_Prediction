import {
  createPredictionService,
  getAllMyPredictions,
  getAllPredictions,
} from "../services/prediction.service.js";

export const createPrediction = async (req, res, next) => {
  try {
    const prediction = await createPredictionService(req.body, req.user._id);
    res
      .status(201)
      .json({ message: "Prediction created successfully", prediction });
  } catch (err) {
    next(err);
  }
};

// export const getMyPredictions = async (req, res, next) => {
//   try {
//     const predictions = await getAllMyPredictions(req.user._id);
//     res.json(predictions);
//   } catch (err) {
//     next(err);
//   }
// };

export const getMyPredictions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const result = await getAllMyPredictions(req.user._id, page, limit);

    res.json(result);
  } catch (err) {
    next(err);
  }
};

// export const getPredictions = async (req, res, next) => {
//   try {
//     const predictions = await getAllPredictions();
//     res.json(predictions);
//   } catch (err) {
//     next(err);
//   }
// };

export const getPredictions = async (req, res, next) => {
  try {
    const { userId, matchId, page, limit } = req.query;

    const predictions = await getAllPredictions({
      userId,
      matchId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    res.status(200).json(predictions);
  } catch (err) {
    next(err);
  }
};
