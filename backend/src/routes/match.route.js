import express from "express";
import {
  createMatch,
  deleteMatch,
  getMatches,
  updateMatchWinner,
} from "../controllers/match.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getMatches);
router.post("/", authorizeRoles("admin"), createMatch);
router.delete("/:id", authorizeRoles("admin"), deleteMatch);
router.patch("/:id", authorizeRoles("admin"), updateMatchWinner);

export default router;
