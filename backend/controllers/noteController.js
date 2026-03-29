import Note from "../models/Note.js";

export async function getAllNotes(req, res) {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q && String(q).trim().length >= 2) {
      const rx = new RegExp(String(q).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [
        { title: rx },
        { summary: rx },
        { tags: rx },
        { slug: rx },
      ];
    }
    const notes = await Note.find(filter)
      .sort({ order: 1, title: 1 })
      .select("-sections")
      .lean();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function searchNotes(req, res) {
  try {
    const { q } = req.query;
    if (!q || String(q).trim().length < 2) {
      return res.json([]);
    }
    const term = String(q).trim();
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const notes = await Note.find({
      $or: [
        { title: rx },
        { summary: rx },
        { tags: rx },
        { slug: rx },
      ],
    })
      .sort({ order: 1 })
      .select("title slug summary category tags order")
      .limit(24)
      .lean();
    res.json(notes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

export async function getNoteBySlug(req, res) {
  try {
    const note = await Note.findOne({ slug: req.params.slug }).lean();
    if (!note) return res.status(404).json({ error: "Chapter not found" });
    res.json(note);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
