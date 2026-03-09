// import { sendMessage } from "./llm.js";
// import Chat from "../models/Chat.js";

// export default async function handler(req, res, next) {

//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" });
//   }

//   const { message } = req.body;

//   if (!message || message.trim() === "") {
//     return res.status(400).json({ error: "Message cannot be empty" });
//   }

//   try {

//     const cleanMessage = message.trim();

//     // Save user message
//     await Chat.create({
//       userId: req.user.id,
//       role: "user",
//       content: cleanMessage
//     });

//     // Get AI reply
//     const reply = await sendMessage(cleanMessage);

//     // Save AI response
//     await Chat.create({
//       userId: req.user.id,
//       role: "assistant",
//       content: reply
//     });

//     res.status(200).json({ reply });

//   } catch (err) {
//     next(err);   // express error handler
//   }

// }
// export async function getHistory(req, res) {

//   const messages = await Chat
//     .find({ userId: req.user.id })
//     .sort({ createdAt: 1 });

//   res.json(messages);

// }


import { connectDB } from "../lib/db.js";
import { sendMessage } from "./llm.js";
import Chat from "../models/Chat.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {

    await connectDB();

    // verify JWT
    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const cleanMessage = message.trim();

    // Save user message
    await Chat.create({
      userId: user.id,
      role: "user",
      content: cleanMessage
    });

    // AI response
    const reply = await sendMessage(cleanMessage);

    // Save assistant reply
    await Chat.create({
      userId: user.id,
      role: "assistant",
      content: reply
    });

    return res.status(200).json({ reply });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}