import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isOut: {
    type: Boolean,
    default: false,
  },
});

teamSchema.index(
  { name: 1 },
  {
    unique: true,
    collation: { locale: "en", strength: 2 },
  },
);

export default mongoose.model("Team", teamSchema);
