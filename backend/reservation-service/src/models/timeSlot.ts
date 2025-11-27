import mongoose, { Schema, Document } from "mongoose";

export interface ITimeSlot extends Document {
    restaurantId: mongoose.Types.ObjectId;
    date: string; // Format: "2025-11-23"
    time: string; // Format: "18:00"
    totalSeats: number;
    bookedSeats: number;
    maxPeoplePerBooking: number; // Max guests per single booking
    isBlocked: boolean; // For maintenance or special events
    createdAt: Date;
    updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
    {
        restaurantId: { 
            type: Schema.Types.ObjectId, 
            ref: "Restaurant", 
            required: true,
            index: true // For faster queries
        },
        date: { 
            type: String, 
            required: true,
            index: true // For date-based queries
        },
        time: { 
            type: String, 
            required: true 
        },
        totalSeats: { 
            type: Number, 
            required: true,
            min: 1 
        },
        bookedSeats: { 
            type: Number, 
            default: 0,
            min: 0
        },
        maxPeoplePerBooking: { 
            type: Number, 
            required: true,
            default: 10,
            min: 1
        },
        isBlocked: { 
            type: Boolean, 
            default: false 
        },
    },
    { 
        timestamps: true 
    }
);

// Compound index to prevent duplicate slots and optimize queries
timeSlotSchema.index({ restaurantId: 1, date: 1, time: 1 }, { unique: true });

// Virtual field for available seats
timeSlotSchema.virtual('availableSeats').get(function() {
    return this.totalSeats - this.bookedSeats;
});

// Method to check if slot has enough seats
timeSlotSchema.methods.hasAvailableSeats = function(requestedSeats: number): boolean {
    return !this.isBlocked && (this.totalSeats - this.bookedSeats) >= requestedSeats;
};

export default mongoose.model<ITimeSlot>("TimeSlot", timeSlotSchema);