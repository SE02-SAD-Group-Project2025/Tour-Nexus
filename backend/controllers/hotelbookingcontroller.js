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
            check_in_date, check_out_date, special_requests, payment_method, card_details,
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
        let processedCardDetails = {};
        if (card_details && card_details.card_number) {
            const cardNumber = card_details.card_number.replace(/\s/g, '');
            if (cardNumber.length < 13 || cardNumber.length > 19) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid card number"
                });
            }

            processedCardDetails = {
                card_last_four: cardNumber.slice(-4),
                card_type: detectCardType(cardNumber),
                cardholder_name: card_details.cardholder_name
            };

            const paymentSuccess = await simulatePaymentProcessing(card_details, total_price);
            if (!paymentSuccess) {
                return res.status(400).json({
                    success: false,
                    message: "Payment processing failed"
                });
            }
        }

        // Create booking
        const hotelBooking = new HotelBooking({
            hotel_booking_id, email, hotel_id, hotel_name: hotel.hotel_name,
            check_in_date: checkInDate, check_out_date: checkOutDate,
            no_of_rooms: parseInt(no_of_rooms), no_of_guests: parseInt(no_of_guests),
            room_type: roomType.name, room_price: per_price, total_amount: total_price,
            special_requests: special_requests || '', card_details: processedCardDetails,
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

function detectCardType(cardNumber) {
    const firstDigit = cardNumber.charAt(0);
    const firstTwoDigits = cardNumber.substring(0, 2);
    const firstFourDigits = cardNumber.substring(0, 4);

    if (firstDigit === '4') return 'Visa';
    if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) return 'MasterCard';
    if (['34', '37'].includes(firstTwoDigits)) return 'American Express';
    if (firstFourDigits === '6011' || firstTwoDigits === '65') return 'Discover';
    return 'Unknown';
}

async function simulatePaymentProcessing(cardDetails, amount) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 1000);
    });
}