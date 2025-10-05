import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export type ReqUser = { id: string; role: "user" | "admin" };

export interface AuthRequest extends Request {
  user?: ReqUser;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.header("Authorization");
  if (!header) return res.status(401).json({ message: "No authorization header" });

  const parts = header.split(" ");
  const token = parts.length === 2 ? parts[1] : null;
  if (!token) return res.status(401).json({ message: "Invalid authorization format" });

  try {
    const payload = verifyToken(token);
    if (payload.role === "user" || payload.role === "admin") {
      req.user = { id: payload.id, role: payload.role };
      next();
    } else {
      return res.status(401).json({ message: "Invalid role in token" });
    }
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};