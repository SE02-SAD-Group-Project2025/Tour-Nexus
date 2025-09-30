import axios from "axios";
import { useEffect, useState } from "react";
import HotelCart from "./td_hotel_cart";
import GuideCart from "./td_guide_cart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import View_vehicles from "./tourist_view_vehicle";
import VehicleSection from "./tourist_view_vehicle";

// Import the new search banner components
const HotelSearchBanner = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    destination: "",
  });

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    if (!searchData.destination) {
      toast.error("Please enter a destination");
      return;
    }
    onSearch(searchData);
  };

  return (
    <div className="hotel-search-banner">
      <div className="banner-content">
        <h1>Find your perfect stay</h1>
        <p>Search low prices on hotels, homes and much more...</p>

        <div className="search-form">
          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">🏨</span>
              Destination
            </div>
            <input
              type="text"
              className="field-input"
              placeholder="Where are you going?"
              value={searchData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

const GuideSearchBanner = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    language: "",
    checkInDate: "",
    checkOutDate: "",
  });

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!searchData.checkInDate || !searchData.checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }
    if (new Date(searchData.checkInDate) >= new Date(searchData.checkOutDate)) {
      toast.error("Check-out date must be after check-in date");
      return;
    }
    onSearch(searchData);
  };

  return (
    <div className="guide-search-banner">
      <div className="banner-content">
        <h1>Find your perfect tour guide</h1>
        <p>Discover Sri Lanka with experienced local guides...</p>

        <div className="search-form">
          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">🗣️</span>
              Language
            </div>
            <select
              className="field-input"
              value={searchData.language}
              onChange={(e) => handleInputChange("language", e.target.value)}
            >
              <option value="">Select Language</option>
              <option value="English">English</option>
              <option value="Sinhala">Sinhala</option>
              <option value="Tamil">Tamil</option>
              <option value="German">German</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
              <option value="Hindi">Hindi</option>
              <option value="Russian">Russian</option>
              <option value="Spanish">Spanish</option>
              <option value="Italian">Italian</option>
            </select>
          </div>

          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">📅</span>
              Start date
            </div>
            <input
              type="date"
              className="field-input"
              value={searchData.checkInDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleInputChange("checkInDate", e.target.value)}
            />
          </div>

          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">📅</span>
              End date
            </div>
            <input
              type="date"
              className="field-input"
              value={searchData.checkOutDate}
              min={
                searchData.checkInDate || new Date().toISOString().split("T")[0]
              }
              onChange={(e) =>
                handleInputChange("checkOutDate", e.target.value)
              }
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Find Guides
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TouristDashboard() {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [filteredGuides, setFilteredGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [hasSearchedGuides, setHasSearchedGuides] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [guideSearchCriteria, setGuideSearchCriteria] = useState(null);
  const [activeMenuItem, setActiveMenuItem] = useState("Dashboard");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [bookingsFetched, setBookingsFetched] = useState(false);
  const [guiderbooking, setguiderbooking] = useState([]);
  const [vehiclebooking, setVehiclebooking] = useState([]);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("email");
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const hotelsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/hotel/view_approved_hotels"
        );
        const guidesResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/guide/view_approved_guides"
        );

        const guiderbookingResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/guidebookings/guide_booking/${email}`
        );

        const vehiclesResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/vehiclebooking/tourist/${email}`
        );

        setHotels(hotelsResponse.data);
        setGuides(guidesResponse.data);
        setguiderbooking(guiderbookingResponse.data);
        setVehiclebooking(vehiclesResponse.data);

        console.log(guiderbookingResponse.data);
        console.log(vehiclesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (activeMenuItem === "My Bookings" && !bookingsFetched) {
      const fetchBookings = async () => {
        setBookingsLoading(true);
        try {
          const email = localStorage.getItem("email");
          if (!email) {
            throw new Error("Email not found. Please login again.");
          }
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/hotelbooking/user/${email}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          if (response.data.success) {
            setBookings(response.data.data || []);
            setBookingsFetched(true);
          } else {
            throw new Error(
              response.data.message || "Failed to fetch bookings"
            );
          }
        } catch (err) {
          setBookingsError(err.message);
          toast.error(err.message);
        } finally {
          setBookingsLoading(false);
        }
      };
      fetchBookings();
    }
  }, [activeMenuItem, bookingsFetched]);

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

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError(null);

      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/user/view-user-by-email/${email}`,
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
        setProfileError("Failed to fetch profile");
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

      setProfileError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSave = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${formData.email}`,
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
        toast.success("Profile updated successfully");
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

  // Add this useEffect to fetch profile when Profile menu is clicked (around line 90)
  useEffect(() => {
    if (email && activeMenuItem === "Profile") {
      fetchProfile();
    }
  }, [email, activeMenuItem]);

  const handleHotelSearchWithAPI = async (searchData) => {
    try {
      setIsLoading(true);
      setSearchCriteria(searchData);
      setHasSearched(true);

      const queryParams = new URLSearchParams({
        destination: searchData.destination,
        checkInDate: searchData.checkInDate,
        checkOutDate: searchData.checkOutDate,
        adults: searchData.adults?.toString() || "1",
        children: searchData.children?.toString() || "0",
        page: "1",
        limit: "20",
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotel/search?${queryParams}`
      );

      if (response.data.success) {
        setFilteredHotels(response.data.data);
      } else {
        setFilteredHotels([]);
        console.error("Search failed:", response.data.message);
      }
    } catch (error) {
      console.error("Error searching hotels:", error);
      setFilteredHotels([]);
      handleHotelSearchClientSide(searchData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHotelSearchClientSide = (searchData) => {
    setSearchCriteria(searchData);
    setHasSearched(true);

    const filtered = hotels.filter((hotel) => {
      const cityMatch =
        hotel.city
          .toLowerCase()
          .includes(searchData.destination.toLowerCase()) ||
        hotel.hotel_name
          .toLowerCase()
          .includes(searchData.destination.toLowerCase()) ||
        hotel.address
          .toLowerCase()
          .includes(searchData.destination.toLowerCase());

      const hasCapacity =
        hotel.room_types && hotel.room_types.some((room) => room.count > 0);

      return cityMatch && hasCapacity;
    });

    setFilteredHotels(filtered);
  };

  const handleGuideSearchWithAPI = async (searchData) => {
    try {
      setIsLoading(true);
      setGuideSearchCriteria(searchData);
      setHasSearchedGuides(true);

      const queryParams = new URLSearchParams({
        language: searchData.language,
        startDate: searchData.checkInDate,
        endDate: searchData.checkOutDate,
        page: "1",
        limit: "20",
      });

      localStorage.setItem("checkindate", searchData.checkInDate);
      localStorage.setItem("checkoutdate", searchData.checkOutDate);

      const apiUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/api/guide/search?${queryParams}`;
      console.log("Calling API:", apiUrl);

      const response = await axios.get(apiUrl);

      if (response.data.success) {
        setFilteredGuides(response.data.data);
        toast.success(`Found ${response.data.data.length} guides!`);
      } else {
        setFilteredGuides([]);
        toast.error("Search failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error searching guides:", error);
      setFilteredGuides([]);
      toast.error("Search failed. Using local search instead.");
      handleGuideSearchClientSide(searchData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuideSearchClientSide = (searchData) => {
    setGuideSearchCriteria(searchData);
    setHasSearchedGuides(true);

    const filtered = guides.filter((guide) => {
      const languageMatch =
        guide.languages &&
        guide.languages.some(
          (lang) => lang.toLowerCase() === searchData.language.toLowerCase()
        );

      const isAvailable = true; // This should be enhanced with actual availability check

      return languageMatch && isAvailable;
    });

    setFilteredGuides(filtered);

    if (filtered.length === 0) {
      toast.info(`No guides found who speak "${searchData.language}".`);
    } else {
      toast.success(`Found ${filtered.length} guides!`);
    }
  };

  const resetGuideSearch = () => {
    setHasSearchedGuides(false);
    setFilteredGuides([]);
    setGuideSearchCriteria(null);
  };

  const resetSearch = () => {
    setHasSearched(false);
    setFilteredHotels([]);
    setSearchCriteria(null);
  };

  const planNewTrip = () => {
    alert("Planning new trip...");
  };

  const aiTripPlanner = () => {
    alert("Opening AI Trip Planner...");
  };

  const exploreMapAction = () => {
    alert("Opening map explorer...");
  };

  const makeOwnTour = () => {
    alert("Opening custom tour creator...");
  };

  const searchHotels = () => {
    setActiveMenuItem("Hotels");
  };

  const findTourGuides = () => {
    setActiveMenuItem("Tour Guides");
  };

  const rentVehicles = () => {
    alert("Opening vehicle rental...");
  };

  const handleMenuItemClick = (itemName) => {
    setActiveMenuItem(itemName);
    if (itemName !== "Hotels") {
      resetSearch();
    }
    if (itemName !== "Tour Guides") {
      resetGuideSearch();
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const moveToAccount = (accountType) => {
    alert(`Moving to ${accountType} account...`);
    setShowDropdown(false);
  };

  const renderContent = () => {
    if (activeMenuItem === "Dashboard") {
      return (
        <>
          <div className="welcome-section">
            <h1>Welcome back, Traveler!</h1>
            <p>Ready for your next Sri Lankan adventure?</p>

            <div className="action-buttons">
              <span className="btn btn-primary">Book New Hotel</span>
              <button className="btn btn-secondary">Explore Map</button>
            </div>
          </div>

          <div className="stats-grid">
            {/* <div className="stat-card">
              <div className="number">12</div>
              <div className="label">Total Trips</div>
              <div className="change positive">+2 this month</div>
            </div>

            <div className="stat-card">
              <div className="number">45</div>
              <div className="label">Saved Places</div>
              <div className="change positive">+5 recently</div>
            </div> */}

            {/* <div className="stat-card">
              <div className="number">$2,450</div>
              <div className="label">Total Spent</div>
              <div className="change">Last 6 months</div>
            </div> */}

            {/* <div className="stat-card">
              <div className="number">28</div>
              <div className="label">Reviews Given</div>
              <div className="change">4.9 avg rating</div>
            </div> */}
          </div>

          <div className="quick-actions">
            <h2>Quick Actions</h2>

            <div className="actions-grid">
              <div className="action-card" onClick={aiTripPlanner}>
                <h3>AI Trip Planner</h3>
                <p>Smart itinerary suggestions</p>
              </div>

              <div className="action-card" onClick={exploreMapAction}>
                <h3>Explore Map</h3>
                <p>Discover hidden gems</p>
              </div>

              <div className="action-card" onClick={makeOwnTour}>
                <h3>Make an Own Tour</h3>
                <p>Create custom experiences</p>
              </div>

              <div className="action-card" onClick={searchHotels}>
                <h3>Search Hotels</h3>
              </div>

              <div className="action-card" onClick={findTourGuides}>
                <h3>Find Tour Guides</h3>
              </div>

              <div className="action-card" onClick={rentVehicles}>
                <h3>Rent Vehicles</h3>
              </div>
            </div>
          </div>
        </>
      );
    }

    if (activeMenuItem === "Hotels") {
      return (
        <div className="hotels-page">
          {/* Hotel Search Banner */}
          <HotelSearchBanner onSearch={handleHotelSearchWithAPI} />

          {/* Search Results or Default Content */}
          <div className="hotels-content">
            {hasSearched ? (
              <div className="search-results">
                <div className="results-header">
                  <h2>
                    {filteredHotels.length} properties found in "
                    {searchCriteria.destination}"
                  </h2>
                  <p>
                    {searchCriteria.checkInDate} → {searchCriteria.checkOutDate}{" "}
                    ·{searchCriteria.adults} adult
                    {searchCriteria.adults !== 1 ? "s" : ""} ·
                    {searchCriteria.children} children
                  </p>
                  <button className="reset-btn" onClick={resetSearch}>
                    View All Hotels
                  </button>
                </div>

                {filteredHotels.length > 0 ? (
                  <div className="hotels-grid-container">
                    {filteredHotels.map((hotel) => (
                      <HotelCart
                        key={hotel._id || hotel.hotel_id}
                        hotel={hotel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No hotels found</h3>
                    <p>
                      Try adjusting your search criteria or browse all available
                      hotels below.
                    </p>
                    <button className="btn btn-primary" onClick={resetSearch}>
                      Browse All Hotels
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="default-hotels-view">
                <div className="intro-section">
                  <h2>Discover Amazing Hotels in Sri Lanka</h2>
                  <p>
                    Browse through our collection of approved hotels and find
                    your perfect stay
                  </p>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h3>Loading amazing hotels...</h3>
                    <p>
                      Please wait while we fetch the best accommodations for you
                    </p>
                  </div>
                ) : hotels.length > 0 ? (
                  <div className="hotels-grid-container">
                    {hotels.map((hotel) => (
                      <HotelCart
                        key={hotel._id || hotel.hotel_id}
                        hotel={hotel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No hotels available</h3>
                    <p>
                      We're working on adding more amazing hotels to our
                      platform. Check back soon for new listings!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeMenuItem === "Tour Guides") {
      return (
        <div className="guides-page">
          <GuideSearchBanner onSearch={handleGuideSearchWithAPI} />

          <div className="guides-content">
            {hasSearchedGuides ? (
              <div className="search-results">
                <div className="results-header">
                  <h2>
                    {filteredGuides.length} guides found who speak "
                    {guideSearchCriteria.language}"
                  </h2>
                  <p>
                    {guideSearchCriteria.checkInDate} →{" "}
                    {guideSearchCriteria.checkOutDate}
                  </p>
                  <button className="reset-btn" onClick={resetGuideSearch}>
                    View All Guides
                  </button>
                </div>

                {filteredGuides.length > 0 ? (
                  <div className="guides-grid-container">
                    {filteredGuides.map((guide) => {
                      console.log(
                        "Rendering GuideCart with guideSearchCriteria:",
                        guideSearchCriteria
                      );
                      return (
                        <GuideCart
                          key={guide._id || guide.guide_id}
                          guide={guide}
                          searchCriteria={guideSearchCriteria}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No tour guides found</h3>
                    <p>
                      Try adjusting your search criteria or browse all available
                      guides below.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={resetGuideSearch}
                    >
                      Browse All Guides
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="default-guides-view">
                <div className="intro-section">
                  <h2>Connect with Experienced Local Guides</h2>
                  <p>
                    Use the search above to find the perfect tour guide for your
                    Sri Lankan adventure, or browse our featured guides below
                  </p>
                </div>

                {isLoading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <h3>Finding amazing guides...</h3>
                    <p>
                      Please wait while we connect you with the best local
                      experts
                    </p>
                  </div>
                ) : guides.length > 0 ? (
                  <div className="guides-grid-container">
                    {guides.map((guide) => (
                      <GuideCart
                        key={guide._id || guide.guide_id}
                        guide={guide}
                        searchCriteria={null}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <h3>No tour guides available</h3>
                    <p>
                      We're working on connecting with more amazing local
                      guides. Check back soon for new profiles!
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeMenuItem === "Vehicles") {
      return <VehicleSection />;
    }

    if (activeMenuItem === "Trip Planner") {
      return (
        <div>
          <h1>Trip Planner</h1>
          <p>Plan your perfect Sri Lankan adventure</p>

          <div
            style={{
              background: "white",
              padding: "30px",
              border: "1px solid #ddd",
              marginTop: "30px",
            }}
          >
            <h3>Create New Itinerary</h3>
            <div style={{ marginTop: "20px" }}>
              <input
                type="text"
                placeholder="Trip Name"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "15px",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="date"
                style={{
                  width: "48%",
                  padding: "10px",
                  marginRight: "4%",
                  border: "1px solid #ddd",
                }}
              />
              <input
                type="date"
                style={{
                  width: "48%",
                  padding: "10px",
                  border: "1px solid #ddd",
                }}
              />
              <button
                className="btn btn-primary"
                style={{ marginTop: "15px", width: "100%" }}
              >
                Create Itinerary
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (activeMenuItem === "My Bookings") {
      const currentDate = new Date();

      // Hotel bookings filtering
      const upcomingHotels = bookings.filter(
        (b) => new Date(b.check_in_date) >= currentDate
      );
      const pastHotels = bookings.filter(
        (b) => new Date(b.check_out_date) < currentDate
      );

      // Guide bookings filtering (assuming similar date structure)
      const upcomingGuides = guiderbooking.filter(
        (b) => new Date(b.start_date || b.check_in_date) >= currentDate
      );
      const pastGuides = guiderbooking.filter(
        (b) => new Date(b.end_date || b.check_out_date) < currentDate
      );

      // Hotel Booking Card Component
      const HotelBookingCard = ({ booking }) => (
        <div className="booking-card hotel-booking">
          <div className="booking-header">
            <h3>{booking.hotel_name}</h3>
            <span className="booking-type">🏨 Hotel</span>
          </div>
          <div className="booking-details">
            <p>
              <strong>Check-in:</strong>{" "}
              {new Date(booking.check_in_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Check-out:</strong>{" "}
              {new Date(booking.check_out_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Room Type:</strong> {booking.room_type || "Standard"}
            </p>
            <p>
              <strong>Guests:</strong> {booking.adults || 1} adults,{" "}
              {booking.children || 0} children
            </p>
            <p>
              <strong>Total Amount:</strong> ${booking.total_amount || "N/A"}
            </p>
          </div>
          <div className="booking-status">
            <span className={`status-badge ${booking.booking_status}`}>
              {booking.booking_status?.toUpperCase() || "PENDING"}
            </span>
          </div>
          <div className="booking-footer">
            <small>
              Booked on: {new Date(booking.date).toLocaleDateString()}
            </small>
            <div className="booking-actions">
              {/* <button className="btn-small btn-primary">View Details</button> */}
              {booking.booking_status === "confirmed" &&
                new Date(booking.check_in_date) > currentDate && (
                  <button className="btn-small btn-secondary">Modify</button>
                )}
            </div>
          </div>
        </div>
      );

      // Guide Booking Card Component
      const GuideBookingCard = ({ booking }) => (
        <div className="booking-card guide-booking">
          <div className="booking-header">
            <h3>{booking.guide_name || "Tour Guide"}</h3>
            <span className="booking-type">👥 Guide</span>
          </div>
          <div className="booking-details">
            <p>
              <strong>Start Date:</strong>{" "}
              {new Date(
                booking.start_date || booking.check_in_date
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>End Date:</strong>{" "}
              {new Date(
                booking.end_date || booking.check_out_date
              ).toLocaleDateString()}
            </p>
            <p>
              <strong>Language:</strong> {booking.language || "English"}
            </p>
            <p>
              <strong>Location:</strong> {booking.location || "Sri Lanka"}
            </p>
            <p>
              <strong>Duration:</strong> {booking.duration || "Full Day"}
            </p>
            <p>
              <strong>Total Amount:</strong> $
              {booking.total_amount || booking.price || "N/A"}
            </p>
          </div>
          <div className="booking-status">
            <span
              className={`status-badge ${
                booking.booking_status || booking.status
              }`}
            >
              {(booking.booking_status || booking.status)?.toUpperCase() ||
                "PENDING"}
            </span>
          </div>
          <div className="booking-footer">
            <small>
              Booked on:{" "}
              {new Date(
                booking.booking_date || booking.date
              ).toLocaleDateString()}
            </small>
            <div className="booking-actions">
              {/* <button className="btn-small btn-primary">View Details</button> */}
              {/* <button className="btn-small btn-secondary">Contact Guide</button> */}
            </div>
          </div>
        </div>
      );

      return (
        <div className="bookings-page">
          <div className="page-header">
            <h1>My Bookings</h1>
            <p>Manage all your hotel and guide reservations</p>
          </div>

          {bookingsLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3>Loading your bookings...</h3>
              <p>Please wait while we fetch your reservations</p>
            </div>
          ) : bookingsError ? (
            <div className="error-container">
              <h3>Error Loading Bookings</h3>
              <p>{bookingsError}</p>
              <button
                className="btn btn-primary"
                onClick={() => setBookingsFetched(false)}
              >
                Retry Loading
              </button>
            </div>
          ) : (
            <div className="bookings-content">
              {/* Booking Statistics */}
              <div className="booking-stats">
                <div className="stat-item">
                  <span className="stat-number">
                    {upcomingHotels.length + upcomingGuides.length}
                  </span>
                  <span className="stat-label">Upcoming Bookings</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {pastHotels.length + pastGuides.length}
                  </span>
                  <span className="stat-label">Completed Trips</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{upcomingHotels.length}</span>
                  <span className="stat-label">Hotel Stays</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{upcomingGuides.length}</span>
                  <span className="stat-label">Guide Tours</span>
                </div>
              </div>

              {/* Upcoming Bookings Section */}
              <div className="bookings-section">
                <div className="section-header">
                  <h2>🕐 Upcoming Bookings</h2>
                  <span className="section-count">
                    {upcomingHotels.length + upcomingGuides.length} bookings
                  </span>
                </div>

                {upcomingHotels.length + upcomingGuides.length > 0 ? (
                  <div className="bookings-grid">
                    {upcomingHotels.map((booking) => (
                      <HotelBookingCard
                        key={`hotel-${booking.hotel_booking_id}`}
                        booking={booking}
                      />
                    ))}
                    {upcomingGuides.map((booking, index) => (
                      <GuideBookingCard
                        key={`guide-${booking.guide_booking_id || index}`}
                        booking={booking}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>No upcoming bookings</h3>
                    <p>Ready to plan your next adventure?</p>
                    <div className="empty-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleMenuItemClick("Hotels")}
                      >
                        Book a Hotel
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleMenuItemClick("Tour Guides")}
                      >
                        Find a Guide
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Past Bookings Section */}
              <div className="bookings-section">
                <div className="section-header">
                  <h2>📅 Past Bookings</h2>
                  <span className="section-count">
                    {pastHotels.length + pastGuides.length} completed
                  </span>
                </div>

                {pastHotels.length + pastGuides.length > 0 ? (
                  <div className="bookings-grid">
                    {pastHotels.map((booking) => (
                      <HotelBookingCard
                        key={`past-hotel-${booking.hotel_booking_id}`}
                        booking={booking}
                      />
                    ))}
                    {pastGuides.map((booking, index) => (
                      <GuideBookingCard
                        key={`past-guide-${booking.guide_booking_id || index}`}
                        booking={booking}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <h3>No past bookings</h3>
                    <p>
                      Your travel history will appear here once you complete
                      your first trip.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeMenuItem === "Profile") {
      const LoadingState = () => (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading your profile...</h3>
          <p>Please wait while we fetch your account details</p>
        </div>
      );

      const ErrorState = () => (
        <div className="error-container">
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⚠️</div>
          <h3>Unable to Load Profile</h3>
          <p>{profileError}</p>
          <div
            style={{
              display: "flex",
              gap: "15px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <button
              className="btn btn-secondary"
              onClick={() => setProfileError(null)}
            >
              Dismiss
            </button>
            <button className="btn btn-primary" onClick={fetchProfile}>
              Try Again
            </button>
          </div>
        </div>
      );

      return (
        <div className="profile-page">
          <div className="page-header">
            <div>
              <h1>My Profile</h1>
              <p>Manage your account details and preferences</p>
            </div>
            <div className="header-actions">
              <button
                className="btn btn-secondary"
                onClick={fetchProfile}
                disabled={profileLoading}
              >
                {profileLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {profileLoading && <LoadingState />}
          {profileError && !profileLoading && <ErrorState />}

          {!profileLoading && !profileError && (
            <div className="profile-content">
              <div className="profile-card">
                <div className="profile-card-header">
                  <h2>Account Information</h2>
                  <div className="profile-avatar">
                    <div className="avatar-circle">
                      {profile?.fullname
                        ? profile.fullname.charAt(0).toUpperCase()
                        : "T"}
                    </div>
                  </div>
                </div>

                <div className="profile-details">
                  <div className="profile-item">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="profile-input disabled"
                    />
                    <small className="field-note">
                      Email cannot be changed
                    </small>
                  </div>

                  <div className="profile-item">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`profile-input ${
                        !isEditing ? "disabled" : ""
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="profile-item">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`profile-input ${
                        !isEditing ? "disabled" : ""
                      }`}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {profile && (
                    <div className="profile-item">
                      {/* <label>Member Since</label> */}
                      {/* <span className="member-since">
                                        {new Date(profile.createdAt || profile.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span> */}
                    </div>
                  )}
                </div>

                <div className="profile-actions">
                  {!isEditing ? (
                    <button
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <span className="btn-icon">✏️</span>
                      Edit Profile
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button
                        className="btn btn-primary"
                        onClick={handleProfileSave}
                      >
                        <span className="btn-icon">💾</span>
                        Save Changes
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setFormData({
                            email: profile.email || "",
                            name: profile.fullname || "",
                            phone: profile.phone || "",
                          });
                          setIsEditing(false);
                        }}
                      >
                        <span className="btn-icon">❌</span>
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Profile Stats */}
              <div className="profile-stats">
                <h3>Your Travel Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <div className="stat-icon">🏨</div>
                    <div className="stat-content">
                      <span className="stat-number">{bookings.length}</span>
                      <span className="stat-label">Hotel Bookings</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">👥</div>
                    <div className="stat-content">
                      <span className="stat-number">
                        {guiderbooking.length}
                      </span>
                      <span className="stat-label">Guide Tours</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">📅</div>
                    <div className="stat-content">
                      <span className="stat-number">
                        {bookings.length + guiderbooking.length}
                      </span>
                      <span className="stat-label">Total Trips</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <span className="stat-number">4.8</span>
                      <span className="stat-label">Avg Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div>
        <h1>{activeMenuItem}</h1>
        <p>Content for {activeMenuItem} coming soon...</p>
      </div>
    );
  };

  return (
    <div>
      <style>{`
                * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #333;
    line-height: 1.6;
}

.main-container {
    display: flex;
    min-height: 100vh;
}

/* Enhanced Header */
.header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 15px 30px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.logo {
    font-size: 24px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.search-bar {
    flex: 1;
    max-width: 500px;
    margin: 0 30px;
    position: relative;
}

.search-bar input {
    width: 100%;
    padding: 12px 20px;
    border: 2px solid transparent;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    font-size: 16px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.search-bar input:focus {
    outline: none;
    border-color: #667eea;
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.user-section {
    display: flex;
    align-items: center;
    gap: 20px;
}

.notification {
    position: relative;
    padding: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.notification:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.notification::after {
    content: '1';
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 16px;
    border-radius: 25px;
    background: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    position: relative;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-profile:hover {
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 12px;
    min-width: 220px;
    z-index: 1000;
    display: none;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.dropdown-menu.show {
    display: block;
}

.dropdown-header {
    padding: 16px 20px;
    font-weight: 600;
    color: #333;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 1px solid #eee;
}

.dropdown-item {
    padding: 14px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #555;
}

.dropdown-item:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.user-avatar {
    width: 35px;
    height: 35px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 16px;
}

/* Enhanced Sidebar */
.sidebar {
    width: 280px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 80px;
    position: fixed;
    height: calc(100vh - 80px);
    overflow-y: auto;
    box-shadow: 8px 0 32px rgba(0, 0, 0, 0.1);
}

.sidebar-item {
    padding: 18px 25px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
    margin: 4px 12px;
    border-radius: 12px;
    font-weight: 500;
}

.sidebar-item:hover {
    background: rgba(102, 126, 234, 0.1);
    transform: translateX(5px);
}

.sidebar-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.sidebar-item span:first-child {
    font-size: 20px;
    width: 24px;
    text-align: center;
}

/* Enhanced Main Content */
.main-content {
    flex: 1;
    margin-left: 280px;
    margin-top: 80px;
    padding: 0;
    background: transparent;
}

/* Enhanced Welcome Section */
.welcome-section {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 40px;
    margin: 20px;
    border-radius: 20px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.welcome-section::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: float 6s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(180deg); }
}

.welcome-section h1 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 15px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.welcome-section p {
    font-size: 18px;
    margin-bottom: 30px;
    opacity: 0.9;
    max-width: 600px;
}

.action-buttons {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.btn {
    padding: 14px 28px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
}

.btn-primary {
    background: white;
    color: #667eea;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: #667eea;
    transform: translateY(-3px);
}

/* Enhanced Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 25px;
    margin: 25px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 30px;
    border-radius: 20px;
    text-align: center;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

.stat-card .number {
    font-size: 36px;
    font-weight: 800;
    margin-bottom: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.stat-card .label {
    color: #666;
    margin-bottom: 8px;
    font-weight: 600;
    font-size: 16px;
}

.stat-card .change {
    font-size: 14px;
    font-weight: 500;
}

.change.positive {
    color: #27ae60;
}

.change.negative {
    color: #e74c3c;
}

/* Enhanced Quick Actions */
.quick-actions {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 40px;
    margin: 25px;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.quick-actions h2 {
    margin-bottom: 30px;
    font-size: 28px;
    color: #333;
    font-weight: 700;
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 25px;
}

.action-card {
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    overflow: hidden;
}

.action-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
    transition: left 0.5s;
}

.action-card:hover::before {
    left: 100%;
}

.action-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.2);
    background: white;
}

.action-card h3 {
    margin-bottom: 12px;
    font-size: 18px;
    color: #333;
    font-weight: 600;
}

.action-card p {
    font-size: 14px;
    color: #666;
    line-height: 1.5;
}

/* Enhanced Search Banners */
.hotel-search-banner, .guide-search-banner {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 80px 20px;
    text-align: center;
    position: relative;
    overflow: hidden;
}

.hotel-search-banner::before, .guide-search-banner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.3;
    animation: grain 20s linear infinite;
}

@keyframes grain {
    0%, 100% { transform: translate(0, 0); }
    25% { transform: translate(-2px, -2px); }
    50% { transform: translate(2px, 2px); }
    75% { transform: translate(-1px, 1px); }
}

.banner-content h1 {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 20px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 2;
}

.banner-content p {
    font-size: 20px;
    margin-bottom: 40px;
    opacity: 0.9;
    position: relative;
    z-index: 2;
}

.search-form {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 12px;
    display: flex;
    gap: 8px;
    max-width: 1000px;
    margin: 0 auto;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    position: relative;
    z-index: 2;
}

.search-field {
    background: white;
    border: none;
    border-radius: 12px;
    padding: 20px;
    flex: 1;
    min-height: 60px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s ease;
}

.search-field:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.field-label {
    font-size: 12px;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.field-icon {
    color: #667eea;
}

.field-input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 16px;
    color: #333;
    background: transparent;
    font-weight: 500;
}

.field-input::placeholder {
    color: #999;
}

.search-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 20px 32px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.search-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
}

/* Enhanced Content Areas */
.hotels-content, .guides-content {
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;
}

.results-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 30px;
    border-radius: 16px;
    margin-bottom: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.results-header h2 {
    color: #333;
    margin-bottom: 10px;
    font-size: 24px;
    font-weight: 700;
}

.results-header p {
    color: #666;
    font-size: 16px;
}

.reset-btn {
    background: transparent;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 10px 20px;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.reset-btn:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
}

.hotels-grid-container, .guides-grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 25px;
    padding: 20px 0;
}

.intro-section {
    padding: 50px 30px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    margin: 30px 0;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.intro-section h2 {
    color: #333;
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: 700;
}

.intro-section p {
    color: #666;
    font-size: 18px;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
}

.loading-container {
    text-align: center;
    padding: 80px 20px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
    display: inline-block;
    width: 50px;
    height: 50px;
    border: 4px solid rgba(102, 126, 234, 0.3);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 25px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-container h3 {
    color: #333;
    font-size: 24px;
    margin-bottom: 15px;
    font-weight: 600;
}

.loading-container p {
    color: #666;
    font-size: 16px;
}

.no-results {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 80px;
    text-align: center;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    margin: 30px 0;
}

.no-results h3 {
    color: #333;
    margin-bottom: 20px;
    font-size: 28px;
    font-weight: 700;
}

.no-results p {
    color: #666;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.6;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .sidebar {
        width: 250px;
    }
    .main-content {
        margin-left: 250px;
    }
}

@media (max-width: 968px) {
    .sidebar {
        transform: translateX(-100%);
        transition: transform 0.3s ease;
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .stats-grid {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .actions-grid {
        grid-template-columns: 1fr;
    }

    .search-form {
        flex-direction: column;
        gap: 12px;
    }
    
    .search-field {
        min-height: 50px;
    }

    .banner-content h1 {
        font-size: 36px;
    }
    
    .banner-content p {
        font-size: 18px;
    }
    
    .hotels-grid-container, .guides-grid-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .results-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
    }
}

@media (max-width: 576px) {
    .header {
        padding: 12px 20px;
    }
    
    .search-bar {
        margin: 0 15px;
    }
    
    .welcome-section {
        padding: 40px 25px;
        margin: 15px;
    }
    
    .welcome-section h1 {
        font-size: 28px;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
        gap: 15px;
        margin: 15px;
    }
    
    .quick-actions {
        padding: 25px;
        margin: 15px;
    }
    
    .hotels-content, .guides-content {
        padding: 20px;
    }
    
    .intro-section {
        padding: 30px 20px;
        margin: 20px 0;
    }
    
    .no-results {
        padding: 50px 25px;
    }
    
    .banner-content h1 {
        font-size: 28px;
    }
    
    .banner-content p {
        font-size: 16px;
    }
}
    /* Enhanced Bookings Page Styles */
.bookings-page {
    padding: 40px;
    max-width: 1400px;
    margin: 0 auto;
}

.page-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 40px;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.page-header h1 {
    color: #333;
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 15px;
}

.page-header p {
    color: #666;
    font-size: 18px;
}

/* Booking Statistics */
.booking-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 40px;
}

.stat-item {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 30px;
    border-radius: 16px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.stat-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.stat-number {
    display: block;
    font-size: 32px;
    font-weight: 800;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 14px;
    color: #666;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Bookings Sections */
.bookings-section {
    margin-bottom: 50px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    padding: 0 10px;
}

.section-header h2 {
    color: #333;
    font-size: 24px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
}

.section-count {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
}

/* Bookings Grid */
.bookings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 25px;
}

/* Booking Cards */
.booking-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.booking-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.booking-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.hotel-booking::before {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.guide-booking::before {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* Booking Card Header */
.booking-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
}

.booking-header h3 {
    color: #333;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
    flex: 1;
}

.booking-type {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    margin-left: 15px;
}

.guide-booking .booking-type {
    background: rgba(240, 147, 251, 0.1);
    color: #f093fb;
}

/* Booking Details */
.booking-details {
    margin-bottom: 20px;
}

.booking-details p {
    margin: 8px 0;
    color: #555;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.booking-details strong {
    color: #333;
    font-weight: 600;
    min-width: 100px;
}

/* Status Badge */
.booking-status {
    margin-bottom: 20px;
}

.status-badge {
    display: inline-block;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.status-badge.confirmed {
    background: rgba(39, 174, 96, 0.1);
    color: #27ae60;
}

.status-badge.pending {
    background: rgba(243, 156, 18, 0.1);
    color: #f39c12;
}

.status-badge.cancelled {
    background: rgba(231, 76, 60, 0.1);
    color: #e74c3c;
}

.status-badge.completed {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
}

/* Booking Footer */
.booking-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px solid #eee;
}

.booking-footer small {
    color: #888;
    font-size: 12px;
}

.booking-actions {
    display: flex;
    gap: 10px;
}

.btn-small {
    padding: 8px 16px;
    border: none;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.btn-small.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-small.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.btn-small.btn-secondary {
    background: transparent;
    color: #667eea;
    border: 1px solid #667eea;
}

.btn-small.btn-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
}

/* Empty States */
.empty-state {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 60px 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.empty-state h3 {
    color: #333;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
}

.empty-state p {
    color: #666;
    font-size: 16px;
    margin-bottom: 30px;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
}

.empty-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

/* Error Container */
.error-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 60px 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
}

.error-container h3 {
    color: #e74c3c;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
}

.error-container p {
    color: #666;
    font-size: 16px;
    margin-bottom: 30px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .bookings-page {
        padding: 20px;
    }
    
    .booking-stats {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .bookings-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .booking-card {
        padding: 20px;
    }
    
    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .booking-footer {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .booking-actions {
        width: 100%;
        justify-content: flex-end;
    }
    
    .empty-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .empty-actions .btn {
        min-width: 200px;
    }
}

@media (max-width: 480px) {
    .booking-stats {
        grid-template-columns: 1fr;
    }
    
    .booking-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .booking-type {
        margin-left: 0;
    }
    
    .booking-details p {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
    
    .page-header {
        padding: 30px 20px;
    }
    
    .page-header h1 {
        font-size: 28px;
    }
}
    .profile-page {
    padding: 40px;
    max-width: 1000px;
    margin: 0 auto;
}

.profile-content {
    display: grid;
    gap: 30px;
}

.profile-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.profile-card-header h2 {
    color: #333;
    font-size: 28px;
    font-weight: 700;
    margin: 0;
}

.profile-avatar {
    display: flex;
    align-items: center;
    gap: 15px;
}

.avatar-circle {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.profile-details {
    display: grid;
    gap: 25px;
    margin-bottom: 30px;
}

.profile-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.profile-item label {
    font-weight: 600;
    color: #374151;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.profile-input {
    padding: 15px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    color: #333;
    background: white;
    transition: all 0.3s ease;
    font-family: inherit;
}

.profile-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
}

.profile-input.disabled {
    background: #f9fafb;
    color: #6b7280;
    border-color: #e5e7eb;
    cursor: not-allowed;
}

.field-note {
    color: #6b7280;
    font-size: 12px;
    font-style: italic;
}

.account-type-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 14px;
    width: fit-content;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.badge-icon {
    font-size: 16px;
}

.member-since {
    color: #6b7280;
    font-size: 16px;
    font-weight: 500;
}

.profile-actions {
    display: flex;
    justify-content: center;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.edit-actions {
    display: flex;
    gap: 15px;
}

.btn-icon {
    margin-right: 8px;
}

/* Profile Stats */
.profile-stats {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.profile-stats h3 {
    color: #333;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    text-align: center;
}

.profile-stats .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}

.profile-stats .stat-item {
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    padding: 25px;
    border-radius: 16px;
    display: flex;
    align-items: center;
    gap: 15px;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.05);
}

.profile-stats .stat-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    background: white;
}

.stat-icon {
    font-size: 30px;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.stat-content {
    display: flex;
    flex-direction: column;
}

.stat-number {
    font-size: 24px;
    font-weight: 800;
    color: #333;
    line-height: 1;
}

.stat-label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Error and Loading States */
.error-container {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    padding: 60px 40px;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border-left: 4px solid #e74c3c;
    margin: 20px;
}

.error-container h3 {
    color: #e74c3c;
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 15px;
}

.error-container p {
    color: #666;
    font-size: 16px;
    margin-bottom: 30px;
}

/* Responsive Design */
@media (max-width: 768px) {
    .profile-page {
        padding: 20px;
    }
    
    .profile-card {
        padding: 25px;
    }
    
    .profile-card-header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
    }
    
    .edit-actions {
        flex-direction: column;
        width: 100%;
    }
    
    .profile-stats .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
    }
    
    .profile-stats .stat-item {
        padding: 20px;
    }
}

@media (max-width: 480px) {
    .profile-stats .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .profile-card-header h2 {
        font-size: 24px;
    }
    
    .avatar-circle {
        width: 50px;
        height: 50px;
        font-size: 20px;
    }
}
    
        /* Vehicle Search Banner */
        .vehicle-search-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 80px 20px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .vehicle-search-banner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
          opacity: 0.3;
          animation: grain 20s linear infinite;
        }

        @keyframes grain {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-2px, -2px); }
          50% { transform: translate(2px, 2px); }
          75% { transform: translate(-1px, 1px); }
        }

        .banner-content h1 {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 2;
        }

        .banner-content p {
          font-size: 20px;
          margin-bottom: 40px;
          opacity: 0.9;
          position: relative;
          z-index: 2;
        }

        .search-form {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 12px;
          display: flex;
          gap: 8px;
          max-width: 1000px;
          margin: 0 auto;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 2;
        }

        .search-field {
          background: white;
          border: none;
          border-radius: 12px;
          padding: 20px;
          flex: 1;
          min-height: 60px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-field:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .field-label {
          font-size: 12px;
          font-weight: 600;
          color: #667eea;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-icon {
          color: #667eea;
        }

        .field-input {
          border: none;
          outline: none;
          width: 100%;
          font-size: 16px;
          color: #333;
          background: transparent;
          font-weight: 500;
        }

        .field-input::placeholder {
          color: #999;
        }

        .search-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 20px 32px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .search-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(102, 126, 234, 0.4);
        }

        /* Vehicle Cards */
        .vehicles-content {
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .results-header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 30px;
          border-radius: 16px;
          margin-bottom: 30px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .results-header h2 {
          color: #333;
          margin-bottom: 10px;
          font-size: 24px;
          font-weight: 700;
        }

        .results-header p {
          color: #666;
          font-size: 16px;
        }

        .reset-btn {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
          padding: 10px 20px;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reset-btn:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        .vehicles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 30px;
          padding: 20px 0;
        }

        .vehicle-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .vehicle-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .vehicle-image-container {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .vehicle-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .vehicle-card:hover .vehicle-image {
          transform: scale(1.05);
        }

        .vehicle-type-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #333;
        }

        .status-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          color: white;
          padding: 6px 12px;
          border-radius: 15px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .vehicle-details {
          padding: 25px;
        }

        .vehicle-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .vehicle-title {
          font-size: 20px;
          font-weight: 700;
          color: #333;
          margin: 0;
        }

        .vehicle-rating {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          color: #666;
        }

        .vehicle-info {
          margin-bottom: 15px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .info-label {
          color: #666;
          font-weight: 500;
        }

        .info-value {
          color: #333;
          font-weight: 600;
        }

        .vehicle-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .feature {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .vehicle-pricing {
          margin-bottom: 20px;
          padding: 15px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
        }

        .price-info {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 5px;
        }

        .price-per-day {
          font-size: 24px;
          font-weight: 800;
          color: #667eea;
        }

        .price-label {
          font-size: 14px;
          color: #666;
        }

        .total-price {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .total-amount {
          font-size: 18px;
          font-weight: 700;
          color: #333;
        }

        .total-label {
          font-size: 12px;
          color: #666;
        }

        .vehicle-actions {
          display: flex;
          gap: 12px;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          background: #ccc;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-secondary {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-secondary:hover {
          background: #667eea;
          color: white;
          transform: translateY(-2px);
        }

        /* Booking Modal */
        .booking-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .booking-modal {
          background: white;
          border-radius: 20px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 25px 30px;
          border-bottom: 1px solid #eee;
        }

        .booking-header h2 {
          margin: 0;
          color: #333;
          font-size: 24px;
          font-weight: 700;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f5f5f5;
          color: #333;
        }

        .booking-content {
          padding: 30px;
        }

        .vehicle-summary {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          padding: 20px;
          background: rgba(102, 126, 234, 0.05);
          border-radius: 12px;
        }

        .summary-image {
          width: 120px;
          height: 80px;
          object-fit: cover;
          border-radius: 8px;
        }

        .summary-details h3 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 18px;
          font-weight: 600;
        }

        .summary-details p {
          margin: 4px 0;
          color: #666;
          font-size: 14px;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        .form-input, .form-textarea {
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .booking-summary {
          background: rgba(102, 126, 234, 0.05);
          padding: 20px;
          border-radius: 12px;
          margin: 20px 0;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
        }

        .summary-row.total {
          border-top: 1px solid #ddd;
          padding-top: 12px;
          margin-top: 12px;
          font-size: 16px;
          font-weight: 700;
          color: #333;
        }

        .booking-actions {
          display: flex;
          gap: 15px;
          margin-top: 30px;
        }

        .booking-actions .btn-primary,
        .booking-actions .btn-secondary {
          flex: 1;
          padding: 15px 25px;
          font-size: 16px;
        }

        /* Loading and Empty States */
        .loading-container {
          text-align: center;
          padding: 80px 20px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          margin: 30px 0;
        }

        .loading-spinner {
          display: inline-block;
          width: 50px;
          height: 50px;
          border: 4px solid rgba(102, 126, 234, 0.3);
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 25px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .loading-container h3 {
          color: #333;
          font-size: 24px;
          margin-bottom: 15px;
          font-weight: 600;
        }

        .loading-container p {
          color: #666;
          font-size: 16px;
        }

        .no-results {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          padding: 80px;
          text-align: center;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          margin: 30px 0;
        }

        .no-results h3 {
          color: #333;
          margin-bottom: 20px;
          font-size: 28px;
          font-weight: 700;
        }

        .no-results p {
          color: #666;
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.6;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }

        .intro-section {
          padding: 50px 30px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          margin: 30px 0;
          border-radius: 20px;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .intro-section h2 {
          color: #333;
          margin-bottom: 20px;
          font-size: 32px;
          font-weight: 700;
        }

        .intro-section p {
          color: #666;
          font-size: 18px;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .search-form {
            flex-direction: column;
            gap: 12px;
          }
          
          .search-field {
            min-height: 50px;
          }

          .banner-content h1 {
            font-size: 36px;
          }
          
          .banner-content p {
            font-size: 18px;
          }
          
          .vehicles-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }

          .vehicle-actions {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: column;
          }

          .vehicle-summary {
            flex-direction: column;
          }

          .summary-image {
            width: 100%;
            height: 150px;
          }
        }

        @media (max-width: 576px) {
          .vehicles-content {
            padding: 20px;
          }
          
          .intro-section {
            padding: 30px 20px;
            margin: 20px 0;
          }
          
          .no-results {
            padding: 50px 25px;
          }
          
          .banner-content h1 {
            font-size: 28px;
          }
          
          .banner-content p {
            font-size: 16px;
          }

          .vehicle-details {
            padding: 20px;
          }

          .booking-modal {
            margin: 10px;
          }

          .booking-header, .booking-content {
            padding: 20px;
          }
        }
      
            `}</style>

      <div className="header">
        <div className="logo">TourNexus</div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search hotels, guides, destinations..."
          />
        </div>

        <div className="user-section">
          {/* <div className="notification"></div>
          <div className="user-profile" onClick={toggleDropdown}>
            <span style={{ marginLeft: "5px" }}>Switch Account▼</span>

            <div className={`dropdown-menu ${showDropdown ? "show" : ""}`}>
              <div className="dropdown-header">Move Account</div>
              <div
                className="dropdown-item"
                onClick={() => moveToAccount("Guide")}
              >
                Guide
              </div>
              <div
                className="dropdown-item"
                onClick={() => moveToAccount("Hotel Owner")}
              >
                Hotel Owner
              </div>
              <div
                className="dropdown-item"
                onClick={() => moveToAccount("Vehicle Rental Company")}
              >
                Vehicle Rental Company
              </div>
            </div>
          </div> */}
        </div>
      </div>

      <div className="main-container">
        <div className="sidebar">
          <div
            className={`sidebar-item ${
              activeMenuItem === "Dashboard" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Dashboard")}
          >
            <span>📊</span>
            <span>Dashboard</span>
          </div>
          <div
            className={`sidebar-item ${
              activeMenuItem === "Hotels" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Hotels")}
          >
            <span>🏨</span>
            <span>Hotels</span>
          </div>
          <div
            className={`sidebar-item ${
              activeMenuItem === "Tour Guides" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Tour Guides")}
          >
            <span>👥</span>
            <span>Tour Guides</span>
          </div>
          <div
            className={`sidebar-item ${
              activeMenuItem === "Vehicles" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Vehicles")}
          >
            <span>🚗</span>
            <span>Vehicles</span>
          </div>
          <div
            className={`sidebar-item ${
              activeMenuItem === "Trip Planner" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Trip Planner")}
          >
            <span>📝</span>
            <span>Trip Planner</span>
          </div>
          <div
            className={`sidebar-item ${
              activeMenuItem === "My Bookings" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("My Bookings")}
          >
            <span>📋</span>
            <span>My Bookings</span>
          </div>
          {/* <div className={`sidebar-item ${activeMenuItem === 'Favorites' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Favorites')}>
                        <span>🚗</span>
                        <span>Vehicles</span>
                    </div> */}
          {/* <div className={`sidebar-item ${activeMenuItem === 'Messages' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Messages')}>
                        <span>💬</span>
                        <span>Messages</span>
                    </div> */}
          <div
            className={`sidebar-item ${
              activeMenuItem === "Profile" ? "active" : ""
            }`}
            onClick={() => handleMenuItemClick("Profile")}
          >
            <span>👤</span>
            <span>Profile</span>
          </div>
          {/* <div className={`sidebar-item ${activeMenuItem === 'Settings' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Settings')}>
                        <span>⚙️</span>
                        <span>Settings</span>
                    </div> */}
          <div
            className={`sidebar-item ${
              activeMenuItem === "Logout" ? "active" : ""
            }`}
            onClick={() => handleLogout("Logout")}
          >
            <span>⚙️</span>
            <span>LogOut</span>
          </div>
        </div>

        <div className="main-content">{renderContent()}</div>
      </div>
    </div>
  );
}
