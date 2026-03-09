import { sendMessage } from "./llm.js";
import Chat from "../models/Chat.js";

export default async function handler(req, res, next) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  try {

    const cleanMessage = message.trim();

    // Save user message
    await Chat.create({
      userId: req.user.id,
      role: "user",
      content: cleanMessage
    });

    // Get AI reply
    const reply = await sendMessage(cleanMessage);

    // Save AI response
    await Chat.create({
      userId: req.user.id,
      role: "assistant",
      content: reply
    });

    res.status(200).json({ reply });

  } catch (err) {
    next(err);   // express error handler
  }

}
export async function getHistory(req, res) {

  const messages = await Chat
    .find({ userId: req.user.id })
    .sort({ createdAt: 1 });

  res.json(messages);

}