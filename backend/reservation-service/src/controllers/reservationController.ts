import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import Reservation from "../models/reservation";

export const addReservation = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    const { restaurantId, date, time, guests, specialRequest } = req.body || {};

    if (!user.id) return res.status(401).json({ error: "Unauthorized" });

    const reservation = new Reservation({
      userId: user.id,
      restaurantId,
      date,
      time,
      guests,
      specialRequest,
    });

    await reservation.save();
    res.status(201).json(reservation);
  } catch (err) {
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