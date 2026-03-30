import { Router } from "express";
import { authRequired, getMe, login, logout, signup } from "../controllers/authController.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authRequired, getMe);
router.post("/logout", authRequired, logout);

export default router;
