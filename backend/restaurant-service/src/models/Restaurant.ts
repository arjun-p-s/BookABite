import mongoose, { Schema, Document } from "mongoose";

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

const RestaurantSchema: Schema = new Schema(
    {
        name: { type: String, required: true, index: true },
        cuisine: [{ type: String, required: true, index: true }],
        address: { type: String },
        phone: { type: String },
        workingHours: { type: String },
        adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
