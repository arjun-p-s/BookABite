import { Router } from "express";
import { authMiddleware, requireRestaurantAdmin } from "../middleware/authMiddleware";
import { addReservation, addTimeslot, listReservation, listTimeslots, updateTimeslot, deleteTimeslot } from "../controllers/reservationController";

const router = Router();

router.get("/reservations/list", authMiddleware, listReservation);
router.post("/reservations/add", authMiddleware, addReservation);
router.get("/timeslots/list/:restaurantId/:date", authMiddleware, listTimeslots);
router.post("/timeslots/add", authMiddleware, requireRestaurantAdmin, addTimeslot);
router.patch("/timeslots/edit/:slotId", authMiddleware, requireRestaurantAdmin, updateTimeslot);
router.delete("/timeslots/delete/:slotId", authMiddleware, requireRestaurantAdmin, deleteTimeslot);





export { router as reservationRoutes };