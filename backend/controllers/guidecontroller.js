import Guide from "../models/guide.js";
import { isAdmin } from "./usercontroller.js";

export async function addGuide(req, res) {
    let guide_id = "g0001";

    try {
        const lastGuide = await Guide.find().sort({ date: -1 }).limit(1);

        if (lastGuide.length > 0) {
            const lastGuideId = lastGuide[0].guide_id;
            const lastGuideNumberString = lastGuideId.replace('g', '');
            const lastGuideNumber = parseInt(lastGuideNumberString);
            const newGuideNumber = lastGuideNumber + 1;
            const newGuideNumberString = String(newGuideNumber).padStart(4, '0');
            guide_id = 'g' + newGuideNumberString;
        }

        // Validate contact number format
        const phoneRegex = /^\+94\d{9}$/;
        if (!phoneRegex.test(req.body.contact_number)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid Sri Lankan phone number (e.g., +94712345678)',
            });
        }

        const guide = new Guide({
            guide_id: guide_id,
            email: req.user.email,
            full_name: req.body.full_name,
            age: parseInt(req.body.age),
            gender: req.body.gender,
            years_of_experience: parseInt(req.body.years_of_experience),
            guide_license_no: req.body.guide_license_no,
            contact_number: req.body.contact_number,
            bio: req.body.bio,
            profile_image: req.body.profile_image,
            languages: req.body.languages,
            specialities: req.body.specialities,
            area_cover: req.body.area_cover,
            daily_rate: parseFloat(req.body.daily_rate),
            hourly_rate: parseFloat(req.body.hourly_rate),
        });

        const addGuide = await guide.save();

        res.status(201).json({
            success: true,
            message: "Guide added successfully",
            guide: addGuide
        });

    } catch (error) {
        console.error("Error creating Guide:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }
        return res.status(500).json({
            success: false,
            message: "Error creating guide",
            error: error.message
        });
    }
}
export async function approveGuide(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        await Guide.updateOne(
            { guide_id: req.params.guide_id },
            { status: "approved" }
        );
        res.status(200).json({
            success: true,
            message: "Guide approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error approving guide",
            error: error.message,
        });
    }
}
export async function rejectGuide(req, res) {
    if (!isAdmin(req)) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
    }
    try {
        await Guide.updateOne(
            { guide_id: req.params.guide_id },
            { status: "rejected" }
        );
        res.status(200).json({
            success: true,
            message: "Guide rejected successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error rejecting guide",
            error: error.message,
        });
    }
}
export async function getPendingGuides(req, res) {
    try {
        const pendingGuides = await Guide.find({ status: "pending" });
        res.json(pendingGuides);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get pending guides",
            error: err.message,
        });
    }
}
export async function view_all_guides(req, res) {
    try {
        const viewGuides = await Guide.find();
        res.json(viewGuides);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get guides",
            error: err.message,
        });
    }
}
export async function getGuideById(req, res) {
    try {
        const guide_id = req.params.guide_id;

        const guide = await Guide.findOne({ guide_id: guide_id });

        res.json(guide);
    } catch (error) {
        res.status(500).json({
            error,
        })
    }
}
export async function getGuideStats(req, res) {
    try {
        const stats = await Guide.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const result = { pending: 0, approved: 0, rejected: 0 };
        
        stats.forEach(stat => {
            if (result.hasOwnProperty(stat._id)) {
                result[stat._id] = stat.count;
            }
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching guide stats",
            error: error.message
        });
    }
}