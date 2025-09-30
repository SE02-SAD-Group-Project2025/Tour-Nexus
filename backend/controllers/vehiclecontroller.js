import Vehicle from "../models/vehicle.js";
import { isVehicleCompany } from "./usercontroller.js";

export async function addVehicle(req, res) {
    let vehicle_id = "V0001";

    const lastVehicle = await Vehicle.find().sort({ date: -1 }).limit(1);

    if (lastVehicle.length > 0) {
        const lastVehicleId = lastVehicle[0].vehicle_id;
        const lastVehicleNumberString = lastVehicleId.replace('V', '');
        const lastVehicleNumber = parseInt(lastVehicleNumberString);
        const newVehicleNumber = lastVehicleNumber + 1;
        const newVehicleNumberString = String(newVehicleNumber).padStart(4, '0');
        vehicle_id = 'V' + newVehicleNumberString;
    }

    try {
        // Validate user role
        if (!isVehicleCompany(req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only Vehicle Company can add vehicles"
            });
        }

        // Extract and validate required fields from request body
        const {
            branch_name,
            images,
            vehicle_book_image,
            vehicle_type,
            vehicle_model,
            seating_capacity,
            price_per_day,
            fuel_type
        } = req.body;

        if (!branch_name || !images || !Array.isArray(images) || images.length === 0 || !vehicle_book_image || 
            !vehicle_type || !vehicle_model || seating_capacity == null || price_per_day == null || !fuel_type) {
            return res.status(400).json({
                success: false,
                message: "Missing or invalid required vehicle information"
            });
        }

        const vehicle = new Vehicle({
            vehicle_id,
            branch_name,
            images,
            vehicle_book_image,
            vehicle_type,
            vehicle_model,
            seating_capacity,
            price_per_day,
            fuel_type,
            status: 'active' // Default status as per schema
        });

        const addedVehicle = await vehicle.save();
        res.status(201).json({
            success: true,
            message: "Vehicle added successfully",
            vehicle: addedVehicle
        });

    } catch (error) {
        console.error("Error adding vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding vehicle",
            error: error.message
        });
    }
}

export async function getVehicleByBranch(req, res) {
    const branch_name = req.params.branch_name;

    try {
        const vehicles = await Vehicle.find({ branch_name: branch_name });

        res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vehicles",
            error: error.message,
        });
    }
}
export async function getVehicleByType(req, res) {
    const vehicle_type = req.params.vehicle_type;

    try {
        const vehicles = await Vehicle.find({ vehicle_type: vehicle_type });

        res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vehicles",
            error: error.message,
        });
    }
}
export async function getVehicleById(req, res) {
    try {
        const vehicle_id = req.params.vehicle_id;

        const vehicle = await Vehicle.findOne({ vehicle_id: vehicle_id });

        res.json(vehicle);
    } catch (error) {
        res.status(500).json({
            error,
        })
    }
}
export async function getVehicleByStatus(req, res) {
    const status = req.params.status;

    try {
        const vehicles = await Vehicle.find({ status: status });

        res.status(200).json({
            success: true,
            data: vehicles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching vehicles",
            error: error.message,
        });
    }
}



export async function updateVehicle(req, res) {
    try {
        // Validate user role
        if (!isVehicleCompany(req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only Vehicle Company can update vehicles"
            });
        }

        const { vehicle_id } = req.params;

        // Check if vehicle exists
        const vehicle = await Vehicle.findOne({ vehicle_id });
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        // Allowed fields to update
        const allowedUpdates = [
            "branch_name", "images", "vehicle_book_image",
            "vehicle_type", "vehicle_model", "seating_capacity",
            "price_per_day", "fuel_type", "status"
        ];

        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        // Perform update
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicle_id },
            { $set: updates },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            vehicle: updatedVehicle
        });

    } catch (error) {
        console.error("Error updating vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating vehicle",
            error: error.message
        });
    }
}

export async function deleteVehicle(req, res) {
    try {
        // Validate user role
        if (!isVehicleCompany(req)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: Only Vehicle Company can delete vehicles"
            });
        }

        const { vehicle_id } = req.params;

        // Check if vehicle exists
        const vehicle = await Vehicle.findOne({ vehicle_id });
        if (!vehicle) {
            return res.status(404).json({
                success: false,
                message: "Vehicle not found"
            });
        }

        await Vehicle.deleteOne({ vehicle_id });

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting vehicle:", error);
        return res.status(500).json({
            success: false,
            message: "Error deleting vehicle",
            error: error.message
        });
    }
}
