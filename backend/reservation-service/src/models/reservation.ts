import mongoose, { Schema, Document, Model } from "mongoose";
import { generateConfirmationCode } from "../utils/common";

export interface IReservation extends Document {
    userId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    timeSlotId: mongoose.Types.ObjectId;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";

    // Enhanced fields
    confirmationCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;

    metadata?: Record<string, any>;
    cancellationReason?: string;
    cancelledAt?: Date;
    version: number;

    createdAt: Date;
    updatedAt: Date;
}

// Interface for Static methods
export interface IReservationModel extends Model<IReservation> {
    findByConfirmation(code: string): Promise<IReservation | null>;
    findByRestaurant(restaurantId: string, filters?: any): Promise<IReservation[]>;
}

const reservationSchema = new Schema<IReservation>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: "Restaurant",
            required: true
        },
        timeSlotId: {
            type: Schema.Types.ObjectId,
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
            type: Schema.Types.Mixed,
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
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

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
            const code = generateConfirmationCode();
            // Use constructor to access the model
            const exists = await (this.constructor as any).findOne({ confirmationCode: code });
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
reservationSchema.statics.findByConfirmation = function (code: string) {
    return this.findOne({ confirmationCode: code.toUpperCase() });
};

reservationSchema.statics.findByRestaurant = function (restaurantId: string, filters: any = {}) {
    const query = { restaurantId, ...filters };
    return this.find(query).sort({ date: 1, time: 1 });
};

export default mongoose.model<IReservation, IReservationModel>("Reservation", reservationSchema);