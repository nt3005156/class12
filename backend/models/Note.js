import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    body: { type: String, required: true },
    highlights: [{ type: String }],
  },
  { _id: false }
);

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    summary: { type: String, required: true },
    order: { type: Number, default: 0 },
    category: { type: String, default: "Core" },
    tags: [{ type: String }],
    sections: [sectionSchema],
    readMinutes: { type: Number, default: 8 },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);
