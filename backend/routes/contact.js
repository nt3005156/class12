import { Router } from "express";
import { submitMessage } from "../controllers/contactController.js";

const router = Router();

router.post("/", submitMessage);

export default router;
