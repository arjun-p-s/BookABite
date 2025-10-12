"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurentRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const restaurantController_1 = require("../controllers/restaurantController");
const router = (0, express_1.Router)();
exports.restaurentRoutes = router;
router.get("/restaurants/list", restaurantController_1.listRestaurants);
router.post("/restaurants/add", authMiddleware_1.authMiddleware, restaurantController_1.addRestaurant);
router.put("/restaurants/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, restaurantController_1.editRestaurant);
router.delete("/restaurants/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, restaurantController_1.deleteRestaurant);
//# sourceMappingURL=restaurantRoutes.js.map