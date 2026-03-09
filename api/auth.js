import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
};

// ── SIGNUP
router.post("/signup", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password)
    return res.status(400).json({ error: "All fields are required" });

  if (password.length < 8)
    return res.status(400).json({ error: "Password must be at least 8 characters" });

  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) {
      const field = exists.email === email ? "email" : "username";
      return res.status(409).json({ error: `This ${field} is already taken` });
    }

    const user = await User.create({ name, username, email, password });
    const token = jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOpts);
    res.status(201).json({ message: "Account created", user: { name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required" });

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, name: user.name, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, cookieOpts);
    res.json({ message: "Login successful", user: { name: user.name, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

// ── GET current session
router.get("/me", (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Not logged in" });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { name: user.name, username: user.username, email: user.email } });
  } catch {
    res.status(401).json({ error: "Session expired" });
  }
});

export default router;