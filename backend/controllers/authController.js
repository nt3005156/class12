import User from "../models/User.js";
import {
  hashPassword,
  isAdminEmail,
  isValidEmail,
  sanitizeUser,
  signAuthToken,
  verifyPassword,
} from "../utils/auth.js";

async function syncAdminRole(user) {
  const shouldBeAdmin = isAdminEmail(user.email);
  if (!shouldBeAdmin || user.role === "admin") {
    return user;
  }

  user.role = "admin";
  await user.save();
  return user;
}

export async function register(req, res) {
  try {
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (name.length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters long" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
      role: isAdminEmail(email) ? "admin" : "student",
    });
    const token = signAuthToken(user);

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Could not create account" });
  }
}

export async function login(req, res) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user = await syncAdminRole(user);
    const token = signAuthToken(user);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Could not log in" });
  }
}

export async function getMe(req, res) {
  res.json({ user: req.auth.safeUser });
}

export async function logout(_req, res) {
  res.json({ ok: true });
}
