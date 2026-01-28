"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReservationStatus = exports.getRestaurantReservations = exports.getReservationById = exports.getByConfirmation = exports.cancelReservation = exports.listReservation = exports.addReservation = exports.deleteTimeslot = exports.updateTimeslot = exports.listTimeslots = exports.addTimeslot = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const reservation_1 = __importDefault(require("../models/reservation"));
const timeSlot_1 = __importDefault(require("../models/timeSlot"));
const common_1 = require("../utils/common");
const publisher_1 = require("../events/publisher");
const redis_service_1 = require("../cache/redis.service");
// ... (Helper functions and Time Slot Controllers remain unchanged)
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function generateTimeSlotsForDay(restaurantId, date, startTime, endTime, intervalMinutes, totalSeats, maxPeoplePerBooking) {
    const slots = [];
    const [startHour = 0, startMin = 0] = startTime.split(':').map(Number);
    const [endHour = 0, endMin = 0] = endTime.split(':').map(Number);
    let currentTime = new Date();
    currentTime.setHours(startHour, startMin, 0, 0);
    const endTimeDate = new Date();
    endTimeDate.setHours(endHour, endMin, 0, 0);
    while (currentTime < endTimeDate) {
        const timeString = currentTime.toTimeString().slice(0, 5);
        slots.push({
            restaurantId,
            date,
            time: timeString,
            totalSeats,
            bookedSeats: 0,
            maxPeoplePerBooking,
            isBlocked: false,
        });
        currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
    }
    return slots;
}
// ============================================================================
// TIME SLOT CONTROLLERS
// ============================================================================
// CREATE BULK TIME SLOTS (FIXED VERSION)
const addTimeslot = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin role required" });
        }
        const { restaurantId, startDate, endDate, durationType, selectedDays, startTime, endTime, slotInterval, totalSeats, maxPeoplePerBooking, } = req.body || {};
        if (!restaurantId || !startDate || !startTime || !endTime || !totalSeats) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Validate MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ error: "Invalid restaurantId" });
        }
        // Generate dates based on duration type
        const datesToGenerate = [];
        if (durationType === "single") {
            datesToGenerate.push(startDate);
        }
        else if (durationType === "week" && selectedDays?.length > 0) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
                if (selectedDays.includes(dayName)) {
                    const isoDate = d.toISOString().split('T')[0];
                    datesToGenerate.push(isoDate);
                }
            }
        }
        else if (durationType === "range" && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                const isoDate = d.toISOString().split('T')[0];
                datesToGenerate.push(isoDate);
            }
        }
        if (datesToGenerate.length === 0) {
            return res.status(400).json({ error: "No valid dates generated" });
        }
        console.log(`📅 Generating slots for ${datesToGenerate.length} dates:`, datesToGenerate);
        // Generate time slots for all dates
        const allSlots = [];
        for (const date of datesToGenerate) {
            const timeSlots = generateTimeSlotsForDay(restaurantId, date, startTime, endTime, slotInterval || 30, totalSeats, maxPeoplePerBooking || 10);
            allSlots.push(...timeSlots);
        }
        console.log(`⏰ Generated ${allSlots.length} total time slots`);
        // CRITICAL FIX: Use insertMany with proper error handling
        let insertedCount = 0;
        let duplicateCount = 0;
        try {
            // Try bulk insert first
            const result = await timeSlot_1.default.insertMany(allSlots, { ordered: false });
            insertedCount = result.length;
            console.log(`✅ Successfully inserted ${insertedCount} new slots`);
        }
        catch (err) {
            // Handle duplicate key errors (code 11000)
            if (err.code === 11000 && err.writeErrors) {
                // Some inserts succeeded, some failed due to duplicates
                insertedCount = err.insertedDocs?.length || 0;
                duplicateCount = err.writeErrors.length;
                console.log(`⚠️  Inserted ${insertedCount} new slots, ${duplicateCount} duplicates skipped`);
            }
            else if (err.code === 11000) {
                // All duplicates
                duplicateCount = allSlots.length;
                console.log(`⚠️  All ${duplicateCount} slots already exist (duplicates)`);
            }
            else {
                // Other error
                throw err;
            }
        }
        // VERIFICATION: Query database to confirm what actually exists
        const verificationPromises = datesToGenerate.map(date => timeSlot_1.default.countDocuments({ restaurantId, date }));
        const counts = await Promise.all(verificationPromises);
        const totalInDb = counts.reduce((sum, count) => sum + count, 0);
        console.log(`🔍 Verification: ${totalInDb} slots now exist in database across ${datesToGenerate.length} dates`);
        // Log per-date breakdown
        datesToGenerate.forEach((date, idx) => {
            console.log(`   ${date}: ${counts[idx]} slots`);
        });
        res.status(201).json({
            message: `Time slots created successfully`,
            totalGenerated: allSlots.length,
            newlyInserted: insertedCount,
            duplicatesSkipped: duplicateCount,
            totalInDatabase: totalInDb,
            dates: datesToGenerate,
            datesCount: datesToGenerate.length,
        });
    }
    catch (err) {
        console.error("❌ Error creating timeslots:", err);
        res.status(500).json({ error: "Failed to create timeslots" });
    }
};
exports.addTimeslot = addTimeslot;
// GET TIME SLOTS - FIXED TO SUPPORT DATE RANGE
const listTimeslots = async (req, res) => {
    try {
        const { restaurantId, date } = req.params || {};
        const { startDate, endDate } = req.query; // NEW: Support date range queries
        if (!restaurantId) {
            return res.status(400).json({ error: "Missing restaurantId" });
        }
        if (!mongoose_1.default.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ error: "Invalid restaurantId" });
        }
        // Build query
        const query = {
            restaurantId,
            isBlocked: false
        };
        // Support both single date and date range
        if (date) {
            query.date = date;
        }
        else if (startDate && endDate) {
            query.date = { $gte: startDate, $lte: endDate };
        }
        else if (startDate) {
            query.date = { $gte: startDate };
        }
        console.log(`🔍 Fetching slots with query:`, query);
        const timeSlots = await timeSlot_1.default.find(query)
            .sort({ date: 1, time: 1 })
            .lean();
        console.log(`📊 Found ${timeSlots.length} time slots`);
        // Add available seats calculation
        const slotsWithAvailability = timeSlots.map(slot => ({
            _id: slot._id,
            date: slot.date,
            time: slot.time,
            totalSeats: slot.totalSeats,
            bookedSeats: slot.bookedSeats,
            availableSeats: slot.totalSeats - slot.bookedSeats,
            maxPeoplePerBooking: slot.maxPeoplePerBooking,
            maxCapacity: slot.totalSeats, // For frontend compatibility
            isBlocked: slot.isBlocked,
        }));
        res.json({
            timeSlots: slotsWithAvailability,
            count: slotsWithAvailability.length
        });
    }
    catch (err) {
        console.error("❌ Error fetching timeslots:", err);
        res.status(500).json({ error: "Failed to fetch timeslots" });
    }
};
exports.listTimeslots = listTimeslots;
// UPDATE TIME SLOT - FIXED
const updateTimeslot = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin role required" });
        }
        const { slotId } = req.params;
        const { totalSeats, isBlocked } = req.body;
        if (!slotId || !mongoose_1.default.Types.ObjectId.isValid(slotId)) {
            return res.status(400).json({ message: "Invalid slotId" });
        }
        console.log(`📝 Updating slot ${slotId}:`, { totalSeats, isBlocked });
        // Find the slot first
        const slot = await timeSlot_1.default.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        // Update fields
        if (totalSeats !== undefined) {
            const parsed = parseInt(totalSeats);
            if (isNaN(parsed) || parsed < 0) {
                return res.status(400).json({ message: "Invalid totalSeats value" });
            }
            slot.totalSeats = parsed;
        }
        if (isBlocked !== undefined) {
            slot.isBlocked = Boolean(isBlocked);
        }
        // Save with validation
        await slot.save();
        console.log(`✅ Slot updated successfully:`, slot);
        // VERIFICATION: Re-fetch to confirm
        const verified = await timeSlot_1.default.findById(slotId).lean();
        console.log(`🔍 Verified in DB:`, verified);
        return res.json({
            message: "Time slot updated successfully",
            timeSlot: {
                _id: slot._id,
                date: slot.date,
                time: slot.time,
                totalSeats: slot.totalSeats,
                bookedSeats: slot.bookedSeats,
                availableSeats: slot.totalSeats - slot.bookedSeats,
                maxPeoplePerBooking: slot.maxPeoplePerBooking,
                isBlocked: slot.isBlocked,
            }
        });
    }
    catch (err) {
        console.error("❌ Error updating slot:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateTimeslot = updateTimeslot;
// DELETE TIME SLOT
const deleteTimeslot = async (req, res) => {
    try {
        const user = req.user;
        if (!user)
            return res.status(401).json({ message: "Unauthorized" });
        if (user.role !== "admin") {
            return res.status(403).json({ message: "Admin role required" });
        }
        const { slotId } = req.params;
        if (!slotId || !mongoose_1.default.Types.ObjectId.isValid(slotId)) {
            return res.status(400).json({ message: "Invalid slotId" });
        }
        const deleted = await timeSlot_1.default.findByIdAndDelete(slotId);
        if (!deleted) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        console.log(`🗑️  Deleted slot: ${slotId}`);
        return res.json({ message: "Time slot deleted successfully" });
    }
    catch (err) {
        console.error("❌ Error deleting slot:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.deleteTimeslot = deleteTimeslot;
// ============================================================================
// RESERVATION CONTROLLERS
// ============================================================================
// CREATE RESERVATION
const addReservation = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { restaurantId, date, time, guests, specialRequest, customerName, customerEmail, customerPhone } = req.body || {};
        const userId = req.user?.id;
        if (!userId) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!restaurantId || !date || !time || !guests || !customerName || !customerEmail || !customerPhone) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Validation
        if (!(0, common_1.validateEmail)(customerEmail)) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Invalid email address" });
        }
        if (!(0, common_1.validatePhone)(customerPhone)) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Invalid phone number" });
        }
        if (guests < 1) {
            await session.abortTransaction();
            return res.status(400).json({ error: "Number of guests must be at least 1" });
        }
        // Find time slot
        const slot = await timeSlot_1.default.findOne({ restaurantId, date, time }).session(session);
        if (!slot) {
            await session.abortTransaction();
            return res.status(404).json({ error: "Time slot not found" });
        }
        if (slot.isBlocked) {
            await session.abortTransaction();
            return res.status(400).json({ error: "This time slot is currently unavailable" });
        }
        // Check available seats
        const availableSeats = slot.totalSeats - slot.bookedSeats;
        if (guests > availableSeats) {
            await session.abortTransaction();
            return res.status(400).json({
                error: `Only ${availableSeats} seat(s) available for this time slot`
            });
        }
        if (slot.maxPeoplePerBooking && guests > slot.maxPeoplePerBooking) {
            await session.abortTransaction();
            return res.status(400).json({
                error: `Maximum ${slot.maxPeoplePerBooking} people per booking`
            });
        }
        // Prevent duplicate booking
        const existingReservation = await reservation_1.default.findOne({
            userId,
            restaurantId,
            date,
            time,
            status: { $nin: ["cancelled"] }
        }).session(session);
        if (existingReservation) {
            await session.abortTransaction();
            return res.status(400).json({
                error: "You already have a reservation for this time slot"
            });
        }
        // Create reservation
        const reservation = new reservation_1.default({
            userId,
            restaurantId,
            timeSlotId: slot._id,
            date,
            time,
            guests,
            specialRequest: specialRequest || "",
            status: "confirmed",
            customerName,
            customerEmail,
            customerPhone
        });
        await reservation.save({ session });
        // Update slot
        slot.bookedSeats += guests;
        await slot.save({ session });
        await session.commitTransaction();
        await reservation.populate('restaurantId', 'name mainImage address phone');
        // Publish Event
        await publisher_1.EventPublisher.getInstance().publishReservationCreated({
            reservationId: reservation._id.toString(),
            restaurantId: reservation.restaurantId._id.toString(),
            userId: userId.toString(),
            confirmationCode: reservation.confirmationCode,
            date: reservation.date,
            time: reservation.time,
            guests: reservation.guests,
            customerEmail: reservation.customerEmail,
            customerName: reservation.customerName,
            status: reservation.status,
            specialRequest: reservation.specialRequest || "",
            createdAt: reservation.createdAt.toISOString()
        });
        console.log(`✅ Reservation created: ${reservation._id}, ${guests} guests`);
        res.status(201).json({
            message: "Reservation created successfully",
            reservation
        });
    }
    catch (err) {
        await session.abortTransaction();
        console.error("❌ Reservation error:", err);
        res.status(500).json({ error: "Failed to create reservation" });
    }
    finally {
        session.endSession();
    }
};
exports.addReservation = addReservation;
// GET USER RESERVATIONS
const listReservation = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const reservations = await reservation_1.default.find({ userId })
            .populate('restaurantId', 'name mainImage address phone')
            .populate('timeSlotId', 'totalSeats bookedSeats')
            .sort({ date: -1, time: -1 });
        res.json({ reservations });
    }
    catch (err) {
        console.error("❌ Error fetching reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};
exports.listReservation = listReservation;
// CANCEL RESERVATION
const cancelReservation = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { reservationId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            await session.abortTransaction();
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!reservationId) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid reservationId" });
        }
        const reservation = await reservation_1.default.findOne({
            _id: reservationId,
            userId,
            status: { $in: ["pending", "confirmed"] }
        }).session(session);
        if (!reservation) {
            await session.abortTransaction();
            return res.status(404).json({
                error: "Reservation not found or already cancelled"
            });
        }
        // Find time slot and restore seats
        const slot = await timeSlot_1.default.findById(reservation.timeSlotId).session(session);
        if (slot) {
            slot.bookedSeats -= reservation.guests;
            if (slot.bookedSeats < 0)
                slot.bookedSeats = 0;
            await slot.save({ session });
        }
        // Update reservation status
        reservation.status = "cancelled";
        reservation.cancelledAt = new Date();
        reservation.cancellationReason = req.body.reason || "User cancelled";
        await reservation.save({ session });
        await session.commitTransaction();
        // Publish Event
        await publisher_1.EventPublisher.getInstance().publishReservationCancelled({
            reservationId: reservation._id.toString(),
            restaurantId: reservation.restaurantId.toString(),
            userId: userId.toString(),
            reason: reservation.cancellationReason || "Unknown",
            cancelledAt: reservation.cancelledAt.toISOString()
        });
        console.log(`🚫 Reservation cancelled: ${reservationId}`);
        res.json({
            message: "Reservation cancelled successfully",
            reservation
        });
    }
    catch (err) {
        await session.abortTransaction();
        console.error("❌ Cancel reservation error:", err);
        res.status(500).json({ error: "Failed to cancel reservation" });
    }
    finally {
        session.endSession();
    }
};
exports.cancelReservation = cancelReservation;
// GET RESERVATION BY CONFIRMATION CODE
const getByConfirmation = async (req, res) => {
    try {
        const { code } = req.params;
        if (!code) {
            return res.status(400).json({ error: "Confirmation code required" });
        }
        // Check cache first
        const cached = await redis_service_1.CacheService.getInstance().getReservationByConfirmation(code.toUpperCase());
        if (cached) {
            return res.json({ reservation: cached });
        }
        const reservation = await reservation_1.default.findOne({
            confirmationCode: code.toUpperCase()
        }).populate('restaurantId', 'name mainImage address phone');
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        // Cache result
        await redis_service_1.CacheService.getInstance().cacheReservationByConfirmation(code.toUpperCase(), reservation);
        res.json({ reservation });
    }
    catch (err) {
        console.error("❌ Error fetching reservation by code:", err);
        res.status(500).json({ error: "Failed to fetch reservation" });
    }
};
exports.getByConfirmation = getByConfirmation;
// GET RESERVATION BY ID
const getReservationById = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const reservation = await reservation_1.default.findOne({
            _id: reservationId,
            userId // Security: Only allow owner to view
        }).populate('restaurantId', 'name mainImage address phone');
        if (!reservation) {
            return res.status(404).json({ error: "Reservation not found" });
        }
        res.json({ reservation });
    }
    catch (err) {
        console.error("❌ Error fetching reservation:", err);
        res.status(500).json({ error: "Failed to fetch reservation" });
    }
};
exports.getReservationById = getReservationById;
// GET RESTAURANT RESERVATIONS
const getRestaurantReservations = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { status, date } = req.query;
        // Security check: Ensure user is admin of this restaurant
        // This is a simplified check, ideally should check if user owns THIS restaurant
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized: Restaurant admin access required' });
        }
        const filters = {};
        if (status)
            filters.status = status;
        if (date)
            filters.date = date;
        const reservations = await reservation_1.default.findByRestaurant(restaurantId, filters) // Cast safely to any
            .populate('userId', 'name email');
        res.json({
            reservations,
            count: reservations.length
        });
    }
    catch (err) {
        console.error("❌ Error fetching restaurant reservations:", err);
        res.status(500).json({ error: "Failed to fetch reservations" });
    }
};
exports.getRestaurantReservations = getRestaurantReservations;
// UPDATE RESERVATION STATUS
const updateReservationStatus = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;
        // Security check
        const user = req.user;
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized: Admin access required' });
        }
        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }
        const reservation = await reservation_1.default.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        // If cancelling, ensure seats are restored (if not already cancelled)
        if (status === 'cancelled' && reservation.status !== 'cancelled') {
            const slot = await timeSlot_1.default.findById(reservation.timeSlotId);
            if (slot) {
                slot.bookedSeats -= reservation.guests;
                if (slot.bookedSeats < 0)
                    slot.bookedSeats = 0;
                await slot.save();
            }
            reservation.cancelledAt = new Date();
            reservation.cancellationReason = req.body.reason || "Admin cancelled";
        }
        reservation.status = status;
        await reservation.save();
        // Publish Event
        await publisher_1.EventPublisher.getInstance().publishReservationStatusChanged({
            reservationId: reservation._id.toString(),
            restaurantId: reservation.restaurantId.toString(),
            userId: reservation.userId.toString(),
            status,
            updatedAt: new Date().toISOString()
        });
        res.json({ message: 'Status updated', reservation });
    }
    catch (err) {
        console.error("❌ Error updating reservation status:", err);
        res.status(500).json({ error: "Failed to update status" });
    }
};
exports.updateReservationStatus = updateReservationStatus;
//# sourceMappingURL=reservationController.js.map