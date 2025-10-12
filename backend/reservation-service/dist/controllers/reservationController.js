"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTimeslot = exports.listTimeslots = exports.addTimeslot = exports.listReservation = exports.addReservation = void 0;
const reservation_1 = __importDefault(require("../models/reservation"));
const timeSlot_1 = __importDefault(require("../models/timeSlot"));
const addReservation = async (req, res) => {
    try {
        const { restaurantId, date, time, guests, specialRequest } = req.body || {};
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        if (!restaurantId || !date || !time || !guests) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const slot = await timeSlot_1.default.findOne({ restaurantId, date, time });
        if (!slot)
            return res.status(404).json({ error: "Time slot not found" });
        const availableSeats = slot.totalSeats - slot.bookedSeats;
        if (guests > availableSeats) {
            return res.status(400).json({ error: `Only ${availableSeats} seats left` });
        }
        const reservation = new reservation_1.default({
            userId,
            restaurantId,
            date,
            time,
            guests,
            specialRequest,
        });
        await reservation.save();
        slot.bookedSeats += guests;
        await slot.save();
        res.status(201).json(reservation);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create reservation" });
    }
};
exports.addReservation = addReservation;
const listReservation = async (req, res) => {
    try {
        const userId = req.user?.id;
        const reservations = await reservation_1.default.find({ userId });
        res.json(reservations);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};
exports.listReservation = listReservation;
const addTimeslot = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin")
            return res.status(403).json({ message: "Admin role required" });
        const { restaurantId, date, time, totalSeats } = req.body || {};
        if (!restaurantId || !date || !time || !totalSeats) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const timeSlot = new timeSlot_1.default({
            restaurantId,
            date,
            time,
            totalSeats,
        });
        await timeSlot.save();
        res.status(201).json(timeSlot);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to create timeslot" });
    }
};
exports.addTimeslot = addTimeslot;
const listTimeslots = async (req, res) => {
    try {
        const { restaurantId, date } = req.params || {};
        if (!restaurantId || !date) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const timeSlots = await timeSlot_1.default.find({ restaurantId, date });
        res.json(timeSlots);
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch timeslots" });
    }
};
exports.listTimeslots = listTimeslots;
const updateTimeslot = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin")
            return res.status(403).json({ message: "Admin role required" });
        const { restaurantId, date, time } = req.body || {};
        const updates = req.body;
        const updated = await timeSlot_1.default.findOneAndUpdate({ restaurantId, date, time }, updates, { new: true });
        if (!updated)
            return res.status(404).json({ message: "Timeslot is not found" });
        return res.json(updated);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateTimeslot = updateTimeslot;
//# sourceMappingURL=reservationController.js.map