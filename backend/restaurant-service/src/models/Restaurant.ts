import mongoose, { Schema, Document } from "mongoose";

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

const RestaurantSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: true,
            maxlength: 15,
        },
        description: {
            type: String,
            maxlength: 2000,
        },
        mainImage: {
            type: String,
            required: true,
        },
        galleryImages: [
            {
                type: String,
            }
        ],
        workingSchedule: [
            {
                day: { type: String, required: true },
                isOpen: { type: Boolean, default: true },
            }
        ],
        timeSchedule: {
            openTime: { type: String, required: true },
            closeTime: { type: String, required: true },
        },
        cuisineType: {
            type: [String],
            default: [],
        },
        specialTags: {
            type: [String],
            default: [],
        },
        totalCapacity: {
            type: Number,
            required: true,
            min: 0,
        },
        tableTypes: [
            {
                seats: Number,
                count: Number,
            }
        ],
        maxBookingPerSlot: {
            type: Number,
            default: 10,
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            pincode: String,
        },
        geoCoordinates: {
            lat: Number,
            lng: Number,
        },
        ownerName: {
            type: String,
            required: true,
        },
        ownerIdProof: {
            type: String,
        },
        accountStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model<IRestaurant>("Restaurant", RestaurantSchema);
