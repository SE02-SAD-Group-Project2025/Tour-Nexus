import mongoose from "mongoose";

const guideBookingSchema = new mongoose.Schema({
    guide_booking_id: {
        type: String,
        required: true,
    },
    guide_id: {
        type: String,
        required: true,
    },
    guide_email: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    price_per_day: {
        type: String,
    },
    check_in_date: {
        type: Date,
        required: true,
    },
    check_out_date: {
        type: Date,
        required: true,
    },
    days_count: {
        type: String,
        required: true,
    },
    no_of_guests_count: {
        type: String,
        required: true,
    },
    total_amount: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true,
    },
    emergency_contact: {
        type: String,
        required: true,
    },
    special_request: {
      type: String,
      trim: true, 
    },
    booking_status: {
        type: String,
        required: true,
        default: 'requested'
    },
    date:{
        type: Date,
        default: Date.now
    }
    });
    const GuideBooking = mongoose.model("GuideBooking",guideBookingSchema);
    
    export default GuideBooking;
