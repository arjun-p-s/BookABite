import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot extends Document {
    restaurantId: string;
    date: string;
    time: string;
    totalSeats: number;
    bookedSeats: number;
}

const timeSlotSchema = new Schema<ITimeSlot>({
    restaurantId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
});

export default mongoose.model<ITimeSlot>("TimeSlot", timeSlotSchema);
