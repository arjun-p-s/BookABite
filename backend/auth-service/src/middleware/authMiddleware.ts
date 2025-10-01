import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ message: "No authorization header" });

    const parts = header.split(" ");
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) return res.status(401).json({ message: "Invalid authorization format" });

    try {
        const payload = verifyToken(token);
        (req as any).user = { id: payload.id, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
