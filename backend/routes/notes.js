import { Router } from "express";
import { getAllNotes, getNoteBySlug, searchNotes } from "../controllers/noteController.js";

const router = Router();

router.get("/", getAllNotes);
router.get("/search", searchNotes);
router.get("/:slug", getNoteBySlug);

export default router;
