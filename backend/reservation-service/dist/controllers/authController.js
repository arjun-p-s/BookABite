"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reservation_1 = __importDefault(require("../models/reservation"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/create", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const { restaurantId, date, time, guests, specialRequest } = req.body;
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const reservation = new reservation_1.default({
            userId,
            restaurantId,
            date,
            time,
            guests,
            specialRequest,
        });
        await reservation.save();
        res.status(201).json(reservation);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create reservation" });
    }
});
router.get("/user", authMiddleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        const reservations = await reservation_1.default.find({ userId });
        res.json(reservations);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
});
//# sourceMappingURL=authController.js.map