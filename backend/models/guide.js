import mongoose from "mongoose";

const guideSchema = new mongoose.Schema({
    guide_id: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    full_name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
        min: [18, 'Age must be at least 18'],
    },
    gender: {
        type: String,
        required: true,
    },
    years_of_experience: {
        type: Number,
        required: true,
        min: [0, 'Years of experience cannot be negative'],
    },
    guide_license_no: {
        type: String,
        required: true,
    },
    contact_number: {
        type: String,
        required: true,
        match: [/^\+94\d{9}$/, 'Please provide a valid Sri Lankan phone number (e.g., +94712345678)'],
    },
    bio: {
        type: String,
        required: true,
    },
    profile_image: {
        type: String,
        required: true,
    },
    languages: {
        type: [{ type: String }],
        required: true,
        validate: [array => array.length > 0, 'At least one language is required'],
    },
    specialities: {
        type: [{ type: String }],
        required: true,
        validate: [array => array.length > 0, 'At least one specialty is required'],
    },
    area_cover: {
        type: [{ type: String }],
        required: true,
        validate: [array => array.length > 0, 'At least one area is required'],
    },
    daily_rate: {
        type: Number,
        required: true,
    },
    hourly_rate: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Guide = mongoose.model("Guide", guideSchema);

export default Guide;