import Hotel from "../models/hotel.js";
import HotelBooking from "../models/hotelBooking.js";

export async function createHotelBooking(req, res) {
    try {
        // Generate unique booking ID
        let hotel_booking_id = "HB0001";
        const lastBooking = await HotelBooking.find().sort({ date: -1 }).limit(1);
        
        if (lastBooking.length > 0) {
            const lastBookingId = lastBooking[0].hotel_booking_id;
            const lastBookingNumberString = lastBookingId.replace('HB', '');
            const lastBookingNumber = parseInt(lastBookingNumberString);
            const newBookingNumber = lastBookingNumber + 1;
            const newBookingNumberString = String(newBookingNumber).padStart(4, '0');
            hotel_booking_id = 'HB' + newBookingNumberString;
        }

        // Extract booking data
        const {
            hotel_id, category_id, no_of_rooms, no_of_guests, per_price, total_price,
            check_in_date, check_out_date, special_requests,
            booking_status = 'pending', email
        } = req.body;

        // Validate required fields
        if (!hotel_id || !category_id || !no_of_rooms || !no_of_guests || 
            !check_in_date || !check_out_date || !total_price || !email) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking information"
            });
        }

        // Fetch hotel
        const hotel = await Hotel.findOne({ hotel_id: hotel_id });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        // Check hotel status
        if (hotel.status !== 'approved') {
            return res.status(400).json({
                success: false,
                message: "Hotel is not currently accepting bookings"
            });
        }

        // Validate room type
        const roomTypeIndex = category_id - 1;
        const roomType = hotel.room_types[roomTypeIndex];
        if (!roomType) {
            return res.status(404).json({
                success: false,
                message: "Room type not found"
            });
        }

        // Validate dates
        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkInDate < today) {
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

        // Validate guest capacity
        const maxGuests = no_of_rooms * 4;
        if (no_of_guests > maxGuests) {
            return res.status(400).json({
                success: false,
                message: `Maximum ${maxGuests} guests allowed for ${no_of_rooms} room(s)`
            });
        }

        // Check room availability
        const availability = await checkRoomAvailability(
            hotel_id, roomType.name, checkInDate, checkOutDate, no_of_rooms
        );

        if (!availability.available) {
            return res.status(400).json({
                success: false,
                message: availability.message
            });
        }

        // Process card details
        // let processedCardDetails = {};
        // if (card_details && card_details.card_number) {
        //     const cardNumber = card_details.card_number.replace(/\s/g, '');
        //     if (cardNumber.length < 13 || cardNumber.length > 19) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Invalid card number"
        //         });
        //     }

        //     processedCardDetails = {
        //         card_last_four: cardNumber.slice(-4),
        //         card_type: detectCardType(cardNumber),
        //         cardholder_name: card_details.cardholder_name
        //     };

        //     const paymentSuccess = await simulatePaymentProcessing(card_details, total_price);
        //     if (!paymentSuccess) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Payment processing failed"
        //         });
        //     }
        // }

        // Create booking
        const hotelBooking = new HotelBooking({
            hotel_booking_id, email, hotel_id, hotel_name: hotel.hotel_name,
            check_in_date: checkInDate, check_out_date: checkOutDate,
            no_of_rooms: parseInt(no_of_rooms), no_of_guests: parseInt(no_of_guests),
            room_type: roomType.name, room_price: per_price, total_amount: total_price,
            special_requests: special_requests || '',
            booking_status
        });

        const savedBooking = await hotelBooking.save();

        // Update available_room_count
        await updateRoomAvailability(hotel_id, roomTypeIndex, -no_of_rooms);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking: {
                booking_id: savedBooking.hotel_booking_id,
                hotel_name: savedBooking.hotel_name,
                room_type: savedBooking.room_type,
                check_in_date: savedBooking.check_in_date,
                check_out_date: savedBooking.check_out_date,
                no_of_rooms: savedBooking.no_of_rooms,
                no_of_guests: savedBooking.no_of_guests,
                total_amount: savedBooking.total_amount,
                booking_status: savedBooking.booking_status,
                date: savedBooking.date
            }
        });

    } catch (error) {
        console.error("Error creating hotel booking:", error);
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message
        });
    }
}

async function checkRoomAvailability(hotel_id, room_type, checkInDate, checkOutDate, requestedRooms) {
    try {
        const hotel = await Hotel.findOne({ hotel_id: hotel_id });
        const roomTypeData = hotel.room_types.find(rt => rt.name === room_type);
        
        if (!roomTypeData) {
            return {
                available: false,
                message: "Room type not found"
            };
        }

        // Get overlapping bookings
        const overlappingBookings = await HotelBooking.find({
            hotel_id: hotel_id,
            room_type: room_type,
            booking_status: { $in: ['pending', 'confirmed'] },
            $or: [
                {
                    check_in_date: { $lt: checkOutDate },
                    check_out_date: { $gt: checkInDate }
                }
            ]
        });

        const totalBookedRooms = overlappingBookings.reduce((sum, booking) => {
            return sum + booking.no_of_rooms;
        }, 0);

        const totalRoomsOfType = roomTypeData.count;
        const availableRooms = totalRoomsOfType - totalBookedRooms;

        if (availableRooms < requestedRooms) {
            return {
                available: false,
                message: `Only ${availableRooms} rooms of type "${room_type}" available for selected dates`,
                availableRooms: availableRooms,
                requestedRooms: requestedRooms
            };
        }

        return {
            available: true,
            availableRooms: availableRooms,
            totalRooms: totalRoomsOfType,
            bookedRooms: totalBookedRooms
        };

    } catch (error) {
        console.error("Error checking room availability:", error);
        return {
            available: false,
            message: "Error checking availability"
        };
    }
}

async function updateRoomAvailability(hotel_id, roomTypeIndex, roomChange) {
    try {
        const hotel = await Hotel.findOne({ hotel_id: hotel_id });
        if (!hotel || !hotel.room_types[roomTypeIndex]) {
            throw new Error("Hotel or room type not found");
        }

        const newCount = hotel.room_types[roomTypeIndex].available_room_count + roomChange;
        if (newCount < 0) {
            throw new Error("Cannot reduce room count below 0");
        }

        await Hotel.updateOne(
            { hotel_id: hotel_id },
            { 
                $set: { 
                    [`room_types.${roomTypeIndex}.available_room_count`]: newCount,
                    updated_at: new Date()
                }
            }
        );

        // Update total_rooms
        const totalRooms = hotel.room_types.reduce((sum, room, index) => {
            return sum + (index === roomTypeIndex ? newCount : room.available_room_count);
        }, 0);

        await Hotel.updateOne(
            { hotel_id: hotel_id },
            { 
                $set: { 
                    total_rooms: totalRooms
                }
            }
        );

        return true;
    } catch (error) {
        console.error("Error updating room availability:", error);
        throw error;
    }
}

export async function cancelBooking(req, res) {
    try {
        const { booking_id } = req.params;
        const { cancellation_reason } = req.body;
        
        const booking = await HotelBooking.findOne({ hotel_booking_id: booking_id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.booking_status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        if (booking.booking_status === 'completed') {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel completed booking"
            });
        }

        const checkInDate = new Date(booking.check_in_date);
        const now = new Date();
        const hoursUntilCheckIn = (checkInDate - now) / (1000 * 60 * 60);

        if (hoursUntilCheckIn < 24) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel booking within 24 hours of check-in"
            });
        }

        const hotel = await Hotel.findOne({ hotel_id: booking.hotel_id });
        const roomTypeIndex = hotel.room_types.findIndex(rt => rt.name === booking.room_type);

        if (roomTypeIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Room type not found in hotel"
            });
        }

        await HotelBooking.updateOne(
            { hotel_booking_id: booking_id },
            {
                booking_status: 'cancelled',
                cancellation_reason: cancellation_reason || 'Cancelled by user',
                cancellation_date: new Date(),
                updated_at: new Date()
            }
        );

        await updateRoomAvailability(booking.hotel_id, roomTypeIndex, booking.no_of_rooms);

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully and room availability restored"
        });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        res.status(500).json({
            success: false,
            message: "Error cancelling booking",
            error: error.message
        });
    }
}

export async function getUserBookings(req, res) {
    try {
        const userEmail = req.params.email;
        const bookings = await HotelBooking.find({ email: userEmail })
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            data: bookings,
            count: bookings.length
        });

    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message
        });
    }
}

export async function getBookingById(req, res) {
    try {
        const { booking_id } = req.params;
        const booking = await HotelBooking.findOne({ hotel_booking_id: booking_id });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });

    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching booking",
            error: error.message
        });
    }
}

export async function getAllBookings(req, res) {
    try {
        

        const { status, hotel_id, page = 1, limit = 20 } = req.query;
        let query = {};
        if (status) query.booking_status = status;
        if (hotel_id) query.hotel_id = hotel_id;

        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            HotelBooking.find(query)
                .sort({ date: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            HotelBooking.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching all bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message
        });
    }
}

export async function updateBookingStatus(req, res) {
    try {
        const { booking_id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking status"
            });
        }

        const booking = await HotelBooking.findOne({ hotel_booking_id: booking_id });
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (status === 'cancelled' && booking.booking_status !== 'cancelled') {
            const hotel = await Hotel.findOne({ hotel_id: booking.hotel_id });
            const roomTypeIndex = hotel.room_types.findIndex(rt => rt.name === booking.room_type);
            
            if (roomTypeIndex !== -1) {
                await updateRoomAvailability(booking.hotel_id, roomTypeIndex, booking.no_of_rooms);
            }
        }

        await HotelBooking.updateOne(
            { hotel_booking_id: booking_id },
            { 
                booking_status: status,
                updated_at: new Date()
            }
        );

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully"
        });

    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({
            success: false,
            message: "Error updating booking status",
            error: error.message
        });
    }
}

export async function getRoomAvailability(req, res) {
    try {
        const { hotel_id } = req.params;
        const { check_in_date, check_out_date } = req.query;

        if (!check_in_date || !check_out_date) {
            return res.status(400).json({
                success: false,
                message: "Check-in and check-out dates are required"
            });
        }

        const hotel = await Hotel.findOne({ hotel_id: hotel_id });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);

        const availabilityPromises = hotel.room_types.map(async (roomType, index) => {
            const availability = await checkRoomAvailability(
                hotel_id, roomType.name, checkInDate, checkOutDate, 1
            );
            
            return {
                roomType: roomType.name,
                totalRooms: roomType.count,
                availableRooms: availability.availableRooms || 0,
                pricePerNight: roomType.price,
                facilities: roomType.facilities,
                images: roomType.images,
                available: availability.available
            };
        });

        const roomAvailability = await Promise.all(availabilityPromises);

        res.status(200).json({
            success: true,
            data: {
                hotel_id: hotel.hotel_id,
                hotel_name: hotel.hotel_name,
                check_in_date: checkInDate,
                check_out_date: checkOutDate,
                room_availability: roomAvailability
            }
        });

    } catch (error) {
        console.error("Error fetching room availability:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching room availability",
            error: error.message
        });
    }
}

// function detectCardType(cardNumber) {
//     const firstDigit = cardNumber.charAt(0);
//     const firstTwoDigits = cardNumber.substring(0, 2);
//     const firstFourDigits = cardNumber.substring(0, 4);

//     if (firstDigit === '4') return 'Visa';
//     if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'MasterCard';
//     if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
//     if (firstFourDigits === '6011' || firstTwoDigits === '65') return 'Discover';
//     return 'Unknown';
// }

// async function simulatePaymentProcessing(cardDetails, amount) {
//     return new Promise((resolve) => {
//         setTimeout(() => resolve(true), 1000);
//     });
// }


export async function getHotelOwnerUpcomingBookings(req, res) {
    try {
        const { hotel_id } = req.params;
        const { page = 1, limit = 10 } = req.query;

        // Verify hotel exists and get owner information
        const hotel = await Hotel.findOne({ hotel_id });
        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        // Verify if the requesting user is the hotel owner
        // Assuming req.user contains authenticated user information
        if (req.user && req.user.email !== hotel.email) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You are not the owner of this hotel"
            });
        }

        // Build query for upcoming bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let query = { 
            hotel_id,
            check_in_date: { $gte: today },
            booking_status: { $in: ['pending', 'confirmed'] }
        };

        const skip = (page - 1) * limit;

        // Fetch bookings with pagination
        const [bookings, total] = await Promise.all([
            HotelBooking.find(query)
                .select('hotel_booking_id email hotel_name room_type check_in_date check_out_date no_of_rooms no_of_guests total_amount booking_status date')
                .sort({ check_in_date: 1 }) // Sort by check-in date ascending
                .skip(skip)
                .limit(parseInt(limit)),
            HotelBooking.countDocuments(query)
        ]);

        // Format response data
        const formattedBookings = bookings.map(booking => ({
            booking_id: booking.hotel_booking_id,
            guest_email: booking.email,
            hotel_name: booking.hotel_name,
            room_type: booking.room_type,
            check_in_date: booking.check_in_date,
            check_out_date: booking.check_out_date,
            no_of_rooms: booking.no_of_rooms,
            no_of_guests: booking.no_of_guests,
            total_amount: booking.total_amount,
            booking_status: booking.booking_status,
            booking_date: booking.date
        }));

        res.status(200).json({
            success: true,
            data: formattedBookings,
            hotel: {
                hotel_id: hotel.hotel_id,
                hotel_name: hotel.hotel_name
            },
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error("Error fetching hotel owner upcoming bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching upcoming bookings",
            error: error.message
        });
    }
}