import { Router } from "express";
import {
  createNote,
  updateNote,
  verifyAdmin,
} from "../controllers/adminController.js";

const router = Router();

router.use(verifyAdmin);
router.post("/notes", createNote);
router.put("/notes/:slug", updateNote);

export default router;
