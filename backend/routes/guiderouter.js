import express from 'express';
import { addGuide, approveGuide, getApprovedGuides, getGuideAvailability, getGuideByEmail, getGuideById, getGuideStats, getGuidesWithoutDateFilter, getGuideUpcomingBookings, getPendingGuides, rejectGuide, searchGuides, searchGuidesAdvanced, updateGuide, view_all_guides } from '../controllers/guidecontroller.js';


const guideRouter = express.Router();

guideRouter.post('/addguide' , addGuide);

guideRouter.put("/approve_guide/:guide_id",approveGuide);
guideRouter.put("/reject_guide/:guide_id",rejectGuide);

guideRouter.get("/view_pending_guides",getPendingGuides);
guideRouter.get("/view_approved_guides",getApprovedGuides);

guideRouter.get("/view_all_guides",view_all_guides);

guideRouter.get("/view_guides_by_id/:guide_id",getGuideById);
guideRouter.get("/stats", getGuideStats);
guideRouter.get("/view_guides_by_email/:email",getGuideByEmail);
guideRouter.put("/update_guide/:guide_id",updateGuide);

guideRouter.get("/search", searchGuides);

// Advanced search with multiple filters and availability checking
guideRouter.get("/search-advanced", searchGuidesAdvanced);

// Browse guides without date filtering (for general browsing)
guideRouter.get("/browse", getGuidesWithoutDateFilter);

// Check specific guide availability for given dates
// Query params: guide_id, startDate, endDate
guideRouter.get("/availability", getGuideAvailability);

// Get guide's upcoming bookings (useful for guide dashboard)
guideRouter.get("/:guide_id/upcoming-bookings", getGuideUpcomingBookings);


export default guideRouter;