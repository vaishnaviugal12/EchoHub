import jwt from "jsonwebtoken";
import redisClient from "../config/redis.js";

export const authMiddleware = async (req, res, next) => {
  try {
    // 1️⃣ Check cookies
    let token = req.cookies?.token;

    // 2️⃣ Or check Authorization header (e.g., "Bearer <token>")
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        token = authHeader; // in case you send just the token without "Bearer"
      }
    }

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token not provided" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${decoded.id}:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token expired, please login again" });
    }

    // 5️⃣ Attach user to request
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
};
