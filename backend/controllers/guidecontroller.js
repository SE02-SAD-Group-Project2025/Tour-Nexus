import Guide from "../models/guide.js";
import GuideBooking from "../models/guideBooking.js";
import { isAdmin, isBlocked } from "./usercontroller.js";

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

        if(isBlocked(req)){
            return res.status(403).json({
                success: false,
                message: "You are blocked from creating a guide profile"
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
                message: "You Already have Profile",
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

export async function getApprovedGuides(req, res) {
    try {
        const approvedGuides = await Guide.find({ status: "approved" });
        res.json(approvedGuides);
    } catch (err) {
        res.status(500).json({
            message: "Failed to get approved guides",
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

// Helper function to check if a guide is available for given dates
async function checkGuideAvailability(guide_id, startDate, endDate) {
    try {
        // Convert dates to proper Date objects
        const checkInDate = new Date(startDate);
        const checkOutDate = new Date(endDate);
        
        // Check for conflicting bookings
        const conflictingBooking = await GuideBooking.findOne({
            guide_id: guide_id,
            booking_status: { $in: ['requested', 'confirmed'] },
            $or: [
                {
                    // Existing booking starts before new checkout and ends after new checkin
                    check_in_date: { $lt: checkOutDate },
                    check_out_date: { $gt: checkInDate }
                }
            ]
        });

        return !conflictingBooking; // Return true if no conflicts found
    } catch (error) {
        console.error('Error checking guide availability:', error);
        return false; // Default to unavailable if there's an error
    }
}

// Enhanced search function with availability checking
export async function searchGuides(req, res) {
    try {
        const { language, startDate, endDate, page = 1, limit = 20 } = req.query;
        
        // Validate required date parameters
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required for availability checking"
            });
        }

        // Validate date format and logic
        const checkInDate = new Date(startDate);
        const checkOutDate = new Date(endDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date format. Use YYYY-MM-DD format"
            });
        }

        if (checkInDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "Start date cannot be in the past"
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "End date must be after start date"
            });
        }
        
        // Base criteria - only approved guides
        let searchCriteria = { status: "approved" };
        
        // Search for guides who speak the specified language
        if (language && language.trim() !== '') {
            const searchLanguage = language.trim();
            
            // Case-insensitive exact match in languages array
            searchCriteria.languages = { 
                $elemMatch: { 
                    $regex: new RegExp(`^${searchLanguage}$`, 'i') 
                } 
            };
        }
        
        // First, get all guides matching the basic criteria
        const allMatchingGuides = await Guide.find(searchCriteria)
            .sort({ daily_rate: 1 }); // Sort by price, lowest first
        
        console.log(`Found ${allMatchingGuides.length} guides matching criteria before availability check`);
        
        // Filter guides based on availability
        const availableGuides = [];
        
        for (const guide of allMatchingGuides) {
            const isAvailable = await checkGuideAvailability(guide.guide_id, startDate, endDate);
            if (isAvailable) {
                availableGuides.push({
                    ...guide.toObject(),
                    availability_status: 'available'
                });
            } else {
                console.log(`Guide ${guide.guide_id} (${guide.full_name}) is not available for ${startDate} to ${endDate}`);
            }
        }
        
        console.log(`Found ${availableGuides.length} available guides after availability check`);
        
        // Apply pagination to available guides
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const paginatedGuides = availableGuides.slice(skip, skip + limitNum);
        
        res.status(200).json({
            success: true,
            data: paginatedGuides,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(availableGuides.length / limitNum),
                totalAvailableGuides: availableGuides.length,
                totalMatchingGuides: allMatchingGuides.length,
                limit: limitNum
            },
            searchCriteria: {
                language: language || null,
                startDate: startDate,
                endDate: endDate
            },
            message: `Found ${availableGuides.length} available guides who speak ${language || 'any language'} for ${startDate} to ${endDate}`
        });
        
    } catch (error) {
        console.error("Error searching guides:", error);
        res.status(500).json({
            success: false,
            message: "Error searching guides",
            error: error.message
        });
    }
}

// Alternative function for getting guides without date filtering (for general browsing)
export async function getGuidesWithoutDateFilter(req, res) {
    try {
        const { language, page = 1, limit = 20 } = req.query;
        
        // Base criteria - only approved guides
        let searchCriteria = { status: "approved" };
        
        // Search for guides who speak the specified language
        if (language && language.trim() !== '') {
            const searchLanguage = language.trim();
            searchCriteria.languages = { 
                $elemMatch: { 
                    $regex: new RegExp(`^${searchLanguage}$`, 'i') 
                } 
            };
        }
        
        // Calculate pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        
        // Execute search with pagination
        const guides = await Guide.find(searchCriteria)
            .skip(skip)
            .limit(limitNum)
            .sort({ daily_rate: 1 });
        
        // Get total count
        const totalGuides = await Guide.countDocuments(searchCriteria);
        
        res.status(200).json({
            success: true,
            data: guides.map(guide => ({
                ...guide.toObject(),
                availability_status: 'unknown' // Since no dates provided
            })),
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalGuides / limitNum),
                totalGuides: totalGuides,
                limit: limitNum
            },
            message: `Found ${guides.length} guides who speak ${language || 'any language'}`
        });
        
    } catch (error) {
        console.error("Error getting guides:", error);
        res.status(500).json({
            success: false,
            message: "Error getting guides",
            error: error.message
        });
    }
}

// ADVANCED: Enhanced search function with more detailed filtering and availability
export async function searchGuidesAdvanced(req, res) {
    try {
        const {
            destination,
            startDate,
            endDate,
            groupSize,
            minRate,
            maxRate,
            experience,
            languages,
            page = 1,
            limit = 20
        } = req.query;

        // Validate required date parameters for availability checking
        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required for availability checking"
            });
        }

        // Build search criteria
        let searchCriteria = { status: "approved" };
        let orConditions = [];

        // Search by destination
        if (destination && destination.trim() !== '') {
            const destinationRegex = new RegExp(destination.trim(), 'i');
            orConditions.push(
                { area_cover: { $elemMatch: { $regex: destinationRegex } } },
                { specialities: { $elemMatch: { $regex: destinationRegex } } },
                { bio: { $regex: destinationRegex } }
            );
        }

        if (orConditions.length > 0) {
            searchCriteria.$or = orConditions;
        }

        // Filter by daily rate range
        if (minRate || maxRate) {
            const rateFilter = {};
            if (minRate) rateFilter.$gte = parseFloat(minRate);
            if (maxRate) rateFilter.$lte = parseFloat(maxRate);
            searchCriteria.daily_rate = rateFilter;
        }

        // Filter by minimum years of experience
        if (experience) {
            searchCriteria.years_of_experience = { $gte: parseInt(experience) };
        }

        // Filter by languages
        if (languages) {
            const languageList = languages.split(',').map(lang => lang.trim());
            searchCriteria.languages = { 
                $elemMatch: { 
                    $in: languageList.map(lang => new RegExp(lang, 'i')) 
                } 
            };
        }

        // Get all guides matching the criteria
        const allMatchingGuides = await Guide.find(searchCriteria)
            .sort({ daily_rate: 1 });

        // Filter guides based on availability
        const availableGuides = [];
        
        for (const guide of allMatchingGuides) {
            const isAvailable = await checkGuideAvailability(guide.guide_id, startDate, endDate);
            if (isAvailable) {
                availableGuides.push({
                    ...guide.toObject(),
                    availability_status: 'available'
                });
            }
        }

        // Apply pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const paginatedGuides = availableGuides.slice(skip, skip + limitNum);

        res.status(200).json({
            success: true,
            data: paginatedGuides,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(availableGuides.length / limitNum),
                totalAvailableGuides: availableGuides.length,
                totalMatchingGuides: allMatchingGuides.length,
                limit: limitNum
            },
            searchCriteria: {
                destination: destination || null,
                startDate: startDate,
                endDate: endDate,
                groupSize: groupSize || null,
                minRate: minRate || null,
                maxRate: maxRate || null,
                experience: experience || null,
                languages: languages || null
            }
        });

    } catch (error) {
        console.error("Error searching guides:", error);
        res.status(500).json({
            success: false,
            message: "Error searching guides",
            error: error.message
        });
    }
}

// Function to get guide availability for specific dates (useful for frontend)
export async function getGuideAvailability(req, res) {
    try {
        const { guide_id, startDate, endDate } = req.query;

        if (!guide_id || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: "Guide ID, start date, and end date are required"
            });
        }

        // Check if guide exists
        const guide = await Guide.findOne({ guide_id: guide_id, status: "approved" });
        if (!guide) {
            return res.status(404).json({
                success: false,
                message: "Guide not found or not approved"
            });
        }

        // Check availability
        const isAvailable = await checkGuideAvailability(guide_id, startDate, endDate);

        // Get conflicting bookings for more details
        const conflictingBookings = await GuideBooking.find({
            guide_id: guide_id,
            booking_status: { $in: ['requested', 'confirmed'] },
            $or: [
                {
                    check_in_date: { $lt: new Date(endDate) },
                    check_out_date: { $gt: new Date(startDate) }
                }
            ]
        }).select('guide_booking_id check_in_date check_out_date booking_status');

        res.status(200).json({
            success: true,
            guide_id: guide_id,
            guide_name: guide.full_name,
            is_available: isAvailable,
            requested_period: {
                start_date: startDate,
                end_date: endDate
            },
            conflicting_bookings: conflictingBookings
        });

    } catch (error) {
        console.error("Error checking guide availability:", error);
        res.status(500).json({
            success: false,
            message: "Error checking guide availability",
            error: error.message
        });
    }
}

export async function getGuideByEmail(req, res) {
    const email = req.params.email;

    try {
        const guides = await Guide.find({ email: email });

        res.status(200).json({
            success: true,
            data: guides,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching Guide",
            error: error.message,
        });
    }
}

export async function updateGuide(req, res) {
    try{
        // Update the guide
        await Guide.updateOne({guide_id:req.params.guide_id},req.body);
        res.status(200).json({
            success: true,
            message: "Guide updated successfully",
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Error updating guide",
        });
    }
}

// Function to get guide's upcoming bookings (useful for guide dashboard)
export async function getGuideUpcomingBookings(req, res) {
    try {
        const { guide_id } = req.params;
        const currentDate = new Date();

        const upcomingBookings = await GuideBooking.find({
            guide_id: guide_id,
            booking_status: { $in: ['requested', 'confirmed'] },
            check_in_date: { $gte: currentDate }
        }).sort({ check_in_date: 1 });

        res.status(200).json({
            success: true,
            data: upcomingBookings,
            count: upcomingBookings.length
        });

    } catch (error) {
        console.error("Error fetching guide bookings:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching guide bookings",
            error: error.message
        });
    }
}