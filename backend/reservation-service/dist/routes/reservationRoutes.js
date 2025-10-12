"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const reservationController_1 = require("../controllers/reservationController");
const router = (0, express_1.Router)();
exports.reservationRoutes = router;
router.get("/reservations/list", authMiddleware_1.authMiddleware, reservationController_1.listReservation);
router.post("/reservations/add", authMiddleware_1.authMiddleware, reservationController_1.addReservation);
router.get("/timeslots/list/:restaurantId/:date", authMiddleware_1.authMiddleware, reservationController_1.listTimeslots);
router.post("/timeslots/add", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.addTimeslot);
router.patch("/timeslots/edit", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.updateTimeslot);
//# sourceMappingURL=reservationRoutes.js.map