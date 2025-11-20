import mongoose, { Document } from "mongoose";
export interface IWorkingSchedule {
    day: string;
    isOpen: boolean;
}
export interface ITableType {
    seats: number;
    count: number;
}
export interface IAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
}
export interface IGeoCoordinates {
    lat?: number;
    lng?: number;
}
export interface IRestaurant extends Document {
    name: string;
    email: string;
    phone: string;
    description?: string;
    mainImage: string;
    galleryImages: string[];
    workingSchedule: IWorkingSchedule[];
    timeSchedule: {
        openTime: string;
        closeTime: string;
    };
    cuisineType: string[];
    specialTags: string[];
    totalCapacity: number;
    tableTypes: ITableType[];
    maxBookingPerSlot: number;
    address: IAddress;
    geoCoordinates: IGeoCoordinates;
    ownerName: string;
    ownerIdProof?: string;
    accountStatus: "pending" | "approved" | "rejected";
    isVerified: boolean;
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