import express from 'express';
import { addHotel } from '../controllers/hotelcontroller.js';

const hotelRouter = express.Router();

hotelRouter.post('/addhotel', addHotel);

export default hotelRouter;