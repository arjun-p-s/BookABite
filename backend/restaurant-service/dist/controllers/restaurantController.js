"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRestaurants = exports.deleteRestaurant = exports.editRestaurant = exports.addRestaurant = void 0;
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const mongoose_1 = __importDefault(require("mongoose"));
const addRestaurant = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin")
            return res.status(403).json({ message: "Admin role required" });
        const { name, cuisine, address, phone, workingHours } = req.body || {};
        if (!name || !cuisine)
            return res.status(400).json({ message: "name and cuisine required" });
        const restaurant = await Restaurant_1.default.create({
            name,
            cuisine,
            address,
            phone,
            workingHours,
            adminIds: [new mongoose_1.default.Types.ObjectId(user.id)]
        });
        return res.status(201).json(restaurant);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.addRestaurant = addRestaurant;
const editRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const updates = req.body;
        const updated = await Restaurant_1.default.findByIdAndUpdate(restaurantId, updates, { new: true });
        if (!updated)
            return res.status(404).json({ message: "Restaurant not found" });
        return res.json(updated);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.editRestaurant = editRestaurant;
const deleteRestaurant = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const deleted = await Restaurant_1.default.findByIdAndDelete(restaurantId);
        if (!deleted)
            return res.status(404).json({ message: "Restaurant not found" });
        return res.json({ message: "Deleted", id: restaurantId });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteRestaurant = deleteRestaurant;
const listRestaurants = async (req, res) => {
    try {
        const { cuisine, name, page = "1", limit = "10" } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const filter = {};
        if (cuisine)
            filter.cuisine = { $regex: new RegExp(String(cuisine), "i") };
        if (name)
            filter.name = { $regex: new RegExp(String(name), "i") };
        const total = await Restaurant_1.default.countDocuments(filter);
        const restaurants = await Restaurant_1.default.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .sort({ createdAt: -1 });
        return res.json({ total, page: pageNum, limit: limitNum, data: restaurants });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.listRestaurants = listRestaurants;
//# sourceMappingURL=restaurantController.js.map