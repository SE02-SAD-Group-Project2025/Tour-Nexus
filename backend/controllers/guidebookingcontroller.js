import Guide from "../models/guide.js";
import guideBooking from "../models/guideBooking.js";
import User from "../models/user.js";

export async function createGuideBooking(req, res) {
    try {
        // Generate unique booking ID
        let guide_booking_id = "GB0001";
        const lastBooking = await GuideBooking.find().sort({ date: -1 }).limit(1);
        
        if (lastBooking.length > 0) {
            const lastBookingId = lastBooking[0].guide_booking_id;
            const lastBookingNumberString = lastBookingId.replace('GB', '');
            const lastBookingNumber = parseInt(lastBookingNumberString);
            const newBookingNumber = lastBookingNumber + 1;
            const newBookingNumberString = String(newBookingNumber).padStart(4, '0');
            guide_booking_id = 'GB' + newBookingNumberString;
        }

        const {
            guide_id,
            check_in_date,
            check_out_date,
            days_count,
            no_of_guests_count,
            nationality,
            emergency_contact,
            special_requests,
            total_amount,
            booking_status = 'requested',
            email
        } = req.body;

        // Validate required fields
        if (!guide_id || !check_in_date || !check_out_date || !days_count || !no_of_guests_count || !nationality || !emergency_contact || !total_amount || !email) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
                required_fields: [
                    "guide_id", "check_in_date", "check_out_date", 
                    "days_count", "no_of_guests_count", "nationality", 
                    "emergency_contact", "total_amount", "email"
                ]
            });
        }

        

        // Validate date format and logic
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD format"
            });
        }

        if (checkInDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past"
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date"
            });
        }

        // Validate duration calculation
        const calculatedDuration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        if (parseInt(days_count) !== calculatedDuration) {
            return res.status(400).json({
                success: false,
                message: "Duration mismatch with selected dates",
                calculated_duration: calculatedDuration,
                provided_duration: parseInt(days_count)
            });
        }

        // Validate number of guests
        const guestCount = parseInt(no_of_guests_count);
        if (isNaN(guestCount) || guestCount < 1 || guestCount > 20) {
            return res.status(400).json({
                success: false,
                message: "Number of guests must be between 1 and 20"
            });
        }

        // Validate total amount
        const amount = parseFloat(total_amount);
        if (isNaN(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid total amount"
            });
        }

        // Find and validate guide
        const guide = await Guide.findOne({ guide_id: guide_id });
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: "Guide not found"
            });
        }

        if (guide.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Guide is not approved for bookings",
                guide_status: guide.status
            });
        }

        // Validate tourist exists and is not blocked
        const tourist = await User.findOne({ 
            email: email, 
            role: 'Tourist',
            isblocked: false 
        });
        if (!tourist) {
            return res.status(404).json({
                success: false,
                message: "Tourist not found or account is blocked"
            });
        }

        // Check for conflicting bookings
        const conflictingBooking = await GuideBooking.findOne({
            guide_id: guide_id,
            booking_status: { $in: ['requested', 'confirmed'] },
            $or: [
                {
                    check_in_date: { $lte: check_out_date },
                    check_out_date: { $gte: check_in_date }
                }
            ]
        });

        if (conflictingBooking) {
            return res.status(409).json({
                success: false,
                message: "Guide is not available for the selected dates",
                conflicting_booking: {
                    booking_id: conflictingBooking.guide_booking_id,
                    check_in: conflictingBooking.check_in_date,
                    check_out: conflictingBooking.check_out_date
                }
            });
        }

        // Validate total amount against guide's daily rate
        const expectedAmount = guide.daily_rate * parseInt(days_count) * guestCount;
        if (Math.abs(expectedAmount - amount) > 0.01) {
            return res.status(400).json({
                success: false,
                message: "Total amount calculation mismatch",
                expected_amount: expectedAmount,
                provided_amount: amount,
                guide_daily_rate: guide.daily_rate
            });
        }

        // Create the booking
        const newBooking = new GuideBooking({
            guide_booking_id,
            guide_id: guide.guide_id,
            guide_email: guide.email,
            email: email,
            price_per_day : guide.daily_rate.toString(),
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            days_count: days_count.toString(),
            no_of_guests_count: no_of_guests_count.toString(),
            total_amount: total_amount.toString(),
            nationality,
            emergency_contact,
            special_requests: special_requests || '',
            booking_status,
            date: new Date()
            
        });

        const savedBooking = await newBooking.save();

        // Return success response with relevant data
        res.status(201).json({
            success: true,
            message: "Guide booking created successfully",
            data: {
                booking_id: savedBooking.guide_booking_id,
                guide_name: guide.full_name,
                tourist_name: tourist.fullname,
                check_in_date: savedBooking.check_in_date,
                check_out_date: savedBooking.check_out_date,
                days_count: savedBooking.days_count,
                total_amount: savedBooking.total_amount,
                booking_status: savedBooking.booking_status,
                guide_contact: guide.contact_number
            }
        });

    } catch (error) {
        console.error("Error creating guide booking:", error);
        
        // Handle specific MongoDB errors
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Booking ID already exists. Please try again.",
                error: "Duplicate booking ID"
            });
        }

        // Handle validation errors
        // if (error.name === 'ValidationError') {
        //     const validationErrors = Object.values(error.errors).map(err => err.message);
        //     return res.status(400).json({
        //         success: false,
        //         message: "Validation failed",
        //         errors: validationErrors
        //     });
        // }

        // return res.status(500).json({
        //     success: false,
        //     message: "Internal server error",
        //     error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        // });
    }
}

// Get all bookings for a tourist
export async function getTouristBookings(req, res) {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Tourist email is required'
            });
        }

        const bookings = await GuideBooking.find({ tourist_email: email })
            .sort({ created_at: -1 });

        // Manually populate guide information
        const bookingsWithGuideInfo = await Promise.all(
            bookings.map(async (booking) => {
                const guide = await Guide.findOne({ guide_id: booking.guide_id })
                    .select('full_name profile_image daily_rate contact_number area_cover');
                
                return {
                    ...booking.toObject(),
                    guide_info: guide
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Tourist bookings retrieved successfully',
            data: bookingsWithGuideInfo,
            count: bookingsWithGuideInfo.length
        });

    } catch (error) {
        console.error('Error retrieving tourist bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Get all bookings for a guide
export async function getGuideBookings(req, res) {
    try {
        const { guide_id } = req.params;
        
        if (!guide_id) {
            return res.status(400).json({
                success: false,
                message: 'Guide ID is required'
            });
        }

        const bookings = await GuideBooking.find({ guide_id })
            .sort({ created_at: -1 });

        // Manually populate tourist information
        const bookingsWithTouristInfo = await Promise.all(
            bookings.map(async (booking) => {
                const tourist = await User.findOne({ 
                    email: booking.tourist_email,
                    role: 'tourist'
                }).select('fullname phone');
                
                return {
                    ...booking.toObject(),
                    tourist_info: tourist
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Guide bookings retrieved successfully',
            data: bookingsWithTouristInfo,
            count: bookingsWithTouristInfo.length
        });

    } catch (error) {
        console.error('Error retrieving guide bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Update booking status
export async function updateBookingStatus(req, res) {
    try {
        const { booking_id } = req.params;
        const { booking_status, rejection_reason } = req.body;

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            });
        }

        const validStatuses = ['requested', 'confirmed', 'cancelled', 'completed'];
        if (!validStatuses.includes(booking_status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid booking status',
                valid_statuses: validStatuses
            });
        }

        const booking = await GuideBooking.findOne({ guide_booking_id: booking_id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Update the booking
        const updateData = {
            booking_status,
            updated_at: new Date()
        };

        if (booking_status === 'cancelled' && rejection_reason) {
            updateData.rejection_reason = rejection_reason;
        }

        const updatedBooking = await GuideBooking.findOneAndUpdate(
            { guide_booking_id: booking_id },
            updateData,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: `Booking ${booking_status} successfully`,
            data: updatedBooking
        });

    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating booking status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Get booking by ID
export async function getBookingById(req, res) {
    try {
        const { booking_id } = req.params;

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            });
        }

        const booking = await GuideBooking.findOne({ guide_booking_id: booking_id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Manually populate guide and tourist information
        const guide = await Guide.findOne({ guide_id: booking.guide_id })
            .select('full_name profile_image contact_number daily_rate area_cover');
        
        const tourist = await User.findOne({ 
            email: booking.tourist_email,
            role: 'tourist'
        }).select('fullname phone');

        const bookingWithInfo = {
            ...booking.toObject(),
            guide_info: guide,
            tourist_info: tourist
        };

        res.status(200).json({
            success: true,
            message: 'Booking retrieved successfully',
            data: bookingWithInfo
        });

    } catch (error) {
        console.error('Error retrieving booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving booking',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Delete booking (soft delete by changing status to cancelled)
export async function deleteBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const { reason } = req.body;

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID is required'
            });
        }

        const booking = await GuideBooking.findOne({ guide_booking_id: booking_id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Soft delete by updating status
        const updatedBooking = await GuideBooking.findOneAndUpdate(
            { guide_booking_id: booking_id },
            { 
                booking_status: 'cancelled',
                rejection_reason: reason || 'Cancelled by user',
                updated_at: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: updatedBooking
        });

    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Get all bookings (admin function)
export async function getAllBookings(req, res) {
    try {
        const { page = 1, limit = 20, status, startDate, endDate } = req.query;
        
        // Build filter criteria
        let filterCriteria = {};
        
        if (status) {
            filterCriteria.booking_status = status;
        }
        
        if (startDate || endDate) {
            filterCriteria.check_in_date = {};
            if (startDate) filterCriteria.check_in_date.$gte = new Date(startDate);
            if (endDate) filterCriteria.check_in_date.$lte = new Date(endDate);
        }

        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Get bookings with pagination
        const bookings = await GuideBooking.find(filterCriteria)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limitNum);

        // Get total count
        const totalBookings = await GuideBooking.countDocuments(filterCriteria);

        // Populate guide and tourist information
        const bookingsWithInfo = await Promise.all(
            bookings.map(async (booking) => {
                const guide = await Guide.findOne({ guide_id: booking.guide_id })
                    .select('full_name profile_image contact_number');
                
                const tourist = await User.findOne({ 
                    email: booking.tourist_email,
                    role: 'tourist'
                }).select('fullname phone');
                
                return {
                    ...booking.toObject(),
                    guide_info: guide,
                    tourist_info: tourist
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'All bookings retrieved successfully',
            data: bookingsWithInfo,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalBookings / limitNum),
                totalBookings: totalBookings,
                limit: limitNum
            },
            filters: filterCriteria
        });

    } catch (error) {
        console.error('Error retrieving all bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Get booking statistics
export async function getBookingStats(req, res) {
    try {
        const stats = await GuideBooking.aggregate([
            {
                $group: {
                    _id: '$booking_status',
                    count: { $sum: 1 },
                    totalAmount: { 
                        $sum: { 
                            $toDouble: '$total_amount' 
                        } 
                    }
                }
            }
        ]);

        // Get monthly booking trends
        const monthlyStats = await GuideBooking.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$created_at' },
                        month: { $month: '$created_at' }
                    },
                    count: { $sum: 1 },
                    revenue: { 
                        $sum: { 
                            $toDouble: '$total_amount' 
                        } 
                    }
                }
            },
            {
                $sort: { '_id.year': -1, '_id.month': -1 }
            },
            {
                $limit: 12
            }
        ]);

        // Calculate total revenue
        const totalRevenue = await GuideBooking.aggregate([
            {
                $match: { booking_status: { $in: ['confirmed', 'completed'] } }
            },
            {
                $group: {
                    _id: null,
                    total: { 
                        $sum: { 
                            $toDouble: '$total_amount' 
                        } 
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                statusBreakdown: stats,
                monthlyTrends: monthlyStats,
                totalRevenue: totalRevenue[0]?.total || 0,
                generatedAt: new Date()
            }
        });

    } catch (error) {
        console.error('Error getting booking stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving booking statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

// Get upcoming bookings (for dashboard)
export async function getUpcomingBookings(req, res) {
    try {
        const { email, role } = req.query;
        const currentDate = new Date();
        
        if (!email || !role) {
            return res.status(400).json({
                success: false,
                message: 'Email and role are required'
            });
        }

        let filterCriteria = {
            booking_status: { $in: ['requested', 'confirmed'] },
            check_in_date: { $gte: currentDate }
        };

        // Filter based on user role
        if (role === 'Tourist') {
            filterCriteria.tourist_email = email;
        } else if (role === 'Guide') {
            // Find guide by email first
            const guide = await Guide.findOne({ email: email });
            if (!guide) {
                return res.status(404).json({
                    success: false,
                    message: 'Guide not found'
                });
            }
            filterCriteria.guide_id = guide.guide_id;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be "tourist" or "guide"'
            });
        }

        const upcomingBookings = await GuideBooking.find(filterCriteria)
            .sort({ check_in_date: 1 })
            .limit(10);

        // Populate related information
        const bookingsWithInfo = await Promise.all(
            upcomingBookings.map(async (booking) => {
                const guide = await Guide.findOne({ guide_id: booking.guide_id })
                    .select('full_name profile_image contact_number');
                
                const tourist = await User.findOne({ 
                    email: booking.tourist_email,
                    role: 'tourist'
                }).select('fullname phone');
                
                return {
                    ...booking.toObject(),
                    guide_info: guide,
                    tourist_info: tourist
                };
            })
        );

        res.status(200).json({
            success: true,
            message: 'Upcoming bookings retrieved successfully',
            data: bookingsWithInfo,
            count: bookingsWithInfo.length
        });

    } catch (error) {
        console.error('Error retrieving upcoming bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving upcoming bookings',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

export async function getBookingByEmail(req,res){

    const email = req.params.email;

    try{

        const booking = await GuideBooking.find({email:email});
        res.json(booking)
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Error fetching booking by email",
            error: error.message
        });
    }   
}