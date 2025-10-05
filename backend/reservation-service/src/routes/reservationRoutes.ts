import { Router } from "express";
import { authMiddleware} from "../middleware/authMiddleware";
import { addReservation, listReservation } from "../controllers/reservationController";

const router = Router();

router.get("/reservations/list", authMiddleware,listReservation);
router.post("/reservations/add",authMiddleware, addReservation);



export { router as reservationRoutes };