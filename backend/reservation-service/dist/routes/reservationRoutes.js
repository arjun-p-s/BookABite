"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reservationRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const reservationController_1 = require("../controllers/reservationController");
const router = (0, express_1.Router)();
exports.reservationRoutes = router;
// Reservation routes
router.get("/reservations/list", authMiddleware_1.authMiddleware, reservationController_1.listReservation);
router.post("/reservations/add", authMiddleware_1.authMiddleware, reservationController_1.addReservation);
router.delete("/reservations/cancel/:reservationId", authMiddleware_1.authMiddleware, reservationController_1.cancelReservation);
router.get("/reservations/:reservationId", authMiddleware_1.authMiddleware, reservationController_1.getReservationById);
router.get("/reservations/confirmation/:code", reservationController_1.getByConfirmation);
router.patch("/reservations/:reservationId/status", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.updateReservationStatus);
// Restaurant admin routes for reservations
router.get("/restaurants/:restaurantId/reservations", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.getRestaurantReservations);
// Time slot routes
router.get("/timeslots/list/:restaurantId/:date", authMiddleware_1.authMiddleware, reservationController_1.listTimeslots);
router.post("/timeslots/add", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.addTimeslot);
router.patch("/timeslots/edit/:slotId", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.updateTimeslot);
router.delete("/timeslots/delete/:slotId", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, reservationController_1.deleteTimeslot);
//# sourceMappingURL=reservationRoutes.js.map