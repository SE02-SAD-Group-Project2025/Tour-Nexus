import express from 'express';
import { createGuideBooking, deleteBooking, getAllBookings, getBookingByEmail, getBookingById, getBookingStats, getGuideBookings, getTouristBookings, getUpcomingBookings, updateBookingStatus } from "../controllers/guidebookingcontroller.js";

const guideBookingRouter = express.Router();


// Create a new guide booking
guideBookingRouter.post('/book', createGuideBooking);

// ===== BOOKING RETRIEVAL =====
// Get all bookings for a specific tourist (by email)
guideBookingRouter.get('/tourist/:email', getTouristBookings);

// Get all bookings for a specific guide (by guide_id)
guideBookingRouter.get('/guide/:guide_id', getGuideBookings);

// Get a specific booking by booking ID
guideBookingRouter.get('/booking/:booking_id', getBookingById);

// Get all bookings (admin function with filtering and pagination)
// Query params: page, limit, status, startDate, endDate
guideBookingRouter.get('/all', getAllBookings);

// Get upcoming bookings for dashboard
// Query params: email, role (tourist/guide)
guideBookingRouter.get('/upcoming', getUpcomingBookings);

// ===== BOOKING MANAGEMENT =====
// Update booking status (requested → confirmed → completed or cancelled)
guideBookingRouter.put('/booking/:booking_id/status', updateBookingStatus);

// Cancel/Delete booking (soft delete)
guideBookingRouter.delete('/booking/:booking_id', deleteBooking);

// ===== ANALYTICS & STATISTICS =====
// Get booking statistics and analytics
guideBookingRouter.get('/stats', getBookingStats);

guideBookingRouter.get("/guide_booking/:email", getBookingByEmail);

export default guideBookingRouter;
