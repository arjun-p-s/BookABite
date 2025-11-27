import mongoose, { Document } from "mongoose";
export interface ITimeSlot extends Document {
    restaurantId: mongoose.Types.ObjectId;
    date: string;
    time: string;
    totalSeats: number;
    bookedSeats: number;
    maxPeoplePerBooking: number;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<ITimeSlot, {}, {}, {}, mongoose.Document<unknown, {}, ITimeSlot, {}, {}> & ITimeSlot & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=timeSlot.d.ts.map