import mongoose from "mongoose";

const vehicleBookingSchema = new mongoose.Schema({
    booking_id: {
        type: String,
        required: true,
        unique: true,
    },
    vehicle_id: {
        type: String,
        required: true,
    },
    tourist_email: {
        type: String,
        required: true,
    },
    check_in_date: {
        type: Date,
        required: true,
    },
    check_out_date: {
        type: Date,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
        min: 1,
    },
    total_amount: {
        type: Number,
        required: true,
        min: 0,
    },
    special_requests: {
        type: String,
        default: "",
    },
    booking_status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled"],
        default: "pending",
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const VehicleBooking = mongoose.model("VehicleBooking", vehicleBookingSchema);

export default VehicleBooking;
