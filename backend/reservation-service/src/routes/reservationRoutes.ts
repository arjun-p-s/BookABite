import { Router } from "express";
import { authMiddleware, requireRestaurantAdmin } from "../middleware/authMiddleware";
import { addReservation, addTimeslot, listReservation, listTimeslots, updateTimeslot } from "../controllers/reservationController";

const router = Router();

router.get("/reservations/list", authMiddleware, listReservation);
router.post("/reservations/add", authMiddleware, addReservation);
router.get("/timeslots/list/:restaurantId/:date", authMiddleware, listTimeslots);
router.post("/timeslots/add", authMiddleware, requireRestaurantAdmin, addTimeslot);
router.patch("/timeslots/edit", authMiddleware, requireRestaurantAdmin, updateTimeslot);





export { router as reservationRoutes };