import app from "./src/app.js";
import dotenv from "dotenv";

import { ConnectDB } from "./src/configs/db-config.js";
// import { startMatchCron } from "./src/cron/match.cron.js";

dotenv.config({ quiet: true });

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ConnectDB();

    // startMatchCron();

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
