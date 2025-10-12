"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRestaurantAdmin = exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
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
        if (payload.role === "user" || payload.role === "admin") {
            req.user = { id: payload.id, role: payload.role };
            next();
        }
        else {
            return res.status(401).json({ message: "Invalid role in token" });
        }
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
    next();
};
exports.requireRestaurantAdmin = requireRestaurantAdmin;
//# sourceMappingURL=authMiddleware.js.map