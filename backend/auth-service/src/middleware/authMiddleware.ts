import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "bb-auth-token";

const extractToken = (req: Request): string | null => {
    const header = req.header("Authorization");
    if (typeof header === "string" && header.startsWith("Bearer ")) {
        const [, bearerToken] = header.split(" ");
        if (bearerToken) {
            return bearerToken;
        }
    }

    const cookies = (req as Request & { cookies?: Record<string, string> }).cookies;
    return cookies?.[AUTH_COOKIE_NAME] ?? null;
};

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);

    if (!token) {
        return res.status(401).json({ message: "No authorization token provided" });
    }

    try {
        const payload = verifyToken(token);
        (req as any).user = { id: payload.id, role: payload.role };
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
