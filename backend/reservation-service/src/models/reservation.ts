import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
    userId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    timeSlotId: mongoose.Types.ObjectId; 
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
    createdAt: Date;
    updatedAt: Date;
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
            type: String
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "confirmed"
        },
    },
    {
        timestamps: true
    }
);

reservationSchema.index({ userId: 1, status: 1 });
reservationSchema.index({ restaurantId: 1, date: 1 });
reservationSchema.index({ timeSlotId: 1 });

export default mongoose.model<IReservation>("Reservation", reservationSchema);