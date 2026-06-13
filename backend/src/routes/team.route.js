import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createTeam,
  deleteTeam,
  getTeams,
} from "../controllers/team.controller.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getTeams);
router.post("/", authorizeRoles("admin"), createTeam);
router.delete("/:id", authorizeRoles("admin"), deleteTeam);

export default router;
