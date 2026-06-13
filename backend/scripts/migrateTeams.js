import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "../src/models/team.model.js"; // adjust path

dotenv.config({ quiet: true });
const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Team.updateMany(
      { isOut: { $exists: false } },
      { $set: { isOut: false } },
    );

    console.log("Migration done:", result.modifiedCount);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();
