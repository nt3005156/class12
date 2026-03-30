import Note from "../models/Note.js";

function adminUnauthorized(res) {
  return res.status(401).json({ error: "Invalid or missing admin key" });
}

function validateNotePayload(body) {
  const title = String(body.title || "").trim();
  const slug = String(body.slug || "").trim();
  const summary = String(body.summary || "").trim();
  const sections = Array.isArray(body.sections) ? body.sections : [];

  if (!title) return "Title is required";
  if (!slug) return "Slug is required";
  if (!summary) return "Summary is required";
  if (sections.length === 0) return "At least one section is required";
  if (
    sections.some(
      (section) =>
        !String(section.heading || "").trim() || !String(section.body || "").trim()
    )
  ) {
    return "Each section must have a heading and body";
  }
  return null;
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
    const validationError = validateNotePayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
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
    const validationError = validateNotePayload({ ...req.body, slug: req.params.slug });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
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
