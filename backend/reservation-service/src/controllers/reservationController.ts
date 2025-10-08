import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Reservation from "../models/reservation";
import TimeSlot from "../models/timeSlot";

export const addReservation = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, date, time, guests, specialRequest } = req.body || {};
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!restaurantId || !date || !time || !guests) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const slot = await TimeSlot.findOne({ restaurantId, date, time });
    if (!slot) return res.status(404).json({ error: "Time slot not found" });

    const availableSeats = slot.totalSeats - slot.bookedSeats;

    if (guests > availableSeats) {
      return res.status(400).json({ error: `Only ${availableSeats} seats left` });
    }
    const reservation = new Reservation({
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
  } catch (err) {
        console.error(err);
    res.status(500).json({ error: "Failed to create reservation" });
  }
};

export const listReservation = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const reservations = await Reservation.find({ userId });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
};

export const addTimeslot = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin role required" });
    const { restaurantId, date, time, totalSeats } = req.body || {};
    if (!restaurantId || !date || !time || !totalSeats) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const timeSlot = new TimeSlot({
      restaurantId,
      date,
      time,
      totalSeats,
    });
    await timeSlot.save();
    res.status(201).json(timeSlot);

  } catch (err) {
    res.status(500).json({ error: "Failed to create timeslot" });
  }
};

export const listTimeslots = async (req: AuthRequest, res: Response) => {
  try {
    const { restaurantId, date } = req.params || {};
    if (!restaurantId || !date) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const timeSlots = await TimeSlot.find({ restaurantId, date });
    res.json(timeSlots);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch timeslots" });
  }
};

export const updateTimeslot = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin") return res.status(403).json({ message: "Admin role required" });
    const { restaurantId, date, time } = req.body || {};
    const updates = req.body;

    const updated = await TimeSlot.findOneAndUpdate({ restaurantId, date, time }, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Timeslot is not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }

}