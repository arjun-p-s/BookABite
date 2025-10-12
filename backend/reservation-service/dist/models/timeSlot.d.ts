import mongoose, { Document } from "mongoose";
export interface ITimeSlot extends Document {
    restaurantId: string;
    date: string;
    time: string;
    totalSeats: number;
    bookedSeats: number;
}
declare const _default: mongoose.Model<ITimeSlot, {}, {}, {}, mongoose.Document<unknown, {}, ITimeSlot, {}, {}> & ITimeSlot & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=timeSlot.d.ts.map