import mongoose, { Schema, Document } from "mongoose";

export interface IReservation extends Document {
    userId: string;
    restaurantId: string;
    date: string;
    time: string;
    guests: number;
    status: "pending" | "confirmed" | "cancelled";
    specialRequest?: string;
}

const reservationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
        date: { type: String, required: true },
        time: { type: String, required: true },
        guests: { type: Number, required: true },
        status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
        specialRequest: { type: String }
    },
    { timestamps: true }
);

export default mongoose.model<IReservation>("Reservation", reservationSchema);
