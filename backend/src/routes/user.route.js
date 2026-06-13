import express from "express";
import { getMe, getUsers } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getUsers);
router.get("/me", getMe);

export default router;
