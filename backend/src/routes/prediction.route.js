import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createPrediction,
  getMyPredictions,
  getPredictions,
} from "../controllers/prediction.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getPredictions);
router.get("/me", authorizeRoles("user"), getMyPredictions);
router.post("/", authorizeRoles("user"), createPrediction);

export default router;
