import { useState, useEffect } from "react";
import {
  Globe,
  Bell,
  User,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Navigation,
  Activity,
  MessageCircle,
  Edit,
  Plus,
  BarChart3,
  Users,
  Star,
  Menu,
  X,
  ChevronDown,
  Award,
  Trash2,
  Home,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Upload,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload";
import EnhancedGuideTours from "./guide_tour_section";

function GuideDashboard() {
  const [tours, setTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // const [profile, setProfile] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [showTourDetails, setShowTourDetails] = useState(false);

  const userEmail = localStorage.getItem("email");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  // State for Guide Journey
  const [guideData, setGuideData] = useState(null);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [guideFormData, setGuideFormData] = useState({
    full_name: "",
    age: "",
    gender: "",
    years_of_experience: "",
    guide_license_no: "",
    contact_number: "",
    bio: "",
    profile_image: null,
    languages: [],
    specialities: [],
    area_cover: [],
    daily_rate: "",
    hourly_rate: "",
  });

  const languageOptions = [
    "English",
    "Sinhala",
    "Tamil",
    "German",
    "French",
    "Spanish",
    "Italian",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Hindi",
  ];

  const specialtyOptions = [
    "Cultural Tours",
    "Wildlife Safari",
    "Adventure Tours",
    "Historical Sites",
    "Beach Tours",
    "Mountain Trekking",
    "Tea Plantation Tours",
    "Photography Tours",
    "Bird Watching",
    "Food Tours",
    "Temple Tours",
    "Nature Walks",
  ];

  const areaOptions = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Sigiriya",
    "Dambulla",
    "Anuradhapura",
    "Polonnaruwa",
    "Yala",
    "Udawalawe",
    "Mirissa",
    "Unawatuna",
    "Bentota",
    "Negombo",
    "Trincomalee",
  ];

  useEffect(() => {
    if (guideData) {
      setGuideFormData({
        full_name: guideData.full_name || "",
        age: guideData.age || "",
        gender: guideData.gender || "",
        years_of_experience: guideData.years_of_experience || "",
        guide_license_no: guideData.guide_license_no || "",
        contact_number: guideData.contact_number
          ? guideData.contact_number.replace("+94", "")
          : "",
        bio: guideData.bio || "",
        profile_image: guideData.profile_image
          ? { preview: guideData.profile_image }
          : null,
        languages: guideData.languages || [],
        specialities: guideData.specialities || [],
        area_cover: guideData.area_cover || [],
        daily_rate: guideData.daily_rate || "",
        hourly_rate: guideData.hourly_rate || "",
      });
    }
  }, [guideData]);

  const handleGuideFormChange = (e) => {
    setGuideFormData({ ...guideFormData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const imageObject = {
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    };

    setGuideFormData({ ...guideFormData, profile_image: imageObject });
  };

  const removeImage = () => {
    if (guideFormData.profile_image) {
      URL.revokeObjectURL(guideFormData.profile_image.preview);
    }
    setGuideFormData({ ...guideFormData, profile_image: null });
  };

  const handleLanguageChange = (language) => {
    setGuideFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSpecialtyChange = (specialty) => {
    setGuideFormData((prev) => ({
      ...prev,
      specialities: prev.specialities.includes(specialty)
        ? prev.specialities.filter((s) => s !== specialty)
        : [...prev.specialities, specialty],
    }));
  };

  const handleAreaChange = (area) => {
    setGuideFormData((prev) => ({
      ...prev,
      area_cover: prev.area_cover.includes(area)
        ? prev.area_cover.filter((a) => a !== area)
        : [...prev.area_cover, area],
    }));
  };

  const validateGuideForm = () => {
    if (!guideFormData.full_name.trim()) {
      toast.error("Full name is required");
      return false;
    }

    if (
      !guideFormData.age ||
      guideFormData.age < 18 ||
      guideFormData.age > 80
    ) {
      toast.error("Age must be between 18 and 80");
      return false;
    }

    if (!guideFormData.gender) {
      toast.error("Please select your gender");
      return false;
    }

    if (
      !guideFormData.years_of_experience ||
      guideFormData.years_of_experience < 0
    ) {
      toast.error("Years of experience is required");
      return false;
    }

    if (!guideFormData.guide_license_no.trim()) {
      toast.error("Guide license number is required");
      return false;
    }

    if (!guideFormData.contact_number) {
      toast.error("Contact number is required");
      return false;
    }

    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(guideFormData.contact_number)) {
      toast.error(
        "Please provide a valid 9-digit phone number (e.g., 0712345678)"
      );
      return false;
    }

    if (!guideFormData.bio.trim()) {
      toast.error("Bio is required");
      return false;
    }

    if (guideFormData.bio.trim().length < 50) {
      toast.error("Bio must be at least 50 characters long");
      return false;
    }

    if (guideFormData.languages.length === 0) {
      toast.error("Please select at least one language");
      return false;
    }

    if (guideFormData.specialities.length === 0) {
      toast.error("Please select at least one specialty");
      return false;
    }

    if (guideFormData.area_cover.length === 0) {
      toast.error("Please select at least one area you cover");
      return false;
    }

    if (!guideFormData.daily_rate || guideFormData.daily_rate <= 0) {
      toast.error("Daily rate must be greater than 0");
      return false;
    }

    if (!guideFormData.hourly_rate || guideFormData.hourly_rate <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return false;
    }

    return true;
  };

  const sidebarItems = [
    { name: "Dashboard", icon: Activity, emoji: "📊" },
    { name: "My Tours", icon: Navigation, emoji: "🗺️" },
    { name: "Profile", icon: Users, emoji: "👥" },
    // { name: "Reviews", icon: Star, emoji: "⭐" },
    // { name: "Earnings", icon: DollarSign, emoji: "💰" },
    // { name: "Messages", icon: MessageCircle, emoji: "💬" },
    // { name: "Settings", icon: Settings, emoji: "⚙️" },
    { name: "Logout", icon: LogOut, emoji: "🚪" },
  ];

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCloseViews = () => {
    setShowTourDetails(false);
    setSelectedTour(null);
  };

  const fetchGuideDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/guide/view_guides_by_email/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success && response.data.data.length > 0) {
        setGuideData(response.data.data[0]);
        toast.success("Guide details loaded successfully");
      } else {
        setError("No guide details found");
        toast.error("No guide details found");
      }
    } catch (error) {
      console.error("Error fetching guide details:", error);
      let errorMessage = "Failed to fetch guide details";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail && activeMenuItem === "Profile") {
      fetchGuideDetails();
    }
  }, [userEmail, activeMenuItem]);

  // Mock data for tours - replace with actual API calls
  const fetchToursByGuide = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mock data - replace with actual API call
      const mockTours = [
        {
          id: 1,
          tour_id: "t001",
          title: "Colombo City Heritage Tour",
          tourist_name: "John Smith",
          tourist_country: "USA",
          location: "Colombo",
          group_size: 4,
          amount: "LKR 25,000",
          date: "2024-08-15",
          status: "Confirmed",
          description: "Explore the rich history and culture of Colombo",
        },
        {
          id: 2,
          tour_id: "t002",
          title: "Kandy Temple & Garden Tour",
          tourist_name: "Emma Wilson",
          tourist_country: "UK",
          location: "Kandy",
          group_size: 2,
          amount: "LKR 18,000",
          date: "2024-08-20",
          status: "Pending",
          description:
            "Visit the sacred Temple of the Tooth and beautiful gardens",
        },
      ];

      setTours(mockTours);
      toast.success(
        `Successfully loaded ${mockTours.length} tour${
          mockTours.length !== 1 ? "s" : ""
        }`
      );
    } catch (error) {
      console.error("Error fetching tours:", error);
      setError("Failed to fetch tours");
      toast.error("Failed to fetch tours");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchToursByGuide();
    } else {
      setError("User email not found. Please log in again.");
      setIsLoading(false);
    }
  }, [userEmail]);

  const handleViewTourDetails = (tour_id, tour_title) => {
    const tour = tours.find((t) => t.tour_id === tour_id);
    if (tour) {
      setSelectedTour(tour);
      setShowTourDetails(true);
    } else {
      toast.error(`Tour details not found for "${tour_title}"`);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    handleCloseViews();

    if (itemName === "My Tours") {
      fetchToursByGuide();
    } else if (itemName === "Logout") {
      handleLogout();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // const moveToAccount = (accountType) => {
  //     toast.info(`Switching to ${accountType} account...`);
  //     setShowDropdown(false);
  // };

  const moveToTourist = () => {
    // toast.info(`Switching to ${accountType} account...`);
    if (window.confirm("Are you sure switch to Tourist?")) {
      navigate("/tourist/dashboard");
      setShowDropdown(false);
    }
  };

  const moveToHotelOwner = () => {
    // toast.info(`Switching to ${accountType} account...`);
    if (window.confirm("Are you sure switch as HotelOwner?")) {
      navigate("/hotelowner/dashboard");
      setShowDropdown(false);
    }
  };

  // Calculate stats
  const calculateStats = () => {
    if (!Array.isArray(tours) || tours.length === 0) {
      return {
        totalTours: 0,
        activeTours: 0,
        completedTours: 0,
        monthlyEarnings: 0,
        avgRating: 0,
        confirmedTours: 0,
        pendingTours: 0,
        cancelledTours: 0,
      };
    }
    const activeTours = tours.filter(
      (tour) => tour.status === "confirmed"
    ).length;
    const completedTours = tours.filter(
      (tour) => tour.status === "completed"
    ).length;
    const confirmedTours = tours.filter(
      (tour) => tour.status === "confirmed"
    ).length;
    const pendingTours = tours.filter(
      (tour) => tour.status === "pending"
    ).length;
    const cancelledTours = tours.filter(
      (tour) => tour.status === "cancelled"
    ).length;

    const monthlyEarnings = tours.reduce((sum, tour) => {
      const amount = parseInt(tour.amount.replace(/[^\d]/g, "")) || 0;
      return sum + amount;
    }, 0);
    return {
      totalTours: tours.length,
      activeTours,
      completedTours,
      monthlyEarnings,
      avgRating: 4.8, // Mock rating
      confirmedTours,
      pendingTours,
      cancelledTours,
    };
  };

  const stats = calculateStats();

  // Loading State Component
  const LoadingState = () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading your data...</p>
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "10px",
        }}
      >
        Please wait while we fetch your data
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="error-state">
      <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
      <h3>Unable to Load Data</h3>
      <p>{error}</p>
      <div
        style={{
          display: "flex",
          gap: "15px",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <button className="btn btn-secondary" onClick={() => setError(null)}>
          Dismiss
        </button>
      </div>
    </div>
  );

  // Tour Card Component
  const TourCard = ({ tour }) => (
    <div key={tour.tour_id} className="tour-card">
      <div className="tour-image">
        <div className="image-placeholder">
          <Navigation className="w-12 h-12 text-gray-400" />
        </div>

        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "10px",
            fontWeight: "600",
            textTransform: "uppercase",
            backgroundColor:
              tour.status === "confirmed"
                ? "rgba(34, 197, 94, 0.9)"
                : tour.status === "pending"
                ? "rgba(251, 191, 36, 0.9)"
                : tour.status === "completed"
                ? "rgba(59, 130, 246, 0.9)"
                : "rgba(239, 68, 68, 0.9)",
            color: "white",
            backdropFilter: "blur(4px)",
          }}
        >
          {tour.status}
        </div>
      </div>

      <div className="tour-info">
        <div className="tour-header">
          <h3 title={tour.title}>{tour.title}</h3>
          <span className={`status-badge ${getStatusColor(tour.status)}`}>
            {tour.status}
          </span>
        </div>

        <div className="tour-details">
          <div className="detail-item">
            <Users className="w-4 h-4 mr-2" />
            <span>
              {tour.tourist_name} ({tour.tourist_country})
            </span>
          </div>
          <div className="detail-item">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{tour.location}</span>
          </div>
          <div className="detail-item">
            <span className="tour-id">ID: {tour.tour_id}</span>
          </div>
          <div className="detail-item">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Date: {tour.date}</span>
          </div>
        </div>
        {tour.description && (
          <p className="tour-description" title={tour.description}>
            {tour.description.length > 100
              ? tour.description.substring(0, 100) + "..."
              : tour.description}
          </p>
        )}
        <div className="contact-info">
          <div className="detail-item">
            <span>👥 {tour.group_size} people</span>
          </div>
          <div className="detail-item">
            <span>💰 {tour.amount}</span>
          </div>
        </div>
        <div className="tour-actions">
          <button
            className="action-btn primary"
            onClick={() => handleViewTourDetails(tour.tour_id, tour.title)}
            title={`View details for ${tour.title}`}
          >
            View Details
          </button>
          <button
            className="action-btn secondary"
            title={`Message ${tour.tourist_name}`}
          >
            <MessageCircle className="w-4 h-4" />
          </button>
          <button className="action-btn danger" title={`Cancel ${tour.title}`}>
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Guide Journey Component
  const GuideJourney = () => {
    const handleGuideSave = async () => {
      if (!validateGuideForm()) return;

      try {
        setIsLoading(true);
        let profileImageUrl = guideFormData.profile_image?.preview || "";
        if (guideFormData.profile_image?.file) {
          toast.loading("Uploading profile image...");
          try {
            profileImageUrl = await mediaUpload(
              guideFormData.profile_image.file
            );
            toast.dismiss();
            toast.success("Profile image uploaded successfully");
          } catch (uploadError) {
            toast.dismiss();
            const continueWithoutImage = window.confirm(
              "Failed to upload profile image. Would you like to continue without changing the profile image?"
            );
            if (!continueWithoutImage) {
              setIsLoading(false);
              return;
            }
            profileImageUrl = guideData.profile_image || "";
            toast.info("Continuing with existing or no profile image");
          }
        }

        const updatedGuideData = {
          full_name: guideFormData.full_name.trim(),
          age: parseInt(guideFormData.age),
          gender: guideFormData.gender,
          years_of_experience: parseInt(guideFormData.years_of_experience),
          guide_license_no: guideFormData.guide_license_no.trim(),
          contact_number: `+94${guideFormData.contact_number}`,
          bio: guideFormData.bio.trim(),
          profile_image: profileImageUrl,
          languages: guideFormData.languages,
          specialities: guideFormData.specialities,
          area_cover: guideFormData.area_cover,
          daily_rate: parseFloat(guideFormData.daily_rate),
          hourly_rate: parseFloat(guideFormData.hourly_rate),
        };

        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/guide/update_guide/${
            guideData.guide_id
          }`,
          updatedGuideData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          fetchGuideDetails();
          setIsEditingGuide(false);
          toast.success("Guide details updated successfully");
        } else {
          toast.error(response.data.message || "Update failed");
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Server error");
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="profile-page">
        <div className="page-header">
          <div>
            <h1>Update Your Profile Here</h1>
            <p>View and update your guide registration details</p>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-secondary"
              onClick={fetchGuideDetails}
              disabled={isLoading}
            >
              {isLoading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
        {isLoading && <LoadingState />}
        {error && !isLoading && <ErrorState />}
        {!isLoading && !error && guideData && (
          <div className="profile-content">
            <div className="profile-card">
              <h2>Guide Information</h2>
              <div className="profile-details">
                <div className="profile-item">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={guideFormData.full_name}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="profile-item">
                  <label>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={guideFormData.age}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="18"
                    max="80"
                  />
                </div>
                <div className="profile-item">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={guideFormData.gender}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="profile-item">
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    name="years_of_experience"
                    value={guideFormData.years_of_experience}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    min="0"
                  />
                </div>
                <div className="profile-item">
                  <label>Guide License Number</label>
                  <input
                    type="text"
                    name="guide_license_no"
                    value={guideFormData.guide_license_no}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="profile-item">
                  <label>Contact Number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      +94
                    </span>
                    <input
                      type="text"
                      name="contact_number"
                      value={guideFormData.contact_number}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, "");
                        if (value.length <= 9) {
                          setGuideFormData({
                            ...guideFormData,
                            contact_number: value,
                          });
                        }
                      }}
                      disabled={!isEditingGuide}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md"
                      maxLength={9}
                    />
                  </div>
                </div>
                <div className="profile-item">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={guideFormData.bio}
                    onChange={handleGuideFormChange}
                    disabled={!isEditingGuide}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {guideFormData.bio.length}/50 characters minimum
                  </div>
                </div>
                <div className="profile-item">
                  <label>Profile Image</label>
                  {isEditingGuide ? (
                    <div className="space-y-4">
                      <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center">
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <span className="text-sm font-medium text-gray-600">
                            Click to upload profile image
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            PNG, JPG, WebP up to 10MB
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                        />
                      </label>
                      {guideFormData.profile_image && (
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <img
                              src={guideFormData.profile_image.preview}
                              alt="Profile preview"
                              className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          {guideFormData.profile_image.file && (
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-700">
                                {guideFormData.profile_image.file.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {(
                                  guideFormData.profile_image.file.size /
                                  1024 /
                                  1024
                                ).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      {guideFormData.profile_image ? (
                        <img
                          src={guideFormData.profile_image.preview}
                          alt="Profile"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <p className="text-gray-500">No profile image</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="profile-item">
                  <label>Languages</label>
                  {isEditingGuide ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {languageOptions.map((language) => (
                        <label
                          key={language}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={guideFormData.languages.includes(language)}
                            onChange={() => handleLanguageChange(language)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {language}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      {guideFormData.languages.join(", ") || "None"}
                    </p>
                  )}
                </div>
                <div className="profile-item">
                  <label>Specialties</label>
                  {isEditingGuide ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {specialtyOptions.map((specialty) => (
                        <label
                          key={specialty}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={guideFormData.specialities.includes(
                              specialty
                            )}
                            onChange={() => handleSpecialtyChange(specialty)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {specialty}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      {guideFormData.specialities.join(", ") || "None"}
                    </p>
                  )}
                </div>
                <div className="profile-item">
                  <label>Area Cover</label>
                  {isEditingGuide ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {areaOptions.map((area) => (
                        <label
                          key={area}
                          className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={guideFormData.area_cover.includes(area)}
                            onChange={() => handleAreaChange(area)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {area}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">
                      {guideFormData.area_cover.join(", ") || "None"}
                    </p>
                  )}
                </div>
                <div className="profile-item">
                  <label>Daily Rate (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="daily_rate"
                      value={guideFormData.daily_rate}
                      onChange={handleGuideFormChange}
                      disabled={!isEditingGuide}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="profile-item">
                  <label>Hourly Rate (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      name="hourly_rate"
                      value={guideFormData.hourly_rate}
                      onChange={handleGuideFormChange}
                      disabled={!isEditingGuide}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
              <div className="profile-actions">
                {!isEditingGuide ? (
                  <button
                    className="action-btn primary"
                    onClick={() => setIsEditingGuide(true)}
                  >
                    Edit Guide Details
                  </button>
                ) : (
                  <>
                    <button
                      className="action-btn primary"
                      onClick={handleGuideSave}
                      disabled={isLoading}
                    >
                      Save Changes
                    </button>
                    <button
                      className="action-btn secondary"
                      onClick={() => {
                        setGuideFormData({
                          full_name: guideData.full_name || "",
                          age: guideData.age || "",
                          gender: guideData.gender || "",
                          years_of_experience:
                            guideData.years_of_experience || "",
                          guide_license_no: guideData.guide_license_no || "",
                          contact_number: guideData.contact_number
                            ? guideData.contact_number.replace("+94", "")
                            : "",
                          bio: guideData.bio || "",
                          profile_image: guideData.profile_image
                            ? { preview: guideData.profile_image }
                            : null,
                          languages: guideData.languages || [],
                          specialities: guideData.specialities || [],
                          area_cover: guideData.area_cover || [],
                          daily_rate: guideData.daily_rate || "",
                          hourly_rate: guideData.hourly_rate || "",
                        });
                        setIsEditingGuide(false);
                      }}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Content rendering function
  const renderContent = () => {
    if (activeMenuItem === "Dashboard") {
      return (
        <>
          <div className="welcome-section">
            <h1>Welcome back, Tour Guide!</h1>
            <p>
              Share Sri Lanka's wonders with travelers from around the world
            </p>

            <div className="action-buttons">
              <button className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center">
                <User className="w-5 h-5 mr-2" />
                <Link to="/guide/addguide" className="text-emerald-600">
                  Start As Guide
                </Link>
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleMenuItemClick("My Tours")}
              >
                View My Tours
              </button>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="number">{stats.totalTours}</div>
              <div className="label">Total Tours</div>
              <div className="change positive">
                {stats.confirmedTours} Confirmed
              </div>
            </div>

            <div className="stat-card">
              <div className="number">{stats.activeTours}</div>
              <div className="label">Active Tours</div>
              <div className="change positive">Currently guiding</div>
            </div>

            <div className="stat-card">
              <div className="number">{stats.avgRating}</div>
              <div className="label">Average Rating</div>
              <div className="change">⭐ Star rating</div>
            </div>

            <div className="stat-card">
              <div className="number">
                LKR {stats.monthlyEarnings.toLocaleString()}
              </div>
              <div className="label">Monthly Earnings</div>
              <div className="change positive">This month</div>
            </div>
          </div>
          <div className="quick-actions">
            <h2>Quick Actions</h2>

            <div className="actions-grid">
              <div
                className="action-card"
                onClick={() => handleMenuItemClick("My Tours")}
              >
                <h3>🗺️ Manage Tours ({stats.totalTours})</h3>
                <p>View and manage your tours</p>
                {stats.pendingTours > 0 && (
                  <div
                    style={{
                      color: "#f59e0b",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {stats.pendingTours} pending confirmation
                  </div>
                )}
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Profile")}
              >
                <h3>👥 Guide Journey</h3>
                <p>Review new booking requests and update guide details</p>
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Reviews")}
              >
                <h3>⭐ Reviews & Ratings</h3>
                <p>View customer feedback</p>
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Earnings")}
              >
                <h3>💰 Earnings</h3>
                <p>Track your income</p>
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Messages")}
              >
                <h3>💬 Messages</h3>
                <p>Chat with tourists</p>
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Settings")}
              >
                <h3>⚙️ Settings</h3>
                <p>Account preferences</p>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (activeMenuItem === "My Tours") {
      return <EnhancedGuideTours />;
    }

    if (activeMenuItem === "Profile") {
      return <GuideJourney />;
    }

    return (
      <div>
        <h1>{activeMenuItem}</h1>
        <p>Content for {activeMenuItem} coming soon...</p>

        <div className="placeholder-content">
          <div className="placeholder-card">
            <h3>Feature Under Development</h3>
            <p>
              This section is currently being developed. Check back soon for
              updates!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => handleMenuItemClick("Dashboard")}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="logo">Guide Dashboard</div>
        <div className="search-bar">
          <input type="text" placeholder="Search tours..." />
        </div>
        <div className="user-section">
          <Bell className="w-5 h-5" />
          <div className="user-profile" onClick={toggleDropdown}>
            <User className="w-5 h-5" />
            <span>{userEmail || "Guide"}</span>
            <ChevronDown className="w-4 h-4" />
            {showDropdown && (
              <div className="dropdown-menu show">
                <div className="dropdown-header">{userEmail}</div>
                <div
                  className="dropdown-item"
                  onClick={() => handleMenuItemClick("Profile")}
                >
                  Profile
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => moveToHotelOwner("HotelOwner")}
                >
                  Switch to Hotel Owner
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => moveToTourist("Tourist")}
                >
                  Switch to Tourist
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="sidebar">
        {sidebarItems.map((item) => (
          <div
            key={item.name}
            className={`sidebar-item ${
              activeMenuItem === item.name ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick(item.name)}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      <main className="main-content">{renderContent()}</main>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: Arial, sans-serif;
          background-color: #f5f5f5;
          color: #333;
        }

        .main-container {
          display: flex;
          min-height: 100vh;
        }

        .header {
          background: white;
          padding: 15px 20px;
          border-bottom: 1px solid #ddd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
        }

        .logo {
          font-size: 20px;
          font-weight: bold;
          color: #10b981;
        }

        .search-bar {
          flex: 1;
          max-width: 400px;
          margin: 0 20px;
        }

        .search-bar input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 25px;
          background-color: #f8f9fa;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          position: relative;
        }

        .user-profile:hover {
          background-color: #f8f9fa;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #ddd;
          border-top: none;
          min-width: 200px;
          z-index: 1000;
          display: none;
        }

        .dropdown-menu.show {
          display: block;
        }

        .dropdown-header {
          padding: 12px 16px;
          font-weight: bold;
          border-bottom: 1px solid #eee;
          color: #333;
          background-color: #f8f9fa;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .sidebar {
          width: 250px;
          background: white;
          border-right: 1px solid #ddd;
          margin-top: 70px;
          position: fixed;
          height: calc(100vh - 70px);
          overflow-y: auto;
        }

        .sidebar-item {
          padding: 15px 20px;
          border-bottom: 1px solid #f0f0f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sidebar-item:hover {
          background-color: #f8f9fa;
        }

        .sidebar-item.active {
          background-color: #10b981;
          color: white;
        }

        .main-content {
          flex: 1;
          margin-left: 250px;
          margin-top: 70px;
          padding: 30px;
        }

        .welcome-section {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 40px;
          margin-bottom: 30px;
          border-radius: 8px;
        }

        .welcome-section h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .welcome-section p {
          margin-bottom: 25px;
          opacity: 0.9;
        }

        .action-buttons {
          display: flex;
          gap: 15px;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
          border-radius: 6px;
          text-decoration: none;
          display: inline-block;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: white;
          color: #10b981;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid white;
        }

        .btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .stat-card .number {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 5px;
        }

        .stat-card .label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }

        .stat-card .change {
          font-size: 12px;
          color: #10b981;
        }

        .stat-card .change.positive {
          color: #10b981;
        }

        .quick-actions {
          margin-bottom: 30px;
        }

        .quick-actions h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .action-card h3 {
          font-size: 18px;
          margin-bottom: 10px;
        }

        .action-card p {
          font-size: 14px;
          color: #666;
        }

        .tours-page {
          margin-bottom: 30px;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }

        .page-header h1 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        .page-header p {
          font-size: 14px;
          color: #666;
        }

        .tour-summary {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .tour-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.2s;
        }

        .tour-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .tour-image {
          position: relative;
          height: 150px;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .image-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          background: #f0f0f0;
        }

        .tour-info {
          padding: 20px;
        }

        .tour-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .tour-header h3 {
          font-size: 18px;
          font-weight: 600;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          border: 1px solid;
        }

        .tour-details {
          display: grid;
          gap: 10px;
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #666;
        }

        .tour-id {
          font-size: 12px;
          color: #999;
        }

        .tour-description {
          font-size: 14px;
          color: #666;
          margin-bottom: 15px;
          line-height: 1.5;
        }

        .contact-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 14px;
          color: #666;
        }

        .tour-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.primary {
          background: #10b981;
          color: white;
        }

        .action-btn.secondary {
          background: #f8f9fa;
          color: #666;
        }

        .action-btn.danger {
          background: #ef4444;
          color: white;
        }

        .action-btn:hover:not(:disabled) {
          opacity: 0.9;
        }

        .no-tours {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .no-tours h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .no-tours p {
          font-size: 14px;
          color: #666;
        }

        .loading-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .error-state {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .error-state h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .error-state p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }

        .profile-page {
          margin-bottom: 30px;
        }

        .profile-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .profile-card h2 {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .profile-details {
          display: grid;
          gap: 15px;
          margin-bottom: 20px;
        }

        .profile-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .profile-item label {
          font-size: 14px;
          color: #666;
          font-weight: 500;
        }

        .profile-item input,
        .profile-item select,
        .profile-item textarea {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .profile-item input:disabled,
        .profile-item select:disabled,
        .profile-item textarea:disabled {
          background: #f8f9fa;
          color: #666;
        }

        .profile-actions {
          display: flex;
          gap: 10px;
        }

        .placeholder-content {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
        }

        .placeholder-card {
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
          max-width: 400px;
        }

        .placeholder-card h3 {
          font-size: 20px;
          margin-bottom: 10px;
        }

        .placeholder-card p {
          font-size: 14px;
          color: #666;
          margin-bottom: 20px;
        }
      `}</style>
    </div>
  );
}

export default GuideDashboard;
