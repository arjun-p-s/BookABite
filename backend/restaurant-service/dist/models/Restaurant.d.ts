import mongoose, { Document } from "mongoose";
export interface IRestaurant extends Document {
    name: string;
    cuisine: string;
    address?: string;
    phone?: string;
    workingHours?: string;
    adminIds: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
declare const _default: mongoose.Model<IRestaurant, {}, {}, {}, mongoose.Document<unknown, {}, IRestaurant, {}, {}> & IRestaurant & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Restaurant.d.ts.map