import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAdminStats,
  listMessages,
  listNotes,
  updateNote,
} from "../controllers/adminController.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth, requireAdmin);
router.get("/stats", getAdminStats);
router.get("/notes", listNotes);
router.post("/notes", createNote);
router.put("/notes/:slug", updateNote);
router.delete("/notes/:slug", deleteNote);
router.get("/messages", listMessages);

export default router;
