import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Vehicle Search Banner Component
const VehicleSearchBanner = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    branch_name: "",
    check_in_date: "",
    check_out_date: "",
  });

  const branches = [
    "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
    "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
    "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
    "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa",
    "Badulla", "Monaragala", "Ratnapura", "Kegalle"
  ];

  const handleInputChange = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    if (!searchData.branch_name) {
      alert("Please select a branch");
      return;
    }
    if (!searchData.check_in_date || !searchData.check_out_date) {
      alert("Please select both check-in and check-out dates");
      return;
    }
    if (new Date(searchData.check_in_date) >= new Date(searchData.check_out_date)) {
      alert("Check-out date must be after check-in date");
      return;
    }
    onSearch(searchData);
  };

  return (
    <div className="vehicle-search-banner">
      <div className="banner-content">
        <h1>Find your perfect vehicle</h1>
        <p>Explore Sri Lanka with reliable transportation...</p>

        <div className="search-form">
          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">🏢</span>
              Branch Location
            </div>
            <select
              className="field-input"
              value={searchData.branch_name}
              onChange={(e) => handleInputChange("branch_name", e.target.value)}
            >
              <option value="">Select Branch</option>
              {branches.map((branch, idx) => (
                <option key={idx} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">📅</span>
              Pickup Date
            </div>
            <input
              type="date"
              className="field-input"
              value={searchData.check_in_date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => handleInputChange("check_in_date", e.target.value)}
            />
          </div>

          <div className="search-field">
            <div className="field-label">
              <span className="field-icon">📅</span>
              Return Date
            </div>
            <input
              type="date"
              className="field-input"
              value={searchData.check_out_date}
              min={searchData.check_in_date || new Date().toISOString().split("T")[0]}
              onChange={(e) => handleInputChange("check_out_date", e.target.value)}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Find Vehicles
          </button>
        </div>
      </div>
    </div>
  );
};

// Vehicle Card Component
const VehicleCard = ({ vehicle, onBook, searchCriteria }) => {
  const calculateDuration = () => {
    if (!searchCriteria?.check_in_date || !searchCriteria?.check_out_date) return 1;
    const startDate = new Date(searchCriteria.check_in_date);
    const endDate = new Date(searchCriteria.check_out_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const duration = calculateDuration();
  const totalAmount = duration * vehicle.price_per_day;

  const getVehicleTypeIcon = (type) => {
    switch(type) {
      case 'car': return '🚗';
      case 'van': return '🚐';
      case 'motorbike': return '🏍️';
      case 'tuk_tuk': return '🛺';
      default: return '🚙';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return '#27ae60';
      case 'booked': return '#e74c3c';
      case 'maintenance': return '#f39c12';
      default: return '#667eea';
    }
  };

  return (
    <div className="vehicle-card">
      <div className="vehicle-image-container">
        <img 
          src={vehicle.images[0]} 
          alt={vehicle.vehicle_model}
          className="vehicle-image"
        />
        <div className="vehicle-type-badge">
          <span className="type-icon">{getVehicleTypeIcon(vehicle.vehicle_type)}</span>
          <span className="type-text">{vehicle.vehicle_type.replace('_', ' ').toUpperCase()}</span>
        </div>
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(vehicle.status) }}
        >
          {vehicle.status.toUpperCase()}
        </div>
      </div>
      
      <div className="vehicle-details">
        <div className="vehicle-header">
          <h3 className="vehicle-title">{vehicle.vehicle_model}</h3>
          <div className="vehicle-rating">
            <span className="stars">⭐⭐⭐⭐⭐</span>
            <span className="rating-text">4.8</span>
          </div>
        </div>

        <div className="vehicle-info">
          <div className="info-row">
            <span className="info-label">📍 Branch:</span>
            <span className="info-value">{vehicle.branch_name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">👥 Seats:</span>
            <span className="info-value">{vehicle.seating_capacity} passengers</span>
          </div>
          <div className="info-row">
            <span className="info-label">⛽ Fuel:</span>
            <span className="info-value">{vehicle.fuel_type}</span>
          </div>
          {searchCriteria && (
            <div className="info-row">
              <span className="info-label">📅 Duration:</span>
              <span className="info-value">{duration} day{duration > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="vehicle-features">
          <span className="feature">✅ Air Conditioning</span>
          <span className="feature">✅ GPS Navigation</span>
          <span className="feature">✅ Insurance Included</span>
        </div>

        <div className="vehicle-pricing">
          <div className="price-info">
            <span className="price-per-day">Rs.{vehicle.price_per_day}</span>
            <span className="price-label">per day</span>
          </div>
          {searchCriteria && (
            <div className="total-price">
              <span className="total-amount">Total: Rs.{totalAmount}</span>
              <span className="total-label">for {duration} day{duration > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        <div className="vehicle-actions">
          <button className="btn-secondary" onClick={() => alert('View Details')}>
            View Details
          </button>
          <button 
            className="btn-primary"
            onClick={() => onBook(vehicle)}
            disabled={vehicle.status !== 'available' && vehicle.status !== 'active'}
          >
            {vehicle.status === 'available' || vehicle.status === 'active' ? 'Book Now' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Booking Form Component
const VehicleBookingForm = ({ vehicle, searchCriteria, onClose, onConfirm }) => {
  const [bookingData, setBookingData] = useState({
    tourist_email: localStorage.getItem('email') || '',
    check_in_date: searchCriteria?.check_in_date || '',
    check_out_date: searchCriteria?.check_out_date || '',
    special_requests: ''
  });

  const calculateDuration = () => {
    if (!bookingData.check_in_date || !bookingData.check_out_date) return 1;
    const startDate = new Date(bookingData.check_in_date);
    const endDate = new Date(bookingData.check_out_date);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const duration = calculateDuration();
  const totalAmount = duration * vehicle.price_per_day;

  const handleSubmit = () => {
    if (!bookingData.tourist_email || !bookingData.check_in_date || !bookingData.check_out_date) {
      alert('Please fill in all required fields');
      return;
    }
    
    const bookingPayload = {
      ...bookingData,
      vehicle_id: vehicle.vehicle_id,
      duration,
      total_amount: totalAmount
    };
    
    onConfirm(bookingPayload);
  };

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-header">
          <h2>Book {vehicle.vehicle_model}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="booking-content">
          <div className="vehicle-summary">
            <img src={vehicle.images[0]} alt={vehicle.vehicle_model} className="summary-image" />
            <div className="summary-details">
              <h3>{vehicle.vehicle_model}</h3>
              <p>📍 {vehicle.branch_name}</p>
              <p>👥 {vehicle.seating_capacity} seats • ⛽ {vehicle.fuel_type}</p>
            </div>
          </div>

          <div className="booking-form">
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                value={bookingData.tourist_email}
                onChange={(e) => setBookingData({...bookingData, tourist_email: e.target.value})}
                className="form-input"
                placeholder="your.email@example.com"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Pickup Date *</label>
                <input
                  type="date"
                  value={bookingData.check_in_date}
                  onChange={(e) => setBookingData({...bookingData, check_in_date: e.target.value})}
                  className="form-input"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="form-group">
                <label>Return Date *</label>
                <input
                  type="date"
                  value={bookingData.check_out_date}
                  onChange={(e) => setBookingData({...bookingData, check_out_date: e.target.value})}
                  className="form-input"
                  min={bookingData.check_in_date || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                value={bookingData.special_requests}
                onChange={(e) => setBookingData({...bookingData, special_requests: e.target.value})}
                className="form-textarea"
                placeholder="Any special requirements or requests..."
                rows="3"
              />
            </div>

            <div className="booking-summary">
              <div className="summary-row">
                <span>Duration:</span>
                <span>{duration} day{duration > 1 ? 's' : ''}</span>
              </div>
              <div className="summary-row">
                <span>Rate per day:</span>
                <span>Rs.{vehicle.price_per_day}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>Rs.{totalAmount}</span>
              </div>
            </div>

            <div className="booking-actions">
              <button className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Vehicle Section Component
export default function VehicleSection() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fetch all vehicles on component mount
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/view_all_vehicles`
        );
        if (response.data.success) {
          setVehicles(response.data.data);
          setFilteredVehicles(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to load vehicles");
          setVehicles([]);
          setFilteredVehicles([]);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Handle vehicle search
  const handleVehicleSearch = async (searchData) => {
    try {
      setIsLoading(true);
      setSearchCriteria(searchData);
      setHasSearched(true);

      // Filter vehicles by branch
      const branchFiltered = vehicles.filter(
        vehicle => vehicle.branch_name.toLowerCase() === searchData.branch_name.toLowerCase()
      );

      // Here you would typically call an API to check availability
      // For now, we'll just filter by branch and active status
      const availableVehicles = branchFiltered.filter(
        vehicle => vehicle.status === 'available' || vehicle.status === 'active'
      );

      setFilteredVehicles(availableVehicles);
    } catch (error) {
      console.error("Error searching vehicles:", error);
      setFilteredVehicles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle booking
  const handleBookVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingForm(true);
  };

  // Handle booking confirmation
  const handleBookingConfirm = async (bookingData) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/vehiclebooking/${bookingData.vehicle_id}/book`,
        bookingData
      );

      if (response.data.success) {
        alert('Vehicle booked successfully!');
        setShowBookingForm(false);
        setSelectedVehicle(null);
        // Refresh the vehicle list or update the specific vehicle status
        // You might want to refetch vehicles or update the state
      } else {
        alert('Booking failed: ' + response.data.message);
      }
    } catch (error) {
        const errorMessage = error.response?.data?.message || "An error occurred while booking the vehicle.";
      console.error("Error booking vehicle:", error);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset search
  const resetSearch = () => {
    setHasSearched(false);
    setFilteredVehicles(vehicles);
    setSearchCriteria(null);
  };

  return (
    <div className="vehicles-page">
      <VehicleSearchBanner onSearch={handleVehicleSearch} />

      <div className="vehicles-content">
        {hasSearched ? (
          <div className="search-results">
            <div className="results-header">
              <div>
                <h2>
                  {filteredVehicles.length} vehicles found in "{searchCriteria.branch_name}"
                </h2>
                <p>
                  {searchCriteria.check_in_date} → {searchCriteria.check_out_date}
                </p>
              </div>
              <button className="reset-btn" onClick={resetSearch}>
                View All Vehicles
              </button>
            </div>

            {filteredVehicles.length > 0 ? (
              <div className="vehicles-grid">
                {filteredVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id || vehicle.vehicle_id}
                    vehicle={vehicle}
                    onBook={handleBookVehicle}
                    searchCriteria={searchCriteria}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No vehicles found</h3>
                <p>
                  Try adjusting your search criteria or browse all available
                  vehicles below.
                </p>
                <button className="btn-primary" onClick={resetSearch}>
                  Browse All Vehicles
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="default-vehicles-view">
            <div className="intro-section">
              <h2>Discover Amazing Vehicles in Sri Lanka</h2>
              <p>
                Use the search above to find the perfect vehicle for your
                Sri Lankan adventure, or browse our featured vehicles below
              </p>
            </div>

            {isLoading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <h3>Finding amazing vehicles...</h3>
                <p>
                  Please wait while we connect you with the best transportation options
                </p>
              </div>
            ) : vehicles.length > 0 ? (
              <div className="vehicles-grid">
                {vehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle._id || vehicle.vehicle_id}
                    vehicle={vehicle}
                    onBook={handleBookVehicle}
                    searchCriteria={null}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No vehicles available</h3>
                <p>
                  We're working on adding more amazing vehicles to our
                  platform. Check back soon for new listings!
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingForm && selectedVehicle && (
        <VehicleBookingForm
          vehicle={selectedVehicle}
          searchCriteria={searchCriteria}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedVehicle(null);
          }}
          onConfirm={handleBookingConfirm}
        />
      )}
    </div>
  );
}
