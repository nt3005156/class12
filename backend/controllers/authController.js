import crypto from "node:crypto";
import Session from "../models/Session.js";
import User from "../models/User.js";

const SESSION_DAYS = 7;

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, original] = String(storedHash || "").split(":");
  if (!salt || !original) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(original, "hex"), Buffer.from(derived, "hex"));
}

async function createSession(userId) {
  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await Session.create({ userId, token, expiresAt });
  return token;
}

export async function authRequired(req, res, next) {
  try {
    const header = req.header("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
    if (!token) {
      return res.status(401).json({ error: "Login required" });
    }

    const session = await Session.findOne({ token }).lean();
    if (!session || new Date(session.expiresAt).getTime() < Date.now()) {
      if (session) {
        await Session.deleteOne({ _id: session._id });
      }
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    const user = await User.findById(session.userId).lean();
    if (!user) {
      await Session.deleteOne({ _id: session._id });
      return res.status(401).json({ error: "Account no longer exists" });
    }

    req.auth = { token, sessionId: session._id, user };
    next();
  } catch (error) {
    res.status(500).json({ error: "Authentication failed" });
  }
}

export async function signup(req, res) {
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
    });
    const token = await createSession(user._id);

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

    const user = await User.findOne({ email });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = await createSession(user._id);
    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Could not log in" });
  }
}

export async function getMe(req, res) {
  res.json({ user: sanitizeUser(req.auth.user) });
}

export async function logout(req, res) {
  try {
    await Session.deleteOne({ token: req.auth.token });
    res.json({ ok: true });
  } catch (error) {
    res.status(500).json({ error: "Could not log out" });
  }
}
