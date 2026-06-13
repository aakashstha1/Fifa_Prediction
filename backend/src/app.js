import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import teamRoutes from "./routes/team.route.js";
import matchRoutes from "./routes/match.route.js";
import predictionRoutes from "./routes/prediction.route.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/health", (req, res) => {
  res.send("OK");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/predictions", predictionRoutes);

app.use(errorHandler);

export default app;
