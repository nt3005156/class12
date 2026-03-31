import Message from "../models/Message.js";
import Note from "../models/Note.js";
import User from "../models/User.js";

function parsePossibleJson(value, fallback) {
  if (typeof value !== "string") return value ?? fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function pickRawPayload(body) {
  if (body && typeof body === "object" && !Array.isArray(body)) {
    return body.note || body.payload || body.data || body;
  }
  return parsePossibleJson(body, {});
}

function normalizeNotePayload(body) {
  const raw = pickRawPayload(body);
  const parsedSections = parsePossibleJson(raw.sections, []);
  const parsedTags = parsePossibleJson(raw.tags, []);

  return {
    title: String(raw.title || raw.name || "").trim(),
    slug: String(raw.slug || "").trim().toLowerCase(),
    summary: String(raw.summary || raw.description || "").trim(),
    order: Number(raw.order) || 0,
    category: String(raw.category || "Core").trim() || "Core",
    readMinutes: Number(raw.readMinutes) || 8,
    tags: Array.isArray(parsedTags)
      ? parsedTags.map((item) => String(item).trim()).filter(Boolean)
      : [],
    sections: Array.isArray(parsedSections)
      ? parsedSections.map((section) => ({
          heading: String(section?.heading || "").trim(),
          body: String(section?.body || "").trim(),
          highlights: Array.isArray(parsePossibleJson(section?.highlights, []))
            ? parsePossibleJson(section?.highlights, [])
                .map((item) => String(item).trim())
                .filter(Boolean)
            : [],
        }))
      : [],
  };
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

export async function getAdminStats(_req, res) {
  try {
    const [notes, messages, users, admins] = await Promise.all([
      Note.countDocuments(),
      Message.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ role: "admin" }),
    ]);

    res.json({ notes, messages, users, admins });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function listNotes(_req, res) {
  try {
    const notes = await Note.find().sort({ order: 1, title: 1 }).lean();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function listMessages(_req, res) {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function createNote(req, res) {
  try {
    const payload = normalizeNotePayload(req.body);
    const validationError = validateNotePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const doc = await Note.create(payload);
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
    const payload = {
      ...normalizeNotePayload(req.body),
      slug: String(req.params.slug || "").trim().toLowerCase(),
    };
    const validationError = validateNotePayload(payload);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }
    const doc = await Note.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: payload },
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ error: "Chapter not found" });
    res.json(doc);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

export async function deleteNote(req, res) {
  try {
    const doc = await Note.findOneAndDelete({ slug: req.params.slug });
    if (!doc) {
      return res.status(404).json({ error: "Chapter not found" });
    }
    res.json({ ok: true, deletedSlug: req.params.slug });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}
