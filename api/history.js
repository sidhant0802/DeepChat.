import { connectDB } from "../lib/db.js";
import Chat from "../models/Chat.js";
import { verifyToken } from "../middleware/authMiddleware.js";

export default async function handler(req, res) {

  try {

    await connectDB();

    const user = verifyToken(req);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const history = await Chat.find({ userId: user.id })
      .sort({ createdAt: 1 })
      .limit(50);

    return res.status(200).json(history);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }

}