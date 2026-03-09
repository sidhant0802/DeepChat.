import jwt from "jsonwebtoken";

function parseCookies(req) {

  const header = req.headers.cookie;
  const cookies = {};

  if (!header) return cookies;

  header.split(";").forEach(cookie => {
    const parts = cookie.split("=");
    cookies[parts[0].trim()] = decodeURIComponent(parts[1]);
  });

  return cookies;
}

// Serverless-friendly token verification
export function verifyToken(req) {

  const cookies = parseCookies(req);

  const token =
    cookies.token ||
    req.headers.authorization?.split(" ")[1];

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }

}