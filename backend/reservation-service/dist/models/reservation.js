"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const common_1 = require("../utils/common");
const reservationSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    timeSlotId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "TimeSlot",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    guests: {
        type: Number,
        required: true,
        min: 1
    },
    specialRequest: {
        type: String,
        maxLength: 500
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "confirmed"
    },
    // New enhanced fields
    confirmationCode: {
        type: String,
        unique: true,
        uppercase: true,
        trim: true
    },
    customerName: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    customerPhone: {
        type: String,
        required: true,
        trim: true
    },
    metadata: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    cancellationReason: {
        type: String
    },
    cancelledAt: {
        type: Date
    },
    version: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
// Indexes
reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ restaurantId: 1, date: 1 });
reservationSchema.index({ timeSlotId: 1 });
reservationSchema.index({ confirmationCode: 1 }, { unique: true });
reservationSchema.index({ customerEmail: 1 });
reservationSchema.index({ restaurantId: 1, status: 1 }); // For filtering by status
// Pre-save middleware
reservationSchema.pre('save', async function (next) {
    // Generate confirmation code if new
    if (this.isNew && !this.confirmationCode) {
        let unique = false;
        let attempts = 0;
        while (!unique && attempts < 5) {
            const code = (0, common_1.generateConfirmationCode)();
            // Use constructor to access the model
            const exists = await this.constructor.findOne({ confirmationCode: code });
            if (!exists) {
                this.confirmationCode = code;
                unique = true;
            }
            attempts++;
        }
        if (!unique) {
            return next(new Error('Failed to generate unique confirmation code'));
        }
    }
    // Optimistic locking
    if (this.isModified() && !this.isNew) {
        this.version += 1;
    }
    next();
});
// Static methods
reservationSchema.statics.findByConfirmation = function (code) {
    return this.findOne({ confirmationCode: code.toUpperCase() });
};
reservationSchema.statics.findByRestaurant = function (restaurantId, filters = {}) {
    const query = { restaurantId, ...filters };
    return this.find(query).sort({ date: 1, time: 1 });
};
exports.default = mongoose_1.default.model("Reservation", reservationSchema);
//# sourceMappingURL=reservation.js.map