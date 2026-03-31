import SiteStat from "../models/SiteStat.js";

const VISIT_KEY = "visitor_count";
const INITIAL_COUNT = 1000;

async function ensureCounter() {
  return SiteStat.findOneAndUpdate(
    { key: VISIT_KEY },
    { $setOnInsert: { key: VISIT_KEY, count: INITIAL_COUNT } },
    { new: true, upsert: true }
  );
}

export async function getVisitorCount(_req, res) {
  try {
    const counter = await ensureCounter();
    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: "Could not load visitor count" });
  }
}

export async function registerVisit(_req, res) {
  try {
    const counter = await SiteStat.findOneAndUpdate(
      { key: VISIT_KEY },
      {
        $setOnInsert: { key: VISIT_KEY, count: INITIAL_COUNT },
        $inc: { count: 1 },
      },
      { new: true, upsert: true }
    );

    res.json({ count: counter.count });
  } catch (error) {
    res.status(500).json({ error: "Could not register visit" });
  }
}
