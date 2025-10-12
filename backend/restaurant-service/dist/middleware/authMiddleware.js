"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRestaurantAdmin = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const Restaurant_1 = __importDefault(require("../models/Restaurant"));
const authMiddleware = (req, res, next) => {
    const header = req.header("Authorization");
    if (!header)
        return res.status(401).json({ message: "No authorization header" });
    const parts = header.split(" ");
    const token = parts.length === 2 ? parts[1] : null;
    if (!token)
        return res.status(401).json({ message: "Invalid authorization format" });
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = { id: payload.id, role: payload.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
const requireRestaurantAdmin = async (req, res, next) => {
    const user = req.user;
    if (!user)
        return res.status(401).json({ message: "Unauthorized" });
    if (user.role !== "admin")
        return res.status(403).json({ message: "Admin role required" });
    const restaurantId = req.params.id || req.body.restaurantId;
    if (!restaurantId)
        return res.status(400).json({ message: "Restaurant id is required" });
    const restaurant = await Restaurant_1.default.findById(restaurantId);
    if (!restaurant)
        return res.status(404).json({ message: "Restaurant not found" });
    const isAdminForThis = restaurant.adminIds.some((aid) => aid.toString() === user.id);
    if (!isAdminForThis)
        return res.status(403).json({ message: "You are not an admin of this restaurant" });
    next();
};
exports.requireRestaurantAdmin = requireRestaurantAdmin;
//# sourceMappingURL=authMiddleware.js.map