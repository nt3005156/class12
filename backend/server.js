import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import notesRouter from "./routes/notes.js";
import adminRouter from "./routes/admin.js";
import authRouter from "./routes/auth.js";
import contactRouter from "./routes/contact.js";

const app = express();
// 5001 default: macOS often reserves 5000 for AirPlay Receiver (Control Center)
const PORT = Number(process.env.PORT) || 5001;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/class12_notes";

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "nitex-notes-api" });
});

app.use("/api/notes", notesRouter);
app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/contact", contactRouter);

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
  const server = app.listen(PORT, () =>
    console.log(`API listening on http://localhost:${PORT}`)
  );
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `\nPort ${PORT} is already in use.\n` +
          "• Stop the other process, or set a different PORT in .env (e.g. PORT=5002).\n" +
          "• On Mac, port 5000 is often taken by AirPlay: System Settings → AirDrop & Handoff → AirPlay Receiver → Off.\n"
      );
      process.exit(1);
      return;
    }
    console.error(err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
