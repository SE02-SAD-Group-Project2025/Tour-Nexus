import express from 'express';
import { addVehicle, deleteVehicle, getAllVehicles, getVehicleByBranch, getVehicleById, getVehicleByStatus, getVehicleByType, updateVehicle } from '../controllers/vehiclecontroller.js';

const vehicleRouter = express.Router();


vehicleRouter.post('/addvehicle' , addVehicle);
vehicleRouter.get("/view_all_vehicles", getAllVehicles);
vehicleRouter.get("/view_vehicle_by_branch/:branch_name",getVehicleByBranch);
vehicleRouter.get("/view_vehicle_by_id/:vehicle_id",getVehicleById);
vehicleRouter.get("/view_vehicle_by_type/:vehicle_type",getVehicleByType);
vehicleRouter.get("/view_vehicle_by_status/:status",getVehicleByStatus);
vehicleRouter.get("/status/:status", getVehicleByStatus);

// Update
vehicleRouter.put('/update_vehicle/:vehicle_id', updateVehicle);

// Delete
vehicleRouter.delete('/delete_vehicle/:vehicle_id', deleteVehicle);

export default vehicleRouter;
