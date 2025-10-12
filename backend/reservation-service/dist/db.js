"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri)
            throw new Error("MONGO_URI not set");
        await mongoose_1.default.connect(uri, { dbName: "bookabite", });
        console.log("✅ MongoDB connected (restaurant-service)");
    }
    catch (err) {
        console.error("❌ MongoDB connection failed", err);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.js.map