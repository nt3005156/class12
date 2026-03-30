import Message from "../models/Message.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitMessage(req, res) {
  try {
    const payload = {
      name: String(req.body.name || "").trim(),
      email: String(req.body.email || "").trim().toLowerCase(),
      subject: String(req.body.subject || "").trim(),
      message: String(req.body.message || "").trim(),
      category: String(req.body.category || "Question"),
    };

    if (payload.name.length < 2) {
      return res.status(400).json({ error: "Name should be at least 2 characters long" });
    }
    if (!isValidEmail(payload.email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (!payload.subject) {
      return res.status(400).json({ error: "Subject is required" });
    }
    if (payload.message.length < 10) {
      return res.status(400).json({ error: "Message should be at least 10 characters long" });
    }

    const doc = await Message.create(payload);
    res.status(201).json({
      ok: true,
      message: "Thanks for your message. It has been saved in the project database.",
      id: doc._id,
    });
  } catch (error) {
    res.status(400).json({ error: error.message || "Could not submit message" });
  }
}
