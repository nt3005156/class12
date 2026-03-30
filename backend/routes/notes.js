import { Router } from "express";
import {
  getAllNotes,
  getNoteBySlug,
  getNoteMeta,
  searchNotes,
} from "../controllers/noteController.js";

const router = Router();

router.get("/", getAllNotes);
router.get("/meta", getNoteMeta);
router.get("/search", searchNotes);
router.get("/:slug", getNoteBySlug);

export default router;
