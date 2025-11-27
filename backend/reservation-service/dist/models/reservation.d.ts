import mongoose, { Document } from "mongoose";
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
declare const _default: mongoose.Model<IReservation, {}, {}, {}, mongoose.Document<unknown, {}, IReservation, {}, {}> & IReservation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=reservation.d.ts.map