import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import Restaurant from "../models/Restaurant";


export type ReqUser = { id: string; role?: string };

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.header("Authorization");
    if (!header) return res.status(401).json({ message: "No authorization header" });

    const parts = header.split(" ");
    const token = parts.length === 2 ? parts[1] : null;
    if (!token) return res.status(401).json({ message: "Invalid authorization format" });

    try {
        const payload = verifyToken(token);
        (req as any).user = { id: payload.id, role: payload.role } as ReqUser;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export const requireRestaurantAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as ReqUser;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin role required" });

    const restaurantId = req.params.id || req.body.restaurantId;
    if (!restaurantId) return res.status(400).json({ message: "Restaurant id is required" });

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    const isAdminForThis = restaurant.adminIds.some((aid) => aid.toString() === user.id);
    if (!isAdminForThis) return res.status(403).json({ message: "You are not an admin of this restaurant" });

    next();
};
