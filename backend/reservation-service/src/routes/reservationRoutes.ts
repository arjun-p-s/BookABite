import { Router } from "express";
import { authMiddleware, requireRestaurantAdmin } from "../middleware/authMiddleware";
import {
    addReservation,
    addTimeslot,
    listReservation,
    listTimeslots,
    updateTimeslot,
    deleteTimeslot,
    cancelReservation,
    getByConfirmation,
    getReservationById,
    getRestaurantReservations,
    updateReservationStatus
} from "../controllers/reservationController";

const router = Router();

// Reservation routes
router.get("/reservations/list", authMiddleware, listReservation);
router.post("/reservations/add", authMiddleware, addReservation);
router.delete("/reservations/cancel/:reservationId", authMiddleware, cancelReservation);
router.get("/reservations/:reservationId", authMiddleware, getReservationById);
router.get("/reservations/confirmation/:code", getByConfirmation);
router.patch("/reservations/:reservationId/status", authMiddleware, requireRestaurantAdmin, updateReservationStatus);

// Restaurant admin routes for reservations
router.get("/restaurants/:restaurantId/reservations", authMiddleware, requireRestaurantAdmin, getRestaurantReservations);

// Time slot routes
router.get("/timeslots/list/:restaurantId/:date", authMiddleware, listTimeslots);
router.post("/timeslots/add", authMiddleware, requireRestaurantAdmin, addTimeslot);
router.patch("/timeslots/edit/:slotId", authMiddleware, requireRestaurantAdmin, updateTimeslot);
router.delete("/timeslots/delete/:slotId", authMiddleware, requireRestaurantAdmin, deleteTimeslot);

export { router as reservationRoutes };