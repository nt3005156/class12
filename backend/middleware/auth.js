import User from "../models/User.js";
import { sanitizeUser, verifyAuthToken } from "../utils/auth.js";

export async function requireAuth(req, res, next) {
  try {
    const header = req.header("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";

    if (!token) {
      return res.status(401).json({ error: "Login required" });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub).lean();

    if (!user) {
      return res.status(401).json({ error: "Account not found" });
    }

    req.auth = {
      token,
      payload,
      user,
      safeUser: sanitizeUser(user),
    };
    next();
  } catch (_error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.auth?.user || req.auth.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
}
