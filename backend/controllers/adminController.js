import Note from "../models/Note.js";

function adminUnauthorized(res) {
  return res.status(401).json({ error: "Invalid or missing admin key" });
}

export function verifyAdmin(req, res, next) {
  const key = req.header("x-admin-key");
  if (!key || key !== process.env.ADMIN_API_KEY) {
    return adminUnauthorized(res);
  }
  next();
}

export async function createNote(req, res) {
  try {
    const doc = await Note.create(req.body);
    res.status(201).json(doc);
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: "Slug already exists" });
    }
    res.status(400).json({ error: e.message });
  }
}

export async function updateNote(req, res) {
  try {
    const doc = await Note.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Chapter not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
