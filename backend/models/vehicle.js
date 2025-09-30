import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
    vehicle_id: {
        type: String,
        required: true,
        unique: true,
    },
    branch_name: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
        match: [/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/, 'Images must be valid URLs with supported formats'],
    }],
    vehicle_book_image: {
        type: String,
        required: true,
        match: [/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/, 'Book image must be a valid URL with supported format'],
    },
    vehicle_type: {
        type: String,
        required: true,
        enum: ['tuk_tuk', 'motorbike', 'car', 'van', 'other'],
    },
    vehicle_model: {
        type: String,
        required: true,
    },
    seating_capacity: {
        type: Number,
        required: true,
        min: [1, 'Seating capacity must be at least 1'],
    },
    price_per_day: {
        type: Number,
        required: true,
        min: [0, 'Price per day cannot be negative'],
    },
    fuel_type: {
        type: String,
        required: true,
        enum: ['petrol', 'diesel', 'hybrid', 'electric'],
    },
    status: {
        type: String,
        enum: ['active', 'available', 'booked', 'maintenance', 'unavailable'],
        default: 'active',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;