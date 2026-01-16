import express from 'express';
import { addHotel, approveHotel, deleteHotel, getApprovedHotels, getHotelById, getHotelByIdWithAvailability, getHotelsByHotelOwner, getHotelStats, getPendingHotels, rejectHotel, searchHotels, updateHotels, view_all_hotels } from '../controllers/hotelcontroller.js';

const hotelRouter = express.Router();

hotelRouter.post('/addhotel', addHotel);

hotelRouter.put("/approve_hotel/:hotel_id",approveHotel);
hotelRouter.put("/reject_hotel/:hotel_id",rejectHotel);
hotelRouter.get("/view_pending_hotels",getPendingHotels);
hotelRouter.get("/view_approved_hotels",getApprovedHotels);
hotelRouter.get("/view_hotels_by_hotel_owner/:email",getHotelsByHotelOwner);
hotelRouter.put("/update_hotel/:hotel_id",updateHotels);
hotelRouter.delete("/delete_hotel/:hotel_id",deleteHotel);
hotelRouter.get("/view_all_hotels",view_all_hotels);
hotelRouter.get("/view_hotels_by_id/:hotel_id",getHotelById);
hotelRouter.get("/stats", getHotelStats);


hotelRouter.get("/search", searchHotels);
hotelRouter.get("/view_hotels_by_id_with_availability/:hotel_id", getHotelByIdWithAvailability);

export default hotelRouter;
