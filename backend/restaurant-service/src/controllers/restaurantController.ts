import { Request, Response } from "express";
import Restaurant from "../models/Restaurant";
import mongoose from "mongoose";

export const addRestaurant = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user;
        if (!user) return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin") return res.status(403).json({ message: "Admin role required" });

        const { name, cuisine, address, phone, workingHours } = req.body || {};
        if (!name || !cuisine) return res.status(400).json({ message: "name and cuisine required" });

        const restaurant = await Restaurant.create({
            name,
            cuisine,
            address,
            phone,
            workingHours,
            adminIds: [new mongoose.Types.ObjectId(user.id)]
        });

        return res.status(201).json(restaurant);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const editRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const updates = req.body;

        const updated = await Restaurant.findByIdAndUpdate(restaurantId, updates, { new: true });
        if (!updated) return res.status(404).json({ message: "Restaurant not found" });
        return res.json(updated);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurantId = req.params.id;
        const deleted = await Restaurant.findByIdAndDelete(restaurantId);
        if (!deleted) return res.status(404).json({ message: "Restaurant not found" });
        return res.json({ message: "Deleted", id: restaurantId });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const listRestaurants = async (req: Request, res: Response) => {
    try {
        const { cuisine, name, page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page as string, 10) || 1;
        const limitNum = parseInt(limit as string, 10) || 10;

        const filter: any = {};
        if (cuisine) filter.cuisine = { $regex: new RegExp(String(cuisine), "i") };
        if (name) filter.name = { $regex: new RegExp(String(name), "i") };

        const total = await Restaurant.countDocuments(filter);
        const restaurants = await Restaurant.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        return res.json({ total, page: pageNum, limit: limitNum, data: restaurants });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
