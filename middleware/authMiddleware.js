import jwt from "jsonwebtoken";

// Express middleware (used locally if needed)
export function requireAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Serverless-friendly token verification
export function verifyToken(req) {

  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }

}