import mongoose from "mongoose";

const roomTypeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true },
    available_room_count: { type: Number, default: function() { return this.count; } }, // Defaults to count
    price: { type: Number, required: true },
    facilities: [{ type: String }],
    images: [{ type: String }],
});

const hotelSchema = new mongoose.Schema({
    hotel_id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    hotel_name: { type: String, required: true },
    images: [{ type: String }],
    address: { type: String, required: true },
    city: { type: String, required: true },
    contact_number: { type: String, required: true },
    description: { type: String, required: true },
    parking_available: { type: Boolean, required: true },
    room_types: [roomTypeSchema],
    total_rooms: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ["pending", "approved", "rejected"], 
        default: "pending" 
    },
    date: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

export default mongoose.model("Hotel", hotelSchema);