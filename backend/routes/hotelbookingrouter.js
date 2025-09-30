
import express from 'express';
import { cancelBooking, createHotelBooking, getAllBookings, getBookingById, getHotelOwnerUpcomingBookings, getRoomAvailability, getUserBookings, updateBookingStatus } from '../controllers/hotelbookingcontroller.js';

// Placeholder middleware for authentication/authorization
// Replace with actual implementation (e.g., JWT validation)
const authMiddleware = (req, res, next) => {
    // Example: Check for user authentication
    // const token = req.headers.authorization;
    // if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
    next();
};

// Admin middleware for restricted routes
const adminMiddleware = (req, res, next) => {
    // Example: Check for admin role
    // const user = req.user; // Assuming user is set by authMiddleware
    // if (user.role !== 'admin') return res.status(403).json({ success: false, message: 'Forbidden' });
    next();
};

const hotelBookingRouter = express.Router();

// Booking Management Routes (User-accessible)
hotelBookingRouter.post('/create', authMiddleware, createHotelBooking); // Create new booking
hotelBookingRouter.get('/user/:email', authMiddleware, getUserBookings); // Get user's bookings
hotelBookingRouter.get('/:booking_id', authMiddleware, getBookingById); // Get specific booking
hotelBookingRouter.patch('/:booking_id/cancel', authMiddleware, cancelBooking); // Cancel booking
hotelBookingRouter.patch('/:booking_id/status', authMiddleware, adminMiddleware, updateBookingStatus); // Update booking status (admin)

hotelBookingRouter.get('/upcoming/:hotel_id', authMiddleware, getHotelOwnerUpcomingBookings);

// Admin/Management Routes
hotelBookingRouter.get('/', getAllBookings); // Get all bookings (with pagination)

// Availability Routes (Public or authenticated based on use case)
hotelBookingRouter.get('/availability/:hotel_id', authMiddleware, getRoomAvailability); // Check room availability

export default hotelBookingRouter;
