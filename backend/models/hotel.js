import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
    hotel_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    hotel_name: {
        type: String,
        required: true,
    },
    images: [{
        type: String,
        required: true,
    }],
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    parking_available: {
        type: Boolean,
        default: false,
    },
    
    // Simple room types array - just basic info
    room_types: [{
        name: {
            type: String,
            required: true,
        },
        count: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        facilities: [{
            type: String,
        }],
        images: [{
            type: String,
            required: true,
        }]
    }],
    
    total_rooms: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;