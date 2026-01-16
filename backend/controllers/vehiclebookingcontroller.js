import Vehicle from "../models/vehicle.js";
import VehicleBooking from "../models/vehicleBooking.js";

export async function createVehicleBooking(req, res) {
    try {
        const vehicle_id = req.params.vehicle_id;
        const { tourist_email, check_in_date, check_out_date, special_requests } = req.body;

        if (!tourist_email || !check_in_date || !check_out_date) {
            return res.status(400).json({
                success: false,
                message: "Missing required booking information",
            });
        }

        const vehicle = await Vehicle.findOne({ vehicle_id });
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found",
            });
        }

        if (!["available", "active"].includes(vehicle.status)) {
            return res.status(400).json({
                success: false,
                message: "Vehicle is not available for booking",
            });
        }

        const checkInDate = new Date(check_in_date);
        const checkOutDate = new Date(check_out_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format",
            });
        }

        if (checkInDate < today) {
            return res.status(400).json({
                success: false,
                message: "Pickup date cannot be in the past",
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "Return date must be after pickup date",
            });
        }

        const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const total_amount = duration * vehicle.price_per_day;

        let booking_id = "VB0001";
        const lastBooking = await VehicleBooking.find().sort({ date: -1 }).limit(1);
        if (lastBooking.length > 0) {
            const lastId = lastBooking[0].booking_id;
            const lastNumber = parseInt(lastId.replace("VB", ""), 10);
            booking_id = "VB" + String(lastNumber + 1).padStart(4, "0");
        }

        const booking = new VehicleBooking({
            booking_id,
            vehicle_id,
            tourist_email,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            duration,
            total_amount,
            special_requests: special_requests || "",
        });

        const savedBooking = await booking.save();

        await Vehicle.updateOne(
            { vehicle_id },
            { $set: { status: "booked" } }
        );

        res.status(201).json({
            success: true,
            message: "Vehicle booked successfully",
            booking: savedBooking,
        });
    } catch (error) {
        console.error("Error creating vehicle booking:", error);
        res.status(500).json({
            success: false,
            message: "Error creating vehicle booking",
            error: error.message,
        });
    }
}

export async function getBookingsByTourist(req, res) {
    try {
        const tourist_email = req.params.email;
        const bookings = await VehicleBooking.find({ tourist_email }).sort({ date: -1 });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching vehicle bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching vehicle bookings",
            error: error.message,
        });
    }
}
