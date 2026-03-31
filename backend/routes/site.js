import { Router } from "express";
import { getVisitorCount, registerVisit } from "../controllers/siteController.js";

const router = Router();

router.get("/visits", getVisitorCount);
router.post("/visits", registerVisit);

export default router;
