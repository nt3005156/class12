import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
    category: {
      type: String,
      enum: ["Question", "Feedback", "Collaboration"],
      default: "Question",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
