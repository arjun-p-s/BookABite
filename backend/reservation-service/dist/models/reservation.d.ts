import mongoose, { Document, Model } from "mongoose";
export interface IReservation extends Document {
    userId: mongoose.Types.ObjectId;
    restaurantId: mongoose.Types.ObjectId;
    timeSlotId: mongoose.Types.ObjectId;
    date: string;
    time: string;
    guests: number;
    specialRequest?: string;
    status: "pending" | "confirmed" | "cancelled" | "completed";
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
export interface IReservationModel extends Model<IReservation> {
    findByConfirmation(code: string): Promise<IReservation | null>;
    findByRestaurant(restaurantId: string, filters?: any): Promise<IReservation[]>;
}
declare const _default: IReservationModel;
export default _default;
//# sourceMappingURL=reservation.d.ts.map