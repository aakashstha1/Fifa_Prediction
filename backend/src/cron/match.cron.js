import cron from "node-cron";
import Match from "../models/match.model.js";

export const startMatchCron = () => {
  cron.schedule("*/2 * * * *", async () => {
    try {
      console.log("Running match cron...");

      const now = new Date();

      const result = await Match.updateMany(
        {
          matchTime: { $lte: now },
          ended: false,
        },
        {
          $set: { ended: true },
        },
      );

      if (result.modifiedCount > 0) {
        console.log(`Updated ${result.modifiedCount} matches to ended`);
      }
    } catch (error) {
      console.error("Cron error:", error.message);
    }
  });
};
