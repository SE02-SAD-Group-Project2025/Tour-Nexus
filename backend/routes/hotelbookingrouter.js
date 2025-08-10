
import express from 'express';
import {  createHotelBooking, getRoomAvailability  } from '../controllers/hotelbookingcontroller.js';

const authMiddleware = (req, res, next) => {
    
    // const token = req.headers.authorization;
    // if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    next();
};

// Admin middleware for restricted routes
const adminMiddleware = (req, res, next) => {
    
    // const user = req.user; 
    // if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
};

const hotelBookingRouter = express.Router();

// Booking Management Routes (User-accessible)
hotelBookingRouter.post('/create', authMiddleware, createHotelBooking); // Create new booking

// Availability Routes (Public or authenticated based on use case)
hotelBookingRouter.get('/availability/:hotel_id', authMiddleware, getRoomAvailability); // Check room availability

export default hotelBookingRouter;
