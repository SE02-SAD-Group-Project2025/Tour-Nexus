import express from 'express';
import { addGuide, approveGuide, getApprovedGuides, getPendingGuides, rejectGuide, view_all_guides } from '../controllers/guidecontroller.js';


const guideRouter = express.Router();

guideRouter.post('/addguide' , addGuide);
guideRouter.put("/approve_guide/:guide_id",approveGuide);
guideRouter.put("/reject_guide/:guide_id",rejectGuide);
guideRouter.get("/view_pending_guides",getPendingGuides);



export default guideRouter;