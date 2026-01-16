import { useState, useEffect } from "react";
import {
  Globe,
  Bell,
  User,
  Settings,
  LogOut,
  Calendar,
  MapPin,
  Hotel,
  Activity,
  MessageCircle,
  Edit,
  Plus,
  BarChart3,
  Bed,
  Star,
  Menu,
  X,
  ChevronDown,
  Building,
  Trash2,
  Home,
  Wifi,
  Car,
  Coffee,
  Utensils,
  Shield,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import HotelDetailsView from "./hotel_details_view";
import EditHotelForm from "./edit_hotel_details_form";

function HotelOwnerDashboard() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showHotelDetails, setShowHotelDetails] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [hotelFilter, setHotelFilter] = useState("all");
  const [hotelSearch, setHotelSearch] = useState("");

  const userEmail = localStorage.getItem("email");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        email: profile.email || "",
        name: profile.fullname || "",
        phone: profile.phone || "",
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sidebarItems = [
    { name: "Dashboard", icon: Activity },
    { name: "My Hotels", icon: Building },
    { name: "Bookings", icon: Calendar },
    // { name: "Reports", icon: BarChart3 },
    // { name: "Messages", icon: MessageCircle },
    { name: "Profile", icon: User },
    // { name: "Settings", icon: Settings },
    { name: "Logout", icon: LogOut },
  ];

  // Logout function
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      toast.success("Logged out successfully");
      navigate("/login"); // Redirect to login page
    }
  };

  const handleCloseViews = () => {
    setShowHotelDetails(false);
    setShowEditForm(false);
    setSelectedHotel(null);
  };

  const fetchUpcomingBookings = async (hotelId) => {
    try {
      setBookingsLoading(true);
      setBookingsError(null);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/hotelbooking/upcoming/${hotelId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setBookings(response.data.data);
        toast.success("Upcoming bookings loaded successfully");
      } else {
        setBookingsError(response.data.message || "Failed to fetch bookings");
        toast.error(response.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      let errorMessage = "Failed to fetch bookings";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }
      setBookingsError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setBookingsLoading(false);
    }
  };

  useEffect(() => {
    if (activeMenuItem === "Bookings" && selectedHotelId) {
      fetchUpcomingBookings(selectedHotelId);
    }
  }, [activeMenuItem, selectedHotelId]);

  const BookingCard = ({ booking }) => (
    <div className="booking-card" style={{ "--tilt-angle": "5deg" }}>
      <div className="booking-header">
        <h3 className="booking-id">Booking #{booking.booking_id}</h3>
        <span
          className={`status-badge ${getStatusColor(booking.booking_status)}`}
        >
          {booking.booking_status}
        </span>
      </div>
      <div className="booking-details">
        <div className="detail-item">
          <User className="detail-icon" />
          <span className="detail-text">{booking.guest_email}</span>
        </div>
        <div className="detail-item">
          <Hotel className="detail-icon" />
          <span className="detail-text">{booking.hotel_name}</span>
        </div>
        <div className="detail-item">
          <Bed className="detail-icon" />
          <span className="detail-text">
            {booking.room_type} ({booking.no_of_rooms} room
            {booking.no_of_rooms > 1 ? "s" : ""})
          </span>
        </div>
        <div className="detail-item">
          <Calendar className="detail-icon" />
          <span className="detail-text">
            {new Date(booking.check_in_date).toLocaleDateString()} -
            {new Date(booking.check_out_date).toLocaleDateString()}
          </span>
        </div>
        <div className="detail-item">
          <User className="detail-icon" />
          <span className="detail-text">
            {booking.no_of_guests} guest{booking.no_of_guests > 1 ? "s" : ""}
          </span>
        </div>
        <div className="detail-item price">
          <span className="detail-text">
            LKR {booking.total_amount.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="booking-date">
        <Calendar className="date-icon" />
        <span>
          Booked on: {new Date(booking.booking_date).toLocaleDateString()}
        </span>
      </div>
    </div>
  );

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/view-user-by-email/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setProfile(response.data);

        toast.success("Profile loaded successfully");
      } else {
        setError("Failed to fetch profile");
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      let errorMessage = "Failed to fetch profile";

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
      fetchProfile();
    }
  }, [userEmail, activeMenuItem]);

  const fetchHotelsByOwner = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(`Fetching hotels for owner: ${userEmail}`);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/hotel/view_hotels_by_hotel_owner/${userEmail}`
      );

      console.log("Raw API Response:", response.data);

      if (response.data.success) {
        const transformedHotels = response.data.data.map((hotel) => ({
          id: hotel._id,
          hotel_id: hotel.hotel_id,
          hotel_name: hotel.hotel_name || "Unnamed Hotel",
          email: hotel.email,
          address: hotel.address,
          city: hotel.city || "City not specified",
          contact_number: hotel.contact_number,
          description: hotel.description || "No description available",
          parking_available: hotel.parking_available || false,
          status: hotel.status || "pending",
          total_rooms: hotel.total_rooms || 0,
          date: hotel.date,

          // Transform images array
          images: Array.isArray(hotel.images) ? hotel.images : [],

          // Transform room_types to consistent format
          room_types: Array.isArray(hotel.room_types)
            ? hotel.room_types.map((room, index) => ({
                id: index + 1,
                type: room.name || room.type || "Standard Room",
                name: room.name || room.type || "Standard Room",
                count: room.count || 0,
                price: room.price || 0,
                facilities: Array.isArray(room.facilities)
                  ? room.facilities
                  : [],
                images: Array.isArray(room.images) ? room.images : [],
              }))
            : [],

          // Add computed properties
          totalRoomTypes: Array.isArray(hotel.room_types)
            ? hotel.room_types.length
            : 0,
          hasImages: Array.isArray(hotel.images) && hotel.images.length > 0,
          registrationDate: hotel.date
            ? new Date(hotel.date).toLocaleDateString()
            : "Unknown",
        }));

        console.log("Transformed Hotels:", transformedHotels);
        setHotels(transformedHotels);

        if (!isLoading) {
          toast.success(
            `Successfully loaded ${transformedHotels.length} hotel${
              transformedHotels.length !== 1 ? "s" : ""
            }`
          );
        }
      } else {
        const errorMessage = response.data.message || "Failed to fetch hotels";
        setError(errorMessage);
        console.error("API returned error:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error fetching hotels:", error);

      // Detailed error handling
      let errorMessage = "Failed to fetch hotels";

      if (error.response) {
        // Server responded with error status
        switch (error.response.status) {
          case 404:
            errorMessage = "No hotels found for this owner";
            break;
          case 401:
            errorMessage = "Authentication required. Please log in again.";
            break;
          case 403:
            errorMessage = "Access denied. Please check your permissions.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              error.response.data?.message ||
              `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        // Other error
        errorMessage = error.message || "An unexpected error occurred";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch hotels when component mounts or when user email changes
  useEffect(() => {
    if (userEmail) {
      fetchHotelsByOwner();
    } else {
      setError("User email not found. Please log in again.");
      setIsLoading(false);
    }
  }, [userEmail]);

  // Enhanced delete hotel function with better error handling
  const handleDeleteHotel = async (hotel_id, hotel_name) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${hotel_name}"? This action cannot be undone.`
      )
    ) {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.delete(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/hotel/delete_hotel/${hotel_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          // Remove hotel from local state
          setHotels((prevHotels) =>
            prevHotels.filter((hotel) => hotel.hotel_id !== hotel_id)
          );
          toast.success(`"${hotel_name}" deleted successfully`);

          if (selectedHotel && selectedHotel.hotel_id === hotel_id) {
            handleCloseViews();
          }
        } else {
          toast.error(response.data.message || "Failed to delete hotel");
        }
      } catch (error) {
        console.error("Error deleting hotel:", error);

        let errorMessage = "Failed to delete hotel";
        if (error.response?.status === 403) {
          errorMessage = "You don't have permission to delete this hotel";
        } else if (error.response?.status === 404) {
          errorMessage = "Hotel not found";
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        toast.error(errorMessage);
      }
    }
  };

  const handleEditHotel = (hotel_id, hotel_name) => {
    const hotel = hotels.find((h) => h.hotel_id === hotel_id);

    if (!hotel) {
      toast.error(`Hotel not found: "${hotel_name}"`);
      return;
    }

    // Check if hotel is approved
    if (hotel.status !== "approved") {
      const statusMessage =
        hotel.status === "pending"
          ? `Cannot edit "${hotel_name}" - Hotel is still pending approval.`
          : `Cannot edit "${hotel_name}" - Hotel has been rejected.`;
      toast.error(statusMessage);
      return;
    }

    setSelectedHotel(hotel);
    setShowEditForm(true);
    setShowHotelDetails(false); // Close details view if open
  };

  const handleSaveHotel = (updatedData) => {
    // Update the hotel in the local state
    setHotels((prevHotels) =>
      prevHotels.map((hotel) =>
        hotel.hotel_id === selectedHotel.hotel_id
          ? { ...hotel, ...updatedData }
          : hotel
      )
    );

    // Optionally refresh the data from server
    fetchHotelsByOwner();
  };

  const handleViewHotelDetails = (hotel_id, hotel_name) => {
    const hotel = hotels.find((h) => h.hotel_id === hotel_id);
    if (hotel) {
      setSelectedHotel(hotel);
      setShowHotelDetails(true);
      setShowEditForm(false);
    } else {
      toast.error(`Hotel details not found for "${hotel_name}"`);
    }
  };

  const handleCloseHotelDetails = () => {
    setShowHotelDetails(false);
    setSelectedHotel(null);
    setSelectedHotel(null);
  };

  // Enhanced status color function
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);

    handleCloseViews();

    // If switching to My Hotels, refresh the data
    if (itemName === "My Hotels") {
      fetchHotelsByOwner();
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

  const moveToGuide = () => {
    // toast.info(`Switching to ${accountType} account...`);
    if (window.confirm("Are you sure switch to Guide?")) {
      navigate("/guide/dashboard");
      setShowDropdown(false);
    }
  };

  // Enhanced stats calculation with error handling
  const calculateStats = () => {
    if (!Array.isArray(hotels) || hotels.length === 0) {
      return {
        totalHotels: 0,
        totalRooms: 0,
        avgOccupancy: 0,
        monthlyRevenue: 0,
        approvedHotels: 0,
        pendingHotels: 0,
        rejectedHotels: 0,
      };
    }

    const totalRooms = hotels.reduce((sum, hotel) => {
      const rooms = parseInt(hotel.total_rooms) || 0;
      return sum + rooms;
    }, 0);

    const approvedHotels = hotels.filter(
      (hotel) => hotel.status === "approved"
    ).length;
    const pendingHotels = hotels.filter(
      (hotel) => hotel.status === "pending"
    ).length;
    const rejectedHotels = hotels.filter(
      (hotel) => hotel.status === "rejected"
    ).length;

    // Calculate estimated metrics (you can replace with real data)
    const avgOccupancy =
      approvedHotels > 0 ? Math.floor(Math.random() * 40) + 60 : 0;
    const monthlyRevenue = approvedHotels * 15000; // Placeholder calculation

    return {
      totalHotels: hotels.length,
      totalRooms,
      avgOccupancy,
      monthlyRevenue,
      approvedHotels,
      pendingHotels,
      rejectedHotels,
    };
  };

  const stats = calculateStats();

  // Loading State Component
  const LoadingState = () => (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading your hotels...</p>
      <div
        style={{
          fontSize: "14px",
          color: "#666",
          marginTop: "10px",
        }}
      >
        Please wait while we fetch your hotel data
      </div>
    </div>
  );

  // Error State Component
  const ErrorState = () => (
    <div className="error-state">
      <AlertCircle className="error-icon" />
      <h3>Unable to Load Hotels</h3>
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

  // Enhanced Hotel Card Component
  const HotelCard = ({ hotel }) => (
    <div key={hotel.hotel_id} className="hotel-card">
      {/* Hotel Image */}
      <div className="hotel-image">
        {hotel.hasImages ? (
          <img
            src={hotel.images[0]}
            alt={hotel.hotel_name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className="image-placeholder"
          style={{
            display: hotel.hasImages ? "none" : "flex",
          }}
        >
          <Hotel className="w-12 h-12 text-gray-400" />
        </div>

        {/* Status overlay */}
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
              hotel.status === "approved"
                ? "rgba(34, 197, 94, 0.9)"
                : hotel.status === "pending"
                ? "rgba(251, 191, 36, 0.9)"
                : "rgba(239, 68, 68, 0.9)",
            color: "white",
            backdropFilter: "blur(4px)",
          }}
        >
          {hotel.status}
        </div>
      </div>

      {/* Hotel Info */}
      <div className="hotel-info">
        <div className="hotel-header">
          <h3 title={hotel.hotel_name}>{hotel.hotel_name}</h3>
          <span className={`status-badge ${getStatusColor(hotel.status)}`}>
            {hotel.status}
          </span>
        </div>

        <div className="hotel-details">
          <div className="detail-item">
            <MapPin className="w-4 h-4 mr-2" />
            <span title={hotel.city}>{hotel.city}</span>
          </div>
          <div className="detail-item">
            <Bed className="w-4 h-4 mr-2" />
            <span>{hotel.total_rooms} rooms</span>
          </div>
          <div className="detail-item">
            <span className="hotel-id">ID: {hotel.hotel_id}</span>
          </div>
          {hotel.registrationDate && (
            <div className="detail-item">
              <Calendar className="w-4 h-4 mr-2" />
              <span>Registered: {hotel.registrationDate}</span>
            </div>
          )}
        </div>

        {hotel.description && (
          <p className="hotel-description" title={hotel.description}>
            {hotel.description.length > 100
              ? hotel.description.substring(0, 100) + "..."
              : hotel.description}
          </p>
        )}

        {/* Room Types */}
        {hotel.room_types && hotel.room_types.length > 0 && (
          <div className="room-types">
            <h4>Room Types ({hotel.room_types.length}):</h4>
            <div className="room-types-list">
              {hotel.room_types.slice(0, 3).map((room, index) => (
                <span
                  key={index}
                  className="room-type-tag"
                  title={`${room.type}: LKR ${room.price}`}
                >
                  {room.type}: LKR {room.price.toLocaleString()}
                </span>
              ))}
              {hotel.room_types.length > 3 && (
                <span
                  className="room-type-tag"
                  style={{ background: "#f3f4f6", color: "#6b7280" }}
                >
                  +{hotel.room_types.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="contact-info">
          {hotel.contact_number && (
            <div className="detail-item">
              <span>Contact: {hotel.contact_number}</span>
            </div>
          )}
          {hotel.parking_available && (
            <div className="detail-item">
              <Car className="w-4 h-4 mr-2" />
              <span>Parking Available</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="hotel-actions">
          <button
            className="action-btn primary"
            onClick={() =>
              handleViewHotelDetails(hotel.hotel_id, hotel.hotel_name)
            }
            title={`View details for ${hotel.hotel_name}`}
          >
            View Details
          </button>
          <button
            className={`action-btn secondary ${
              hotel.status !== "approved" ? "disabled" : ""
            }`}
            onClick={() => handleEditHotel(hotel.hotel_id, hotel.hotel_name)}
            title={
              hotel.status === "approved"
                ? `Edit ${hotel.hotel_name}`
                : `Cannot edit ${hotel.status} hotel`
            }
            disabled={hotel.status !== "approved"}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="action-btn danger"
            onClick={() => handleDeleteHotel(hotel.hotel_id, hotel.hotel_name)}
            title={`Delete ${hotel.hotel_name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  // Content rendering function with enhanced error handling
  const renderContent = () => {
    if (showEditForm && selectedHotel) {
      return (
        <EditHotelForm
          hotel={selectedHotel}
          onBack={handleCloseViews}
          onSave={handleSaveHotel}
        />
      );
    }

    if (showHotelDetails && selectedHotel) {
      return (
        <HotelDetailsView
          hotel={selectedHotel}
          onBack={handleCloseHotelDetails}
          onEdit={handleEditHotel}
          onDelete={handleDeleteHotel}
        />
      );
    }

    if (activeMenuItem === "Dashboard") {
      return (
        <>
          <div className="welcome-section">
            <h1>Welcome back, Hotel Owner!</h1>
            <p>Manage your hotel properties and grow your business</p>

            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={() => handleMenuItemClick("My Hotels")}
              >
                View My Hotels
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleMenuItemClick("Reports")}
              >
                View Reports
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleMenuItemClick("Bookings")}
              >
                View Bookings
              </button>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="number">{stats.totalHotels}</div>
              <div className="label">Total Hotels</div>
              <div className="change positive">
                {stats.approvedHotels} Approved
              </div>
            </div>

            <div className="stat-card">
              <div className="number">{stats.totalRooms}</div>
              <div className="label">Total Rooms</div>
              <div className="change positive">Across all properties</div>
            </div>

            <div className="stat-card">
              <div className="number">{stats.avgOccupancy}%</div>
              <div className="label">Avg Occupancy</div>
              <div className="change">This month</div>
            </div>

            <div className="stat-card">
              <div className="number">
                LKR {stats.monthlyRevenue.toLocaleString()}
              </div>
              <div className="label">Monthly Revenue</div>
              <div className="change positive">Estimated earnings</div>
            </div>
          </div>

          {/* Enhanced Quick Actions with real data */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>

            <div className="actions-grid">
              <div
                className="action-card"
                onClick={() => handleMenuItemClick("My Hotels")}
              >
                <h3>Manage Hotels ({stats.totalHotels})</h3>
                <p>View and edit your properties</p>
                {stats.pendingHotels > 0 && (
                  <div
                    style={{
                      color: "#f59e0b",
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {stats.pendingHotels} pending approval
                  </div>
                )}
              </div>

              <div
                className="action-card"
                onClick={() => handleMenuItemClick("Bookings")}
              >
                <h3>View Bookings</h3>
                <p>Check recent reservations</p>
              </div>

              <div className="action-card">
                <Link
                  to="/addhotel"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3>Add New Hotel</h3>
                  <p>Expand your portfolio</p>
                </Link>
              </div>

              {/* <div className="action-card" onClick={() => handleMenuItemClick('Reports')}>
                                <h3>View Reports</h3>
                                <p>Analytics and insights</p>
                            </div> */}

              {/* <div className="action-card" onClick={() => handleMenuItemClick('Messages')}>
                                <h3>Messages</h3>
                                <p>Guest communications</p>
                            </div> */}

              {/* <div className="action-card" onClick={() => handleMenuItemClick('Settings')}>
                                <h3>Settings</h3>
                                <p>Account preferences</p>
                            </div> */}
            </div>
          </div>
        </>
      );
    }

    if (activeMenuItem === "My Hotels") {
      const normalizedSearch = hotelSearch.trim().toLowerCase();
      const visibleHotels = hotels.filter((hotel) => {
        const matchesFilter =
          hotelFilter === "all" || hotel.status === hotelFilter;
        const matchesSearch =
          normalizedSearch.length === 0 ||
          hotel.hotel_name?.toLowerCase().includes(normalizedSearch) ||
          hotel.city?.toLowerCase().includes(normalizedSearch) ||
          hotel.hotel_id?.toLowerCase().includes(normalizedSearch);
        return matchesFilter && matchesSearch;
      });

      return (
        <div className="hotels-page">
          {/* Enhanced Header Section */}
          <div className="page-header hotel-page-header">
            <div>
              <h1>My Hotels</h1>
              <p>Manage your hotel properties and portfolio</p>
              {hotels.length > 0 && (
                <div className="hotel-summary">
                  <span className="summary-pill">
                    Total {stats.totalHotels}
                  </span>
                  <span className="summary-pill success">
                    Approved {stats.approvedHotels}
                  </span>
                  <span className="summary-pill warning">
                    Pending {stats.pendingHotels}
                  </span>
                  <span className="summary-pill danger">
                    Rejected {stats.rejectedHotels}
                  </span>
                </div>
              )}
            </div>
            <div className="header-actions">
              <button
                className="btn btn-secondary"
                onClick={fetchHotelsByOwner}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
              <Link
                to="/addhotel"
                className="btn btn-primary hotel-add-btn text-decoration-none"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Hotel
              </Link>
            </div>
          </div>

          <div className="hotel-toolbar">
            <div className="hotel-search">
              <input
                type="text"
                placeholder="Search by hotel name, city, or ID..."
                value={hotelSearch}
                onChange={(e) => setHotelSearch(e.target.value)}
              />
            </div>
            <div className="hotel-filters">
              <button
                className={`filter-pill ${
                  hotelFilter === "all" ? "active" : ""
                }`}
                onClick={() => setHotelFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-pill ${
                  hotelFilter === "approved" ? "active" : ""
                }`}
                onClick={() => setHotelFilter("approved")}
              >
                Approved
              </button>
              <button
                className={`filter-pill ${
                  hotelFilter === "pending" ? "active" : ""
                }`}
                onClick={() => setHotelFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`filter-pill ${
                  hotelFilter === "rejected" ? "active" : ""
                }`}
                onClick={() => setHotelFilter("rejected")}
              >
                Rejected
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && <LoadingState />}

          {/* Error State */}
          {error && !isLoading && <ErrorState />}

          {/* Hotels Grid */}
          {!isLoading && !error && (
            <div className="hotels-grid">
              {hotels.length === 0 ? (
                <div className="no-hotels">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3>No hotels found</h3>
                  <p>Get started by adding your first hotel property</p>
                  <Link
                    to="/addhotel"
                    className="btn btn-primary"
                    style={{ marginTop: "20px" }}
                  >
                    Add Your First Hotel
                  </Link>
                </div>
              ) : visibleHotels.length === 0 ? (
                <div className="no-hotels">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3>No matching hotels</h3>
                  <p>Try adjusting your search or filters.</p>
                </div>
              ) : (
                visibleHotels.map((hotel) => (
                  <HotelCard key={hotel.hotel_id} hotel={hotel} />
                ))
              )}
            </div>
          )}
        </div>
      );
    }

    // Other menu items remain the same...
    if (activeMenuItem === "Bookings") {
      return (
        <div className="bookings-page">
          <div
            className="bookings-header"
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1e40af)",
              color: "white",
            }}
          >
            <div>
              <h1 className="header-title">Upcoming Bookings</h1>
              <p className="header-subtitle">
                Manage your future reservations with ease
              </p>
            </div>
            <div className="header-actions">
              <select
                className="hotel-select"
                value={selectedHotelId || ""}
                onChange={(e) => setSelectedHotelId(e.target.value)}
              >
                <option value="" disabled>
                  Select a hotel
                </option>
                {hotels.map((hotel) => (
                  <option key={hotel.hotel_id} value={hotel.hotel_id}>
                    {hotel.hotel_name}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-secondary"
                onClick={() => fetchUpcomingBookings(selectedHotelId)}
                disabled={bookingsLoading || !selectedHotelId}
              >
                {bookingsLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          {bookingsLoading && <LoadingState />}
          {bookingsError && !bookingsLoading && (
            <ErrorState errorMessage={bookingsError} />
          )}
          {!bookingsLoading && !bookingsError && (
            <div className="bookings-grid">
              {bookings.length === 0 ? (
                <div className="no-bookings">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3>No upcoming bookings found</h3>
                  <p>
                    No reservations scheduled for the selected hotel as of{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <BookingCard key={booking.booking_id} booking={booking} />
                ))
              )}
            </div>
          )}
        </div>
      );
    }

    if (activeMenuItem === "Profile") {
      const handleProfileSave = async () => {
        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${
              formData.email
            }`,
            {
              fullname: formData.name,
              phone: formData.phone,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.data.success) {
            // toast.success("Profile updated successfully");
            fetchProfile();
            setIsEditing(false);
          } else {
            toast.error(response.data.message || "Update failed");
          }
        } catch (err) {
          console.error(err);
          toast.error(err.response?.data?.message || "Server error");
        }
      };

      return (
        <div className="profile-page">
          <div className="page-header">
            <div>
              <h1>My Profile</h1>
              <p>Manage your account details</p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-secondary"
                onClick={fetchProfile}
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {isLoading && <LoadingState />}
          {error && !isLoading && <ErrorState />}

          {!isLoading && !error && (
            <div className="profile-content">
              <div className="profile-card">
                <h2>Account Information</h2>
                <div className="profile-details">
                  <div className="profile-item">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                    />
                  </div>

                  <div className="profile-item">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="profile-item">
                    <label>Contact Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="profile-actions">
                  {!isEditing ? (
                    <button
                      className="action-btn primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        className="action-btn primary"
                        onClick={handleProfileSave}
                      >
                        Save Changes
                      </button>
                      <button
                        className="action-btn secondary"
                        onClick={() => {
                          setFormData({
                            email: profile.email,
                            name: profile.name,
                            phone: profile.phone,
                          });
                          setIsEditing(false);
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
    }

    // For any other menu items, show a generic content page
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
    <div>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap");
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
          color: #3b82f6;
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
          background-color: #3b82f6;
          color: white;
        }

        .main-content {
          flex: 1;
          margin-left: 250px;
          margin-top: 70px;
          padding: 30px;
        }

        .welcome-section {
          background: #3b82f6;
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
          color: #3b82f6;
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 1px solid white;
        }

        .btn:hover:not(:disabled) {
          opacity: 0.8;
          transform: translateY(-1px);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }

        .stat-card {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
          transition: transform 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-card .number {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 8px;
          color: #3b82f6;
        }

        .stat-card .label {
          color: #666;
          margin-bottom: 5px;
          font-weight: 500;
        }

        .stat-card .change {
          font-size: 12px;
          color: #888;
        }

        .change.positive {
          color: #27ae60;
        }

        .quick-actions {
          background: white;
          padding: 25px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .quick-actions h2 {
          margin-bottom: 25px;
          color: #333;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }

        .action-card {
          padding: 30px 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-card:hover {
          background-color: #f8f9fa;
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .action-card h3 {
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }

        .action-card p {
          font-size: 14px;
          color: #666;
        }

        /* Enhanced Hotels Page Specific Styles */
        .hotels-page {
          background: #f5f5f5;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .page-header h1 {
          font-size: 28px;
          margin-bottom: 5px;
          color: #333;
        }

        .page-header p {
          color: #666;
          margin-bottom: 10px;
        }

        .hotel-summary {
          font-size: 14px;
          color: #666;
          margin-top: 10px;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .loading-state,
        .error-state {
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #3b82f6;
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

        .error-state h3 {
          color: #e74c3c;
          margin-bottom: 10px;
        }

        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 25px;
        }

        .no-hotels {
          grid-column: 1 / -1;
          text-align: center;
          padding: 60px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .no-hotels h3 {
          margin-bottom: 10px;
          color: #333;
        }

        .no-hotels p {
          margin-bottom: 20px;
          color: #666;
        }

        .hotel-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .hotel-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }

        .hotel-image {
          height: 220px;
          overflow: hidden;
          background: #f3f4f6;
          position: relative;
        }

        .image-placeholder {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
        }

        .hotel-info {
          padding: 24px;
        }

        .hotel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .hotel-header h3 {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          margin: 0;
          flex: 1;
          margin-right: 12px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: 1px solid;
          white-space: nowrap;
        }

        .hotel-details {
          margin-bottom: 16px;
          space-y: 8px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 6px;
        }

        .hotel-id {
          font-family: "Monaco", "Menlo", monospace;
          background: #f3f4f6;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 11px;
          color: #4b5563;
          font-weight: 500;
        }

        .hotel-description {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .room-types {
          margin-bottom: 16px;
        }

        .room-types h4 {
          font-size: 14px;
          color: #374151;
          margin-bottom: 8px;
          font-weight: 600;
        }

        .room-types-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .room-type-tag {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          color: #1e40af;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          border: 1px solid #93c5fd;
        }

        .contact-info {
          margin-bottom: 20px;
          padding-top: 12px;
          border-top: 1px solid #f3f4f6;
        }

        .hotel-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn.primary {
          flex: 1;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          color: white;
        }

        .action-btn.secondary {
          background: #f9fafb;
          color: #6b7280;
          padding: 10px;
          border: 1px solid #e5e7eb;
        }

        .action-btn.danger {
          background: #fef2f2;
          color: #dc2626;
          padding: 10px;
          border: 1px solid #fecaca;
        }

        .action-btn:hover {
          transform: translateY(-1px);
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        .action-btn.secondary:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .action-btn.danger:hover {
          background: #fee2e2;
          color: #b91c1c;
        }

        .action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .placeholder-content {
          margin-top: 30px;
        }

        .placeholder-card {
          background: white;
          padding: 40px;
          text-align: center;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .placeholder-card h3 {
          margin-bottom: 15px;
          color: #333;
        }

        .placeholder-card p {
          margin-bottom: 20px;
          color: #666;
        }

        .text-decoration-none {
          text-decoration: none;
        }

        /* Enhanced Responsive Design */
        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .actions-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hotels-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.3s ease;
          }

          .main-content {
            margin-left: 0;
            padding: 20px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .page-header {
            flex-direction: column;
            gap: 20px;
            text-align: center;
          }

          .header-actions {
            flex-direction: column;
            width: 100%;
          }

          .hotels-grid {
            grid-template-columns: 1fr;
          }

          .search-bar {
            margin: 10px 0;
            max-width: none;
          }

          .user-section {
            gap: 10px;
          }

          .hotel-actions {
            flex-direction: column;
          }

          .action-btn.primary {
            order: 1;
          }

          .action-btn.secondary,
          .action-btn.danger {
            flex: 1;
          }
        }

        @media (max-width: 480px) {
          .header {
            padding: 10px 15px;
          }

          .main-content {
            padding: 15px;
          }

          .welcome-section {
            padding: 25px;
          }

          .welcome-section h1 {
            font-size: 24px;
          }

          .page-header {
            padding: 20px;
          }

          .page-header h1 {
            font-size: 22px;
          }

          .hotel-info {
            padding: 16px;
          }

          .hotel-header h3 {
            font-size: 16px;
          }
        }

        /* Loading animation enhancement */
        .loading-state p {
          color: #6b7280;
          font-weight: 500;
        }

        /* Error state enhancements */
        .error-state {
          border: 1px solid #fee2e2;
          background: linear-gradient(135deg, #fefefe 0%, #fef2f2 100%);
        }

        /* Improved hover effects */
        .hotel-card:hover .hotel-image img {
          transform: scale(1.05);
          transition: transform 0.3s ease;
        }

        /* Status badge animations */
        .status-badge {
          transition: all 0.2s ease;
        }

        /* Room type tag hover effects */
        .room-type-tag:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(30, 64, 175, 0.3);
        }
        .hotel-details-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .hotel-details-modal {
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        /* Enhanced hover effects for hotel cards */
        .hotel-card .action-btn.primary:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }

        /* Add smooth transitions */
        .main-content {
          transition: all 0.3s ease;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .hotel-details-overlay {
            padding: 0;
            align-items: flex-start;
          }

          .hotel-details-modal {
            max-height: 100vh;
            border-radius: 0;
          }
        }

        .profile-page {
          background: #f5f5f5;
        }

        .profile-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-card {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .profile-card h2 {
          font-size: 20px;
          color: #333;
          margin-bottom: 20px;
        }

        .profile-details {
          display: grid;
          gap: 16px;
        }

        .profile-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .profile-item label {
          font-weight: 600;
          color: #374151;
        }

        .profile-item span {
          color: #6b7280;
        }

        .profile-actions {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .profile-content {
            max-width: 100%;
          }

          .profile-item {
            flex-direction: column;
            gap: 8px;
          }

          .profile-item label {
            font-size: 14px;
          }

          .profile-item span {
            font-size: 14px;
          }
        }
        .action-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #f3f4f6 !important;
          color: #9ca3af !important;
          border-color: #e5e7eb !important;
        }

        .action-btn.disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }

        /* Status-specific styling for hotel cards */
        .hotel-card[data-status="pending"] .action-btn.secondary {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .hotel-card[data-status="rejected"] .action-btn.secondary {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Enhanced hover states */
        .hotel-card:hover .action-btn:not(.disabled) {
          transform: translateY(-1px);
        }

        /* Transition improvements */
        .main-content {
          transition: all 0.3s ease;
          min-height: calc(100vh - 70px);
        }

        /* Loading overlay for form submissions */
        .form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .form-loading {
          background: white;
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        /* Keep all existing styles from the original dashboard */
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
          color: #3b82f6;
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
          background-color: #3b82f6;
          color: white;
        }

        .main-content {
          flex: 1;
          margin-left: 250px;
          margin-top: 70px;
          padding: 30px;
        }
        .bookings-page {
          background: #f5f5f5;
          padding: 20px;
        }

        .bookings-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px;
          border-radius: 12px;
          margin-bottom: 30px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease-in-out;
        }

        .header-title {
          font-size: 28px;
          margin-bottom: 5px;
          font-weight: 700;
        }

        .header-subtitle {
          font-size: 16px;
          opacity: 0.9;
        }

        .header-actions {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .hotel-select {
          padding: 12px 15px;
          border: none;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.9);
          font-size: 14px;
          color: #1f2937;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .hotel-select:focus {
          outline: none;
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .hotel-select option {
          background: #fff;
          color: #1f2937;
        }

        .bookings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
          padding: 20px 0;
        }

        .booking-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          padding: 20px;
          transform: perspective(1000px) rotateX(var(--tilt-angle)) rotateY(0);
        }

        .booking-card:hover {
          transform: perspective(1000px) rotateX(0) rotateY(5deg)
            translateY(-10px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 10px;
        }

        .booking-id {
          font-size: 18px;
          color: #1f2937;
          font-weight: 600;
          margin: 0;
        }

        .booking-details {
          margin-bottom: 15px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          color: #4b5563;
          font-size: 14px;
        }

        .detail-icon {
          width: 16px;
          height: 16px;
          margin-right: 8px;
          color: #6b7280;
        }

        .detail-text {
          font-weight: 500;
        }

        .price {
          font-weight: 600;
          color: #10b981;
        }

        .booking-date {
          display: flex;
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 12px;
        }

        .date-icon {
          width: 14px;
          height: 14px;
          margin-right: 5px;
          color: #6b7280;
        }

        .no-bookings {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .bookings-header {
            flex-direction: column;
            text-align: center;
            gap: 20px;
          }
          .header-actions {
            flex-direction: column;
            width: 100%;
          }
          .bookings-grid {
            grid-template-columns: 1fr;
          }
          .hotel-select {
            width: 100%;
          }
        }

        :root {
          --bg: #f4efe6;
          --bg-2: #e6f1ea;
          --panel: rgba(255, 255, 255, 0.92);
          --panel-border: rgba(15, 23, 42, 0.08);
          --ink: #1f2937;
          --muted: #5b6472;
          --brand: #0f766e;
          --accent: #d97706;
          --danger: #b42318;
          --shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          --shadow-soft: 0 8px 20px rgba(15, 23, 42, 0.08);
          --ring: 0 0 0 4px rgba(15, 118, 110, 0.15);
        }

        body {
          font-family: "Manrope", "Segoe UI", Tahoma, sans-serif;
          background: linear-gradient(135deg, var(--bg), var(--bg-2));
          color: var(--ink);
        }

        .main-container {
          background: transparent;
          position: relative;
        }

        .main-container::before,
        .main-container::after {
          content: "";
          position: fixed;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .main-container::before {
          top: -140px;
          right: -140px;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(15, 118, 110, 0.18),
            transparent 60%
          );
        }

        .main-container::after {
          bottom: -160px;
          left: -140px;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(217, 119, 6, 0.18),
            transparent 60%
          );
        }

        .header {
          background: var(--panel);
          border-bottom: 1px solid var(--panel-border);
          box-shadow: var(--shadow-soft);
          backdrop-filter: blur(14px);
        }

        .logo {
          color: var(--brand);
          letter-spacing: -0.01em;
        }

        .search-bar input {
          background: #fff;
          border: 1px solid var(--panel-border);
          border-radius: 999px;
          padding: 12px 16px;
          color: var(--ink);
        }

        .user-profile {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid var(--panel-border);
          box-shadow: var(--shadow-soft);
          background: #fff;
          gap: 8px;
        }

        .dropdown-menu {
          border-radius: 12px;
          border: 1px solid var(--panel-border);
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .dropdown-item:hover {
          background: rgba(15, 118, 110, 0.08);
        }

        .sidebar {
          background: var(--panel);
          border-right: 1px solid var(--panel-border);
          box-shadow: var(--shadow-soft);
        }

        .sidebar-item {
          margin: 6px 10px;
          border-radius: 12px;
          border: 1px solid transparent;
        }

        .sidebar-item svg {
          color: var(--muted);
        }

        .sidebar-item.active {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
          border-color: transparent;
        }

        .sidebar-item.active svg {
          color: #fff;
        }

        .main-content {
          background: transparent;
          padding: 32px;
          position: relative;
          z-index: 1;
        }

        .welcome-section,
        .bookings-header {
          border-radius: 18px;
          background: linear-gradient(135deg, var(--brand), var(--accent));
          color: #fff;
          box-shadow: var(--shadow);
        }

        .hotel-select {
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.95);
        }

        .stat-card,
        .action-card,
        .hotel-card,
        .booking-card,
        .profile-card,
        .loading-state,
        .error-state,
        .placeholder-card {
          border-radius: 16px;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          box-shadow: var(--shadow-soft);
        }

        .stat-card .number {
          color: var(--brand);
        }

        .hotel-card {
          overflow: hidden;
        }

        .hotel-image {
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.12),
            rgba(217, 119, 6, 0.08)
          );
        }

        .room-type-tag {
          background: rgba(15, 118, 110, 0.12);
          color: var(--brand);
          border: 1px solid rgba(15, 118, 110, 0.2);
        }

        .status-badge {
          border-radius: 999px;
          padding: 6px 10px;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
        }

        .action-btn.secondary {
          background: #fff;
          border: 1px solid var(--panel-border);
          color: var(--muted);
        }

        .action-btn.danger {
          background: #fee2e2;
          color: var(--danger);
          border: 1px solid #fecaca;
        }

        .booking-card {
          transform: perspective(1200px) rotateX(2deg) rotateY(0);
        }

        .booking-card:hover {
          transform: perspective(1200px) rotateX(0) rotateY(4deg)
            translateY(-6px);
        }

        .error-icon {
          width: 46px;
          height: 46px;
          color: var(--danger);
          margin-bottom: 16px;
        }

        .spinner {
          border-top-color: var(--brand);
        }

        .profile-item label {
          color: var(--ink);
        }

        .profile-item span {
          color: var(--muted);
        }

        .profile-item input,
        .profile-item select,
        .profile-item textarea {
          border-radius: 12px;
          border: 1px solid var(--panel-border);
          padding: 12px;
        }

        .profile-item input:focus,
        .profile-item select:focus,
        .profile-item textarea:focus {
          outline: none;
          box-shadow: var(--ring);
          border-color: rgba(15, 118, 110, 0.4);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .stat-card,
        .action-card,
        .hotel-card,
        .booking-card {
          animation: fadeUp 0.6s ease both;
        }

        .stat-card:nth-child(2),
        .action-card:nth-child(2),
        .hotel-card:nth-child(2),
        .booking-card:nth-child(2) {
          animation-delay: 0.05s;
        }

        .stat-card:nth-child(3),
        .action-card:nth-child(3),
        .hotel-card:nth-child(3),
        .booking-card:nth-child(3) {
          animation-delay: 0.1s;
        }

        .btn {
          border-radius: 12px;
          font-weight: 600;
          padding: 12px 18px;
          border: 1px solid var(--panel-border);
          background: #fff;
          color: var(--ink);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: var(--shadow-soft);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
          border: none;
        }

        .btn-secondary {
          background: #fff;
          color: var(--muted);
          border: 1px solid var(--panel-border);
        }

        .hotel-page-header {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 18px;
          padding: 26px;
          box-shadow: var(--shadow-soft);
        }

        .hotel-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 12px;
        }

        .summary-pill {
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(15, 118, 110, 0.12);
          color: var(--brand);
          font-size: 12px;
          font-weight: 600;
          border: 1px solid rgba(15, 118, 110, 0.2);
        }

        .summary-pill.warning {
          background: rgba(217, 119, 6, 0.12);
          color: var(--accent);
          border-color: rgba(217, 119, 6, 0.2);
        }

        .summary-pill.success {
          background: rgba(16, 185, 129, 0.12);
          color: #059669;
          border-color: rgba(16, 185, 129, 0.2);
        }

        .summary-pill.danger {
          background: rgba(244, 63, 94, 0.12);
          color: var(--danger);
          border-color: rgba(244, 63, 94, 0.2);
        }

        .hotel-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          justify-content: space-between;
          margin: 18px 0 10px;
        }

        .hotel-search {
          flex: 1 1 280px;
        }

        .hotel-search input {
          width: 100%;
          border-radius: 12px;
          border: 1px solid var(--panel-border);
          padding: 12px 14px;
          background: #fff;
        }

        .hotel-search input:focus {
          outline: none;
          box-shadow: var(--ring);
          border-color: rgba(15, 118, 110, 0.4);
        }

        .hotel-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-pill {
          border-radius: 999px;
          padding: 8px 14px;
          border: 1px solid var(--panel-border);
          background: #fff;
          color: var(--muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .filter-pill.active {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
          border-color: transparent;
          box-shadow: var(--shadow-soft);
        }

        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .no-hotels {
          background: var(--panel);
          border: 1px dashed var(--panel-border);
          border-radius: 16px;
          padding: 40px 20px;
          text-align: center;
          grid-column: 1 / -1;
        }

        .hotel-card {
          border-radius: 14px;
        }

        .hotel-image {
          height: 150px;
        }

        .hotel-info {
          padding: 16px;
        }

        .hotel-header h3 {
          font-size: 16px;
        }

        .hotel-details .detail-item {
          font-size: 13px;
        }

        .status-badge {
          padding: 4px 8px;
          font-size: 10px;
        }

        .hotel-description {
          font-size: 13px;
          margin-bottom: 12px;
        }

        .room-types h4 {
          font-size: 12px;
        }

        .room-type-tag {
          padding: 3px 8px;
          font-size: 10px;
        }

        .hotel-actions .action-btn {
          padding: 8px 12px;
          font-size: 12px;
        }

        @media (max-width: 900px) {
          .main-content {
            padding: 24px;
          }

          .sidebar {
            width: 220px;
          }
        }

        @media (max-width: 1200px) {
          .hotels-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hotels-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="header">
        <div className="logo">TourNexus</div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search hotels, bookings, reports..."
          />
        </div>

        <div className="user-section">
          <div className="user-profile" onClick={toggleDropdown}>
            <span style={{ marginLeft: "5px" }}>Change Account</span>
            <ChevronDown className="w-4 h-4" />

            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <div className="dropdown-header">Switch Account</div>
              <div
                className="dropdown-item"
                onClick={() => moveToTourist("Tourist")}
              >
                Tourist
              </div>
              <div
                className="dropdown-item"
                onClick={() => moveToGuide("Guide")}
              >
                Guide
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="main-container">
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

        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
}

export default HotelOwnerDashboard;
