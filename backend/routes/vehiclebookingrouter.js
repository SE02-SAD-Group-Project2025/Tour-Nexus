import express from "express";
import { createVehicleBooking, getBookingsByTourist } from "../controllers/vehiclebookingcontroller.js";

const vehicleBookingRouter = express.Router();

vehicleBookingRouter.post("/:vehicle_id/book", createVehicleBooking);
vehicleBookingRouter.get("/tourist/:email", getBookingsByTourist);

export default vehicleBookingRouter;
