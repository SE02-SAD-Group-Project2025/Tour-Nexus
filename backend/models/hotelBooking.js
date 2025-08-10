import mongoose from "mongoose";

const hotelBookingSchema = new mongoose.Schema({
    hotel_booking_id:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    hotel_id:{
        type: String,
        required: true,
    },
    hotel_name: {
        type: String,
        required: true,
    },
    check_in_date: {
        type: Date,
        required: true
    },
    check_out_date: {
        type: Date,
        required: true
    },
    no_of_rooms: {
        type: Number,
        required: true,
    },
    no_of_guests: {
    type: Number,
    required: true,
    },
    room_type: {
        type: String,
        required: true,
    },
    room_price: {
        type: Number,
        required: true,
    },
    total_amount: {
        type: Number,
        required: true,
    },
    special_requests: {
        type: String,
        default: ''
    },
    card_details: {
        card_last_four: String,
        card_type: String,
        cardholder_name: String
    },
    booking_status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
        default: 'pending'
    },
    cancellation_reason: {
        type: String
    },
    cancellation_date: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});


const HotelBooking = mongoose.model("HotelBooking", hotelBookingSchema);

export default HotelBooking;