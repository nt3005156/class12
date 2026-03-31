import mongoose from "mongoose";

const siteStatSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, trim: true },
    count: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model("SiteStat", siteStatSchema);
