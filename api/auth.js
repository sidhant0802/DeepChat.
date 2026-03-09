import { connectDB } from "../lib/db.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {

  await connectDB();

  const { method, query } = req;
  const action = query.action;

  try {

    // LOGIN
    if (method === "POST" && action === "login") {

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password)))
        return res.status(401).json({ error: "Invalid email or password" });

      const token = jwt.sign(
        { id: user._id, name: user.name, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`
      );

      return res.json({ message: "Login successful" });
    }

    // SIGNUP
    if (method === "POST" && action === "signup") {

      const { name, username, email, password } = req.body;

      const exists = await User.findOne({ $or: [{ email }, { username }] });

      if (exists)
        return res.status(409).json({ error: "User already exists" });

      const user = await User.create({ name, username, email, password });

      const token = jwt.sign(
        { id: user._id, name: user.name, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.setHeader(
        "Set-Cookie",
        `token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax; Secure`
      );

      return res.status(201).json({ message: "Account created" });
    }

    // LOGOUT
    if (method === "POST" && action === "logout") {

      res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");

      return res.json({ message: "Logged out" });
    }

    // SESSION
    if (method === "GET" && action === "me") {

      const cookies = req.headers.cookie || "";
      const token = cookies
        .split("; ")
        .find(c => c.startsWith("token="))
        ?.split("=")[1];

      if (!token)
        return res.status(401).json({ error: "Not logged in" });

      const user = jwt.verify(token, process.env.JWT_SECRET);

      return res.json({ user });
    }

    return res.status(405).json({ error: "Invalid request" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Server error" });

  }

}