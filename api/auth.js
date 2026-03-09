import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { connectDB } from "../lib/db.js";

const cookieOpts = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
};

export default async function handler(req, res) {

  await connectDB();

  const { method, url } = req;

  try {

    // ── SIGNUP
    if (method === "POST" && url.includes("signup")) {

      const { name, username, email, password } = req.body;

      if (!name || !username || !email || !password)
        return res.status(400).json({ error: "All fields are required" });

      const exists = await User.findOne({ $or: [{ email }, { username }] });

      if (exists)
        return res.status(409).json({ error: "User already exists" });

      const user = await User.create({ name, username, email, password });

      const token = jwt.sign(
        { id: user._id, name: user.name, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`
      );

      return res.status(201).json({ message: "Account created" });
    }

    // ── LOGIN
    if (method === "POST" && url.includes("login")) {

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { id: user._id, name: user.name, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`
      );

      return res.json({ message: "Login successful" });
    }

    // ── LOGOUT
    if (method === "POST" && url.includes("logout")) {

      res.setHeader(
        "Set-Cookie",
        "token=; HttpOnly; Path=/; Max-Age=0"
      );

      return res.json({ message: "Logged out" });
    }

    // ── SESSION
    if (method === "GET" && url.includes("me")) {

      const token = req.cookies?.token;

      if (!token)
        return res.status(401).json({ error: "Not logged in" });

      const user = jwt.verify(token, process.env.JWT_SECRET);

      return res.json({ user });
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (err) {

    console.error(err);
    return res.status(500).json({ error: "Server error" });

  }

}