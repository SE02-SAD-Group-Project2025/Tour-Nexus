import axios from 'axios';
import { useEffect, useState } from 'react';
import HotelCart from './td_hotel_cart';
import GuideCart from './td_guide_cart';
import toast from 'react-hot-toast';

// Import the new search banner component
const HotelSearchBanner = ({ onSearch }) => {
    const [searchData, setSearchData] = useState({
        destination: '',
        checkInDate: '',
        checkOutDate: '',
        adults: 2,
        children: 0
    });

    const [showGuestDropdown, setShowGuestDropdown] = useState(false);

    const handleInputChange = (field, value) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSearch = () => {
        if (!searchData.destination || !searchData.checkInDate || !searchData.checkOutDate) {
            toast.error('Please fill in all required fields');
            return;
        }
        
        if (new Date(searchData.checkInDate) >= new Date(searchData.checkOutDate)) {
            toast.error('Check-out date must be after check-in date');
            return;
        }
        
        onSearch(searchData);
        setShowGuestDropdown(false);
    };

    const updateGuestCount = (type, operation) => {
        setSearchData(prev => {
            const currentValue = prev[type];
            let newValue = currentValue;
            
            if (operation === 'increment') {
                newValue = type === 'adults' ? Math.min(currentValue + 1, 10) : Math.min(currentValue + 1, 8);
            } else {
                newValue = type === 'adults' ? Math.max(currentValue - 1, 1) : Math.max(currentValue - 1, 0);
            }
            
            return { ...prev, [type]: newValue };
        });
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
                            onChange={(e) => handleInputChange('destination', e.target.value)}
                        />
                    </div>

                    <div className="search-field">
                        <div className="field-label">
                            <span className="field-icon">📅</span>
                            Check-in date
                        </div>
                        <input
                            type="date"
                            className="field-input"
                            value={searchData.checkInDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleInputChange('checkInDate', e.target.value)}
                        />
                    </div>

                    <div className="search-field">
                        <div className="field-label">
                            <span className="field-icon">📅</span>
                            Check-out date
                        </div>
                        <input
                            type="date"
                            className="field-input"
                            value={searchData.checkOutDate}
                            min={searchData.checkInDate || new Date().toISOString().split('T')[0]}
                            onChange={(e) => handleInputChange('checkOutDate', e.target.value)}
                        />
                    </div>

                    <div className="search-field guests-field">
                        <div className="field-label">
                            <span className="field-icon">👥</span>
                            Guests
                        </div>
                        <div 
                            className="guests-display"
                            onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                        >
                            <span>
                                {searchData.adults} adult{searchData.adults !== 1 ? 's' : ''} · {searchData.children} children
                            </span>
                            <span>▼</span>
                        </div>
                        
                        {showGuestDropdown && (
                            <div className="guests-dropdown">
                                <div className="guest-row">
                                    <div className="guest-info">
                                        <h4>Adults</h4>
                                        <span>Age 13+</span>
                                    </div>
                                    <div className="guest-controls">
                                        <button
                                            className="guest-btn"
                                            onClick={() => updateGuestCount('adults', 'decrement')}
                                            disabled={searchData.adults <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="guest-count">{searchData.adults}</span>
                                        <button
                                            className="guest-btn"
                                            onClick={() => updateGuestCount('adults', 'increment')}
                                            disabled={searchData.adults >= 10}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="guest-row">
                                    <div className="guest-info">
                                        <h4>Children</h4>
                                        <span>Age 0-12</span>
                                    </div>
                                    <div className="guest-controls">
                                        <button
                                            className="guest-btn"
                                            onClick={() => updateGuestCount('children', 'decrement')}
                                            disabled={searchData.children <= 0}
                                        >
                                            −
                                        </button>
                                        <span className="guest-count">{searchData.children}</span>
                                        <button
                                            className="guest-btn"
                                            onClick={() => updateGuestCount('children', 'increment')}
                                            disabled={searchData.children >= 8}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="search-btn" onClick={handleSearch}>
                        Search
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
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState(null);

    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                
                const hotelsResponse = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/hotel/view_approved_hotels');
                const guidesResponse = await axios.get(import.meta.env.VITE_BACKEND_URL + '/api/guide/view_approved_guides');
                
                setHotels(hotelsResponse.data);
                setGuides(guidesResponse.data);
                
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Enhanced hotel search function for your TouristDashboard
const handleHotelSearchWithAPI = async (searchData) => {
    try {
        setIsLoading(true);
        setSearchCriteria(searchData);
        setHasSearched(true);
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            destination: searchData.destination,
            checkInDate: searchData.checkInDate,
            checkOutDate: searchData.checkOutDate,
            adults: searchData.adults.toString(),
            children: searchData.children.toString(),
            page: '1',
            limit: '20'
        });

        // Call your enhanced search API
        const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/hotel/search?${queryParams}`
        );

        if (response.data.success) {
            setFilteredHotels(response.data.data);
        } else {
            setFilteredHotels([]);
            console.error('Search failed:', response.data.message);
        }

    } catch (error) {
        console.error("Error searching hotels:", error);
        setFilteredHotels([]);
        // Fallback to client-side filtering if API fails
        handleHotelSearchClientSide(searchData);
    } finally {
        setIsLoading(false);
    }
};

// Client-side filtering as fallback (current implementation)
const handleHotelSearchClientSide = (searchData) => {
    setSearchCriteria(searchData);
    setHasSearched(true);
    
    const filtered = hotels.filter(hotel => {
        const cityMatch = hotel.city.toLowerCase().includes(searchData.destination.toLowerCase()) ||
                        hotel.hotel_name.toLowerCase().includes(searchData.destination.toLowerCase()) ||
                        hotel.address.toLowerCase().includes(searchData.destination.toLowerCase());
        
        const hasCapacity = hotel.room_types && hotel.room_types.some(room => room.count > 0);
        
        return cityMatch && hasCapacity;
    });
    
    setFilteredHotels(filtered);
};

// Use this function in your component:
// Replace the existing handleHotelSearch with handleHotelSearchWithAPI

    // Reset search
    const resetSearch = () => {
        setHasSearched(false);
        setFilteredHotels([]);
        setSearchCriteria(null);
    };

    const planNewTrip = () => {
        alert('Planning new trip...');
    };

    const aiTripPlanner = () => {
        alert('Opening AI Trip Planner...');
    };

    const exploreMapAction = () => {
        alert('Opening map explorer...');
    };

    const makeOwnTour = () => {
        alert('Opening custom tour creator...');
    };

    const searchHotels = () => {
        setActiveMenuItem('Hotels');
    };

    const findTourGuides = () => {
        setActiveMenuItem('Tour Guides');
    };

    const rentVehicles = () => {
        alert('Opening vehicle rental...');
    };

    const handleMenuItemClick = (itemName) => {
        setActiveMenuItem(itemName);
        // Reset search when switching menu items
        if (itemName !== 'Hotels') {
            resetSearch();
        }
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const moveToAccount = (accountType) => {
        alert(`Moving to ${accountType} account...`);
        setShowDropdown(false);
    };

    // Content rendering function
    const renderContent = () => {
        if (activeMenuItem === 'Dashboard') {
            return (
                <>
                    <div className="welcome-section">
                        <h1>Welcome back, Traveler!</h1>
                        <p>Ready for your next Sri Lankan adventure?</p>
                        
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={planNewTrip}>Plan New Trip</button>
                            <button className="btn btn-secondary" onClick={exploreMapAction}>Explore Map</button>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="number">12</div>
                            <div className="label">Total Trips</div>
                            <div className="change positive">+2 this month</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="number">45</div>
                            <div className="label">Saved Places</div>
                            <div className="change positive">+5 recently</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="number">$2,450</div>
                            <div className="label">Total Spent</div>
                            <div className="change">Last 6 months</div>
                        </div>
                        
                        <div className="stat-card">
                            <div className="number">28</div>
                            <div className="label">Reviews Given</div>
                            <div className="change">4.9 avg rating</div>
                        </div>
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
        
        if (activeMenuItem === 'Hotels') {
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
                                        {filteredHotels.length} properties found in "{searchCriteria.destination}"
                                    </h2>
                                    <p>
                                        {searchCriteria.checkInDate} → {searchCriteria.checkOutDate} · 
                                        {searchCriteria.adults} adult{searchCriteria.adults !== 1 ? 's' : ''} · 
                                        {searchCriteria.children} children
                                    </p>
                                    <button className="reset-btn" onClick={resetSearch}>
                                        View All Hotels
                                    </button>
                                </div>
                                
                                {filteredHotels.length > 0 ? (
                                    <div className="w-100 d-flex justify-content-start align-items-start flex-wrap">
                                        {filteredHotels.map((hotel) => (
                                            <HotelCart key={hotel._id || hotel.hotel_id} hotel={hotel} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="no-results">
                                        <h3>No hotels found</h3>
                                        <p>Try adjusting your search criteria or browse all available hotels.</p>
                                        <button className="btn btn-primary" onClick={resetSearch}>
                                            Browse All Hotels
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // Default view - could be empty or show some featured hotels
                            <div className="default-hotels-view">
                                <div style={{ padding: '40px 20px', textAlign: 'center', background: 'white', margin: '20px 0' }}>
                                    <h2>Discover Amazing Hotels in Sri Lanka</h2>
                                    <p>Use the search above to find the perfect accommodation for your stay</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            );
        }
        
        if (activeMenuItem === 'Tour Guides') {
            return (
                <div>
                    <h1>Tour Guides</h1>
                    <p>Connect with experienced local guides</p>
                    
                    <div style={{ marginBottom: '40px' }}>
                        <div className="w-100 d-flex justify-content-start align-items-start flex-wrap">
                            {guides.map((guide) => (
                                <GuideCart key={guide._id || guide.guide_id} guide={guide} />
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
        
        if (activeMenuItem === 'Vehicles') {
            return (
                <div>
                    <h1>Vehicle Rentals</h1>
                    <p>Rent cars, bikes, and other vehicles</p>
                    
                    <div style={{marginTop: '30px'}}>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px'}}>
                            <div style={{background: 'white', padding: '20px', border: '1px solid #ddd'}}>
                                <h3>Toyota Prius</h3>
                                <p>Hybrid • AC • $40/day</p>
                                <button className="btn btn-primary" style={{marginTop: '10px'}}>Book Now</button>
                            </div>
                            <div style={{background: 'white', padding: '20px', border: '1px solid #ddd'}}>
                                <h3>Honda Motorcycle</h3>
                                <p>150cc • $15/day</p>
                                <button className="btn btn-primary" style={{marginTop: '10px'}}>Book Now</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (activeMenuItem === 'Trip Planner') {
            return (
                <div>
                    <h1>Trip Planner</h1>
                    <p>Plan your perfect Sri Lankan adventure</p>
                    
                    <div style={{background: 'white', padding: '30px', border: '1px solid #ddd', marginTop: '30px'}}>
                        <h3>Create New Itinerary</h3>
                        <div style={{marginTop: '20px'}}>
                            <input type="text" placeholder="Trip Name" style={{width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd'}} />
                            <input type="date" style={{width: '48%', padding: '10px', marginRight: '4%', border: '1px solid #ddd'}} />
                            <input type="date" style={{width: '48%', padding: '10px', border: '1px solid #ddd'}} />
                            <button className="btn btn-primary" style={{marginTop: '15px', width: '100%'}}>Create Itinerary</button>
                        </div>
                    </div>
                </div>
            );
        }
        
        if (activeMenuItem === 'My Bookings') {
            return (
                <div>
                    <h1>My Bookings</h1>
                    <p>Manage your reservations and bookings</p>
                    
                    <div style={{marginTop: '30px'}}>
                        <div style={{background: 'white', padding: '20px', border: '1px solid #ddd', marginBottom: '20px'}}>
                            <h3>Grand Oriental Hotel</h3>
                            <p>Check-in: March 15, 2025 • Check-out: March 18, 2025</p>
                            <p>Status: <span style={{color: '#27ae60', fontWeight: 'bold'}}>Confirmed</span></p>
                        </div>
                        <div style={{background: 'white', padding: '20px', border: '1px solid #ddd'}}>
                            <h3>Wildlife Safari - Yala National Park</h3>
                            <p>Date: March 20, 2025 • Duration: Full Day</p>
                            <p>Status: <span style={{color: '#f39c12', fontWeight: 'bold'}}>Pending</span></p>
                        </div>
                    </div>
                </div>
            );
        }
        
        // For any other menu items, show a generic coming soon page
        return (
            <div>
                <h1>{activeMenuItem}</h1>
                <p>Content for {activeMenuItem} coming soon...</p>
            </div>
        );
    };

    return (
        <div>
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
                    color: #00b894;
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
                
                .notification {
                    position: relative;
                    padding: 8px;
                    border: 1px solid #ddd;
                    background: white;
                    cursor: pointer;
                }
                
                .notification::after {
                    content: '1';
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
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
                
                .dropdown-item:last-child {
                    border-bottom: none;
                }
                
                .user-avatar {
                    width: 30px;
                    height: 30px;
                    background: #00b894;
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
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
                    background-color: #00b894;
                    color: white;
                }
                
                .main-content {
                    flex: 1;
                    margin-left: 250px;
                    margin-top: 70px;
                    padding: 0; /* Remove padding for full-width banner */
                }
                
                .hotels-page {
                    background: #f5f5f5;
                }
                
                .hotels-content {
                    padding: 30px;
                }
                
                .hotel-search-banner {
                    background: linear-gradient(135deg, #003580 0%, #0071c2 100%);
                    color: white;
                    padding: 60px 20px;
                    text-align: center;
                    position: relative;
                }

                .banner-content h1 {
                    font-size: 48px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }

                .banner-content p {
                    font-size: 24px;
                    margin-bottom: 40px;
                    opacity: 0.9;
                }

                .search-form {
                    background: #febb02;
                    border-radius: 8px;
                    padding: 8px;
                    display: flex;
                    gap: 4px;
                    max-width: 1200px;
                    margin: 0 auto;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                }

                .search-field {
                    background: white;
                    border: 3px solid transparent;
                    border-radius: 4px;
                    padding: 16px;
                    flex: 1;
                    min-height: 56px;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .search-field:hover {
                    border-color: #0071c2;
                }

                .search-field.focused {
                    border-color: #0071c2;
                    box-shadow: 0 0 0 2px rgba(0,113,194,0.2);
                }

                .field-icon {
                    font-size: 20px;
                    margin-right: 8px;
                    color: #666;
                }

                .field-label {
                    font-size: 12px;
                    font-weight: 600;
                    color: #0071c2;
                    margin-bottom: 4px;
                    text-transform: uppercase;
                }

                .field-input {
                    border: none;
                    outline: none;
                    width: 100%;
                    font-size: 16px;
                    color: #333;
                    background: transparent;
                }

                .field-input::placeholder {
                    color: #999;
                }

                .guests-field {
                    position: relative;
                }

                .guests-display {
                    font-size: 16px;
                    color: #333;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .guests-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                    z-index: 1000;
                    padding: 20px;
                    margin-top: 8px;
                }

                .guest-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid #eee;
                }

                .guest-row:last-child {
                    border-bottom: none;
                }

                .guest-info h4 {
                    margin: 0;
                    font-size: 16px;
                    color: #333;
                }

                .guest-info span {
                    font-size: 14px;
                    color: #666;
                }

                .guest-controls {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .guest-btn {
                    width: 32px;
                    height: 32px;
                    border: 1px solid #0071c2;
                    background: white;
                    color: #0071c2;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 18px;
                    font-weight: bold;
                    transition: all 0.2s;
                }

                .guest-btn:hover:not(:disabled) {
                    background: #0071c2;
                    color: white;
                }

                .guest-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }

                .guest-count {
                    font-size: 16px;
                    font-weight: 600;
                    min-width: 20px;
                    text-align: center;
                    color: #333;
                }

                .search-btn {
                    background: #0071c2;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 16px 32px;
                    font-size: 18px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    min-width: 120px;
                }

                .search-btn:hover {
                    background: #005bb5;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,113,194,0.3);
                }

                .results-header {
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    margin-bottom: 25px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .results-header h2 {
                    color: #333;
                    margin-bottom: 10px;
                    font-size: 24px;
                }

                .results-header p {
                    color: #666;
                    margin-bottom: 15px;
                    font-size: 16px;
                }

                .reset-btn {
                    background: transparent;
                    color: #0071c2;
                    border: 2px solid #0071c2;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s;
                }

                .reset-btn:hover {
                    background: #0071c2;
                    color: white;
                }

                .no-results {
                    background: white;
                    padding: 60px;
                    text-align: center;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .no-results h3 {
                    color: #333;
                    margin-bottom: 16px;
                    font-size: 24px;
                }

                .no-results p {
                    color: #666;
                    margin-bottom: 24px;
                    font-size: 16px;
                }

                .default-hotels-view {
                    text-align: center;
                }

                .default-hotels-view h2 {
                    color: #333;
                    margin-bottom: 16px;
                    font-size: 28px;
                }

                .default-hotels-view p {
                    color: #666;
                    font-size: 18px;
                }
                
                .welcome-section {
                    background: #00b894;
                    color: white;
                    padding: 40px;
                    margin-bottom: 30px;
                    border: 1px solid #ddd;
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
                }
                
                .btn-primary {
                    background: white;
                    color: #00b894;
                }
                
                .btn-secondary {
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                }
                
                .btn:hover {
                    opacity: 0.8;
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
                    border: 1px solid #ddd;
                    text-align: center;
                }
                
                .stat-card .number {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 8px;
                }
                
                .stat-card .label {
                    color: #666;
                    margin-bottom: 5px;
                }
                
                .stat-card .change {
                    font-size: 12px;
                }
                
                .change.positive {
                    color: #27ae60;
                }
                
                .change.negative {
                    color: #e74c3c;
                }
                
                .quick-actions {
                    background: white;
                    padding: 25px;
                    border: 1px solid #ddd;
                }
                
                .quick-actions h2 {
                    margin-bottom: 25px;
                }
                
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                }
                
                .action-card {
                    padding: 30px 20px;
                    border: 1px solid #ddd;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .action-card:hover {
                    background-color: #f8f9fa;
                }
                
                .action-card h3 {
                    margin-bottom: 10px;
                    font-size: 16px;
                }
                
                .action-card p {
                    font-size: 14px;
                    color: #666;
                }
                
                @media (max-width: 768px) {
                    .sidebar {
                        transform: translateX(-100%);
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
                        gap: 8px;
                    }
                    
                    .search-field {
                        min-height: 48px;
                    }

                    .banner-content h1 {
                        font-size: 32px;
                    }
                    
                    .banner-content p {
                        font-size: 18px;
                    }
                }

                /* Additional styles for better integration */
                .hotels-page .main-content {
                    padding: 30px;
                }

                .search-results {
                    margin-top: 20px;
                }
            `}</style>

            <div className="header">
                <div className="logo">TourNexus</div>
                
                <div className="search-bar">
                    <input type="text" placeholder="Search hotels, guides, destinations..." />
                </div>
                
                <div className="user-section">
                    <div className="notification"></div>
                    <div className="user-profile" onClick={toggleDropdown}>
                        <span style={{marginLeft: '5px'}}>🔄Change Account▼</span>
                        
                        <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                            <div className="dropdown-header">Move Account</div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Guide')}>
                                Guide
                            </div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Hotel Owner')}>
                                Hotel Owner
                            </div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Vehicle Rental Company')}>
                                Vehicle Rental Company
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-container">
                <div className="sidebar">
                    <div className={`sidebar-item ${activeMenuItem === 'Dashboard' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Dashboard')}>
                        <span>📊</span>
                        <span>Dashboard</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Hotels' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Hotels')}>
                        <span>🏨</span>
                        <span>Hotels</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Tour Guides' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Tour Guides')}>
                        <span>👥</span>
                        <span>Tour Guides</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Vehicles' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Vehicles')}>
                        <span>🚗</span>
                        <span>Vehicles</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Trip Planner' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Trip Planner')}>
                        <span>📝</span>
                        <span>Trip Planner</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'My Bookings' ? 'active' : ''}`} onClick={() => handleMenuItemClick('My Bookings')}>
                        <span>📋</span>
                        <span>My Bookings</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Favorites' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Favorites')}>
                        <span>❤️</span>
                        <span>Favorites</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Messages' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Messages')}>
                        <span>💬</span>
                        <span>Messages</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Profile' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Profile')}>
                        <span>👤</span>
                        <span>Profile</span>
                    </div>
                    <div className={`sidebar-item ${activeMenuItem === 'Settings' ? 'active' : ''}`} onClick={() => handleMenuItemClick('Settings')}>
                        <span>⚙️</span>
                        <span>Settings</span>
                    </div>
                </div>

                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}