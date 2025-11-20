"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurentRoutes = void 0;
const express_1 = require("express");
const authMiddleware_1 = require("../middleware/authMiddleware");
const restaurantController_1 = require("../controllers/restaurantController");
const uploadController_1 = require("../controllers/uploadController");
const uploadMiddleware_1 = __importDefault(require("../middleware/uploadMiddleware"));
const router = (0, express_1.Router)();
exports.restaurentRoutes = router;
router.get("/restaurants/list", restaurantController_1.listRestaurants);
router.post("/restaurants/add", authMiddleware_1.authMiddleware, restaurantController_1.addRestaurant);
router.put("/restaurants/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, restaurantController_1.editRestaurant);
router.delete("/restaurants/:id", authMiddleware_1.authMiddleware, authMiddleware_1.requireRestaurantAdmin, restaurantController_1.deleteRestaurant);
router.post("/uploads", authMiddleware_1.authMiddleware, uploadMiddleware_1.default.single("file"), uploadController_1.uploadImage);
//# sourceMappingURL=restaurantRoutes.js.map