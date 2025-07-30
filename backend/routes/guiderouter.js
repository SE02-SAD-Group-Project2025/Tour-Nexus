import express from 'express';
import { addGuide, approveGuide, getApprovedGuides, getPendingGuides, rejectGuide, view_all_guides } from '../controllers/guidecontroller.js';


const guideRouter = express.Router();

guideRouter.post('/addguide' , addGuide);




export default guideRouter;