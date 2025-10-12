import mongoose, { Document } from "mongoose";
export interface IReservation extends Document {
    userId: string;
    restaurantId: string;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
}
declare const _default: mongoose.Model<IReservation, {}, {}, {}, mongoose.Document<unknown, {}, IReservation, {}, {}> & IReservation & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=reservation.d.ts.map