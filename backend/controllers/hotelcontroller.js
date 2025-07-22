import Hotel from "../models/hotel.js"
import { isAdmin } from "./usercontroller.js";

export async function addHotel(req,res){
    
    let hotel_id ="h0001"

    const lastHotel = await Hotel.find().sort({date: -1}).limit(1);

    if(lastHotel.length > 0){
        const lastHotelId = lastHotel[0].hotel_id;
        const lastHotelNumberString = lastHotelId.replace('h', '');
        const lastHotelNumber = parseInt(lastHotelNumberString);
        const newHotelNumber = lastHotelNumber + 1;
        const newHotelNumberString = String(newHotelNumber).padStart(4, '0');
        hotel_id = 'h' + newHotelNumberString;  
    }

    try{
        // Calculate total rooms
        let total_rooms = 0;
        if(req.body.room_types && req.body.room_types.length > 0){
            for(let i = 0; i < req.body.room_types.length; i++){
                total_rooms += req.body.room_types[i].count;
            }
        }

        const hotel = new Hotel({
            hotel_id: hotel_id,
            email: req.user.email,
            hotel_name: req.body.hotel_name,
            images: req.body.images,
            address: req.body.address,
            description: req.body.description,
            parking_available: req.body.parking_available,
            room_types: req.body.room_types,  // This handles the flexible room types
            total_rooms: total_rooms,
        })

        const addHotel = await hotel.save()
        res.status(201).json({
            success: true,
            message: "Hotel created successfully",
            hotel: addHotel
        })

    }catch(error){
        console.error("Error creating hotel:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating hotel",
            error: error.message
        });
    }
}

export async function approveHotel(req,res){
    if(!isAdmin(req)){
        return res.status(403).json({
            success: false,
            message : "unauthorized",
        });
        return
    }
    try{
        await Hotel.updateOne(
            {hotel_id : req.params.hotel_id},
            {status: "approved"}
        );
        res.status(200).json({
            success: true,
            message:"hotel approved successfully"
        });
    }catch(error){
        res.status(500).json({
        success: false,
        message:"error approving",
        error:error.message,
    });
}
}

export async function rejectHotel(req,res){
    if(!isAdmin(req)){
        return res.status(403).json({
            success: false,
            message : "unauthorized",
        });
        return
    }
    try{
        await Hotel.updateOne(
            {hotel_id : req.params.hotel_id},
            {status: "rejected"}
        );
        res.status(200).json({
            success: true,
            message:"hotel rejected successfully"
        });
    }catch(error){
        res.status(500).json({
        success: false,
        message:"error rejecting",
        error:error.message,
    });
}}

export async function getPendingHotels(req,res) {
    try{
        const pendingHotels = await Hotel.find({status: "pending"});
        res.json(pendingHotels);
    }catch(err){
        res.status(500).json({
            message: "Failed to get pending Hotels",
            error: err.message,
        })
    }
}