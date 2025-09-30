import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, X, MapPin, Car, Users, Fuel, DollarSign, RefreshCw, Edit, Trash2, ArrowLeft, Calendar, Shield, Phone, AlertCircle } from 'lucide-react';

// Vehicle Card Component with working edit and delete
const VehicleCard = ({ vehicle, onEdit, onDelete, onViewDetails }) => {
    // Get vehicle status configuration
    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case 'available':
                return {
                    color: '#22c55e',
                    text: 'AVAILABLE',
                    bgColor: '#dcfce7',
                    textColor: '#15803d'
                };
            case 'booked':
                return {
                    color: '#3b82f6',
                    text: 'BOOKED',
                    bgColor: '#dbeafe',
                    textColor: '#1d4ed8'
                };
            case 'maintenance':
                return {
                    color: '#f59e0b',
                    text: 'MAINTENANCE',
                    bgColor: '#fef3c7',
                    textColor: '#d97706'
                };
            case 'active':
                return {
                    color: '#22c55e',
                    text: 'ACTIVE',
                    bgColor: '#dcfce7',
                    textColor: '#15803d'
                };
            default:
                return {
                    color: '#6b7280',
                    text: 'UNKNOWN',
                    bgColor: '#f3f4f6',
                    textColor: '#374151'
                };
        }
    };
    // Get vehicle type icon
    const getVehicleIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'tuk_tuk':
                return '🛺';
            case 'motorbike':
                return '🏍️';
            case 'car':
                return '🚗';
            case 'van':
                return '🚐';
            case 'bus':
                return '🚌';
            case 'truck':
                return '🚚';
            default:
                return '🚘';
        }
    };
    // Get fuel type icon
    const getFuelIcon = (fuelType) => {
        switch (fuelType?.toLowerCase()) {
            case 'petrol':
                return '⛽';
            case 'diesel':
                return '🛢️';
            case 'hybrid':
                return '🔋';
            case 'electric':
                return '⚡';
            default:
                return '⛽';
        }
    };
    const statusConfig = getStatusConfig(vehicle.status);
    const vehicleIcon = getVehicleIcon(vehicle.vehicle_type);
    const fuelIcon = getFuelIcon(vehicle.fuel_type);
    // Format vehicle type for display
    const formatVehicleType = (type) => {
        if (!type) return 'Unknown';
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };
    // Format fuel type for display
    const formatFuelType = (fuel) => {
        if (!fuel) return 'Unknown';
        return fuel.charAt(0).toUpperCase() + fuel.slice(1);
    };
    // Handle view details click
    const handleViewDetails = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onViewDetails) {
            onViewDetails(vehicle.vehicle_id, vehicle.vehicle_model);
        }
    };
    // Handle edit button click
    const handleEdit = (e) => {
        e.preventDefault();
        e.stopPropagation();
       
        // Check if vehicle can be edited (not booked)
        if (vehicle.status === 'booked') {
            toast.error(`Cannot edit "${vehicle.vehicle_model}" - Vehicle is currently booked`);
            return;
        }
       
        if (onEdit) {
            onEdit(vehicle.vehicle_id, vehicle.vehicle_model);
        }
    };
    // Handle delete button click
    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();
       
        if (onDelete) {
            onDelete(vehicle.vehicle_id, vehicle.vehicle_model);
        }
    };
    // Check if vehicle can be edited (not booked)
    const canEdit = vehicle.status !== 'booked';
    return (
        <div className="vehicle-card-container">
            <div className="vehicle-image-section">
                {vehicle.images && vehicle.images.length > 0 ? (
                    <img
                        src={vehicle.images[0]}
                        alt={`${vehicle.vehicle_model} view`}
                        className="vehicle-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="vehicle-image-placeholder">{vehicleIcon}</div>
                )}
                <div className="vehicle-image-placeholder" style={{display: 'none'}}>{vehicleIcon}</div>
               
                <div className="vehicle-type-indicator">{vehicleIcon}</div>
                <div className="status-badge" style={{background: statusConfig.color}}>{statusConfig.text}</div>
               
                {vehicle.images && vehicle.images.length > 1 && (
                    <div className="image-count">📷 {vehicle.images.length}</div>
                )}
               
                {vehicle.vehicle_book_image && (
                    <div className="book-image-indicator">📄 Registered</div>
                )}
            </div>
           
            <div className="vehicle-content">
                <div className="vehicle-header">
                    <div className="vehicle-name">{vehicle.vehicle_model}</div>
                    <div className="vehicle-location">
                        <span className="location-icon">📍</span>
                        {vehicle.branch_name}
                    </div>
                    <div className="vehicle-id">ID: {vehicle.vehicle_id}</div>
                </div>
               
                <div className="vehicle-specs">
                    <div className="specs-grid">
                        <div className="spec-item">
                            <span className="spec-icon">🚗</span>
                            <span className="spec-label">{formatVehicleType(vehicle.vehicle_type)}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon">{fuelIcon}</span>
                            <span className="spec-label">{formatFuelType(vehicle.fuel_type)}</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon">👥</span>
                            <span className="spec-label">{vehicle.seating_capacity} Seats</span>
                        </div>
                        <div className="spec-item">
                            <span className="spec-icon">📅</span>
                            <span className="spec-label">Daily Rental</span>
                        </div>
                    </div>
                </div>
                {vehicle.features && vehicle.features.length > 0 && (
                    <div className="vehicle-features">
                        <div className="features-title">Features ({vehicle.features.length}):</div>
                        <div className="features-list">
                            {vehicle.features.slice(0, 3).map((feature, index) => (
                                <span key={index} className="feature-badge">
                                    {feature}
                                </span>
                            ))}
                            {vehicle.features.length > 3 && (
                                <span className="feature-badge">+{vehicle.features.length - 3} more</span>
                            )}
                        </div>
                    </div>
                )}
               
                <div className="vehicle-price">
                    LKR {(vehicle.price_per_day || 0).toLocaleString()}
                    <span className="price-label">/day</span>
                </div>
               
                <div className="vehicle-status-info" style={{
                    background: statusConfig.bgColor,
                    color: statusConfig.textColor
                }}>
                    <span className="status-icon">
                        {vehicle.status === 'available' ? '✅' :
                         vehicle.status === 'booked' ? '📅' :
                         vehicle.status === 'maintenance' ? '🔧' : '📋'}
                    </span>
                    Status: {statusConfig.text}
                </div>
               
                <div className="registration-info">
                    📅 Added: {vehicle.date ? new Date(vehicle.date).toLocaleDateString() : 'N/A'}
                </div>
               
                <div className="vehicle-actions">
                    <button
                        onClick={handleViewDetails}
                        className="btn-view-details"
                    >
                        View Details
                    </button>
                   
                    <div className="action-buttons">
                        <button
                            className={`action-btn secondary ${!canEdit ? 'disabled' : ''}`}
                            onClick={handleEdit}
                            title={
                                canEdit
                                    ? `Edit ${vehicle.vehicle_model}`
                                    : `Cannot edit ${vehicle.vehicle_model} - Currently ${vehicle.status}`
                            }
                            disabled={!canEdit}
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                       
                        <button
                            className="action-btn danger"
                            onClick={handleDelete}
                            title={`Delete ${vehicle.vehicle_model}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced Vehicle Search Component with Advanced Filters
const EnhancedVehicleSearch = ({ onSearch, onReset, vehicles, isLoading }) => {
    const [searchFilters, setSearchFilters] = useState({
        branch_name: '',
        vehicle_type: '',
        fuel_type: '',
        min_price: '',
        max_price: '',
        min_seats: '',
        status: ''
    });
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const districts = [
        'All Branches', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
        'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
    ];
    const vehicleTypes = [
        { value: '', label: 'All Types' },
        { value: 'tuk_tuk', label: 'Tuk Tuk' },
        { value: 'motorbike', label: 'Motorbike' },
        { value: 'car', label: 'Car' },
        { value: 'van', label: 'Van' },
        { value: 'other', label: 'Other' }
    ];
    const fuelTypes = [
        { value: '', label: 'All Fuel Types' },
        { value: 'petrol', label: 'Petrol' },
        { value: 'diesel', label: 'Diesel' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'electric', label: 'Electric' }
    ];
    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'available', label: 'Available' },
        { value: 'booked', label: 'Booked' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'active', label: 'Active' }
    ];
    const handleFilterChange = (field, value) => {
        setSearchFilters(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const handleSearch = () => {
        if (searchFilters.branch_name && searchFilters.branch_name !== 'All Branches') {
            onSearch({ branch_name: searchFilters.branch_name });
        } else {
            let filtered = vehicles;
            if (searchFilters.vehicle_type) {
                filtered = filtered.filter(v => v.vehicle_type === searchFilters.vehicle_type);
            }
            if (searchFilters.fuel_type) {
                filtered = filtered.filter(v => v.fuel_type === searchFilters.fuel_type);
            }
            if (searchFilters.min_price) {
                filtered = filtered.filter(v => v.price_per_day >= parseFloat(searchFilters.min_price));
            }
            if (searchFilters.max_price) {
                filtered = filtered.filter(v => v.price_per_day <= parseFloat(searchFilters.max_price));
            }
            if (searchFilters.min_seats) {
                filtered = filtered.filter(v => v.seating_capacity >= parseInt(searchFilters.min_seats));
            }
            if (searchFilters.status) {
                filtered = filtered.filter(v => v.status === searchFilters.status);
            }
            onSearch({ filtered: filtered, isLocalFilter: true });
        }
    };
    const clearFilters = () => {
        setSearchFilters({
            branch_name: '',
            vehicle_type: '',
            fuel_type: '',
            min_price: '',
            max_price: '',
            min_seats: '',
            status: ''
        });
        onReset();
    };
    const hasActiveFilters = Object.values(searchFilters).some(value => value !== '');
    return (
        <div className="enhanced-search-container">
            <div className="search-header">
                <h2 className="search-title">
                    <Search className="w-6 h-6 mr-2" />
                    Find Your Perfect Vehicle
                </h2>
                <p className="search-subtitle">Use filters to narrow down your search results</p>
            </div>
            <div className="main-search-bar">
                <div className="search-input-group">
                    <MapPin className="search-icon" />
                    <select
                        value={searchFilters.branch_name}
                        onChange={(e) => handleFilterChange('branch_name', e.target.value)}
                        className="search-select branch-select"
                    >
                        {districts.map(district => (
                            <option key={district} value={district === 'All Branches' ? '' : district}>
                                {district}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="search-actions">
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`filter-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Advanced Filters
                    </button>
                    <button onClick={handleSearch} className="search-btn" disabled={isLoading}>
                        {isLoading ? (
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Search className="w-4 h-4 mr-2" />
                        )}
                        Search
                    </button>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="clear-btn">
                            <X className="w-4 h-4 mr-2" />
                            Clear All
                        </button>
                    )}
                </div>
            </div>
            {showAdvancedFilters && (
                <div className="advanced-filters">
                    <div className="filters-grid">
                        <div className="filter-group">
                            <label className="filter-label">
                                <Car className="w-4 h-4 mr-2" />
                                Vehicle Type
                            </label>
                            <select
                                value={searchFilters.vehicle_type}
                                onChange={(e) => handleFilterChange('vehicle_type', e.target.value)}
                                className="filter-select"
                            >
                                {vehicleTypes.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">
                                <Fuel className="w-4 h-4 mr-2" />
                                Fuel Type
                            </label>
                            <select
                                value={searchFilters.fuel_type}
                                onChange={(e) => handleFilterChange('fuel_type', e.target.value)}
                                className="filter-select"
                            >
                                {fuelTypes.map(fuel => (
                                    <option key={fuel.value} value={fuel.value}>{fuel.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">
                                <Users className="w-4 h-4 mr-2" />
                                Min. Seats
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={searchFilters.min_seats}
                                onChange={(e) => handleFilterChange('min_seats', e.target.value)}
                                placeholder="e.g., 4"
                                className="filter-input"
                            />
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">
                                <DollarSign className="w-4 h-4 mr-2" />
                                Price Range (LKR)
                            </label>
                            <div className="price-range">
                                <input
                                    type="number"
                                    min="0"
                                    value={searchFilters.min_price}
                                    onChange={(e) => handleFilterChange('min_price', e.target.value)}
                                    placeholder="Min"
                                    className="filter-input price-input"
                                />
                                <span className="price-separator">-</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={searchFilters.max_price}
                                    onChange={(e) => handleFilterChange('max_price', e.target.value)}
                                    placeholder="Max"
                                    className="filter-input price-input"
                                />
                            </div>
                        </div>
                        <div className="filter-group">
                            <label className="filter-label">Vehicle Status</label>
                            <select
                                value={searchFilters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="filter-select"
                            >
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}
            {hasActiveFilters && (
                <div className="active-filters">
                    <span className="active-filters-label">Active filters:</span>
                    <div className="active-filters-list">
                        {searchFilters.branch_name && (
                            <span className="active-filter-tag">
                                Location: {searchFilters.branch_name}
                                <button onClick={() => handleFilterChange('branch_name', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {searchFilters.vehicle_type && (
                            <span className="active-filter-tag">
                                Type: {vehicleTypes.find(t => t.value === searchFilters.vehicle_type)?.label}
                                <button onClick={() => handleFilterChange('vehicle_type', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {searchFilters.fuel_type && (
                            <span className="active-filter-tag">
                                Fuel: {fuelTypes.find(f => f.value === searchFilters.fuel_type)?.label}
                                <button onClick={() => handleFilterChange('fuel_type', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {searchFilters.status && (
                            <span className="active-filter-tag">
                                Status: {statusOptions.find(s => s.value === searchFilters.status)?.label}
                                <button onClick={() => handleFilterChange('status', '')}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(searchFilters.min_price || searchFilters.max_price) && (
                            <span className="active-filter-tag">
                                Price: LKR {searchFilters.min_price || '0'} - {searchFilters.max_price || '∞'}
                                <button onClick={() => {
                                    handleFilterChange('min_price', '');
                                    handleFilterChange('max_price', '');
                                }}>
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Main Dashboard Component with Enhanced Vehicle Management
export default function VehicleRentalDashboard() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [filteredVehicles, setFilteredVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchCriteria, setSearchCriteria] = useState(null);
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    // Fetch initial vehicle data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicle/status/available`);
                const bookedResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicle/status/booked`);
                const maintenanceResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vehicle/status/maintenance`);
                const allVehicles = [
                    ...response.data.data,
                    ...bookedResponse.data.data,
                    ...maintenanceResponse.data.data,
                ];
                setVehicles(allVehicles);
                setFilteredVehicles(allVehicles);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
                toast.error('Failed to load vehicles');
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Enhanced vehicle edit function
    const handleEditVehicle = async (vehicle_id, vehicle_model) => {
        try {
            const vehicle = vehicles.find(v => v.vehicle_id === vehicle_id);
           
            if (!vehicle) {
                toast.error(`Vehicle not found: "${vehicle_model}"`);
                return;
            }
            // Check if vehicle can be edited
            if (vehicle.status === 'booked') {
                toast.error(`Cannot edit "${vehicle_model}" - Vehicle is currently booked`);
                return;
            }
            // Navigate to edit page or show edit modal
            // For now, we'll navigate to an edit page
            navigate(`/vehiclerental/edit/${vehicle_id}`);
           
        } catch (error) {
            console.error('Error preparing to edit vehicle:', error);
            toast.error('Failed to open edit form');
        }
    };
    // Enhanced vehicle delete function
    const handleDeleteVehicle = async (vehicle_id, vehicle_model) => {
        if (window.confirm(`Are you sure you want to delete "${vehicle_model}"? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
               
                const response = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/delete_vehicle/${vehicle_id}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
               
                if (response.data.success) {
                    // Remove vehicle from local state
                    setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.vehicle_id !== vehicle_id));
                    setFilteredVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.vehicle_id !== vehicle_id));
                    toast.success(`"${vehicle_model}" deleted successfully`);
                    if (selectedVehicle && selectedVehicle.vehicle_id === vehicle_id) {
                        setSelectedVehicle(null);
                    }
                } else {
                    toast.error(response.data.message || 'Failed to delete vehicle');
                }
            } catch (error) {
                console.error('Error deleting vehicle:', error);
               
                let errorMessage = 'Failed to delete vehicle';
                if (error.response?.status === 403) {
                    errorMessage = "You don't have permission to delete this vehicle";
                } else if (error.response?.status === 404) {
                    errorMessage = "Vehicle not found";
                } else if (error.response?.data?.message) {
                    errorMessage = error.response.data.message;
                }
               
                toast.error(errorMessage);
            }
        }
    };
    // Handle view vehicle details
    const handleViewVehicleDetails = (vehicle_id, vehicle_model) => {
        const vehicle = vehicles.find(v => v.vehicle_id === vehicle_id) || filteredVehicles.find(v => v.vehicle_id === vehicle_id);
        if (vehicle) {
            setSelectedVehicle(vehicle);
        } else {
            toast.error('Vehicle not found');
        }
    };
    // Enhanced vehicle search handler
    const handleVehicleSearch = async (searchData) => {
        try {
            setIsLoading(true);
            console.log('=== VEHICLE SEARCH STARTED ===');
            console.log('Search data:', searchData);
            if (searchData.isLocalFilter) {
                console.log('Applying local filters...');
                setFilteredVehicles(searchData.filtered);
                setSearchCriteria({ type: 'Advanced Filters', count: searchData.filtered.length });
                setHasSearched(true);
                toast.success(`Found ${searchData.filtered.length} vehicles matching your criteria!`);
                return;
            }
            if (!searchData.branch_name || searchData.branch_name === 'All Branches') {
                console.log('Resetting to show all vehicles...');
                setFilteredVehicles(vehicles);
                setSearchCriteria(null);
                setHasSearched(false);
                toast.success('Showing all vehicles');
                return;
            }
            console.log(`Searching vehicles in branch: ${searchData.branch_name}`);
            const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/view_vehicle_by_branch/${encodeURIComponent(searchData.branch_name)}`;
            console.log('API URL:', apiUrl);
            const response = await axios.get(apiUrl);
            console.log('Branch search response:', response);
           
            if (response.data.success) {
                const branchVehicles = response.data.data;
                console.log(`Found ${branchVehicles.length} vehicles in ${searchData.branch_name}`);
               
                setFilteredVehicles(branchVehicles);
                setSearchCriteria({
                    type: 'Branch',
                    value: searchData.branch_name,
                    count: branchVehicles.length
                });
                setHasSearched(true);
               
                if (branchVehicles.length > 0) {
                    toast.success(`🎉 Found ${branchVehicles.length} vehicle${branchVehicles.length !== 1 ? 's' : ''} in ${searchData.branch_name}!`);
                } else {
                    toast.info(`📍 No vehicles found in ${searchData.branch_name}. Try another branch or view all vehicles.`);
                }
            } else {
                console.error('Branch search failed:', response.data);
                setFilteredVehicles([]);
                setSearchCriteria({
                    type: 'Branch',
                    value: searchData.branch_name,
                    count: 0
                });
                setHasSearched(true);
                toast.error('Search failed: ' + (response.data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('=== BRANCH SEARCH ERROR ===');
            console.error('Error details:', error);
           
            setFilteredVehicles([]);
            setSearchCriteria({
                type: 'Branch',
                value: searchData.branch_name,
                count: 0,
                error: true
            });
            setHasSearched(true);
           
            if (error.response) {
                const statusCode = error.response.status;
                const errorMessage = error.response.data?.message || error.response.statusText;
               
                if (statusCode === 404) {
                    toast.error(`❌ Branch "${searchData.branch_name}" not found or has no vehicles.`);
                } else if (statusCode === 500) {
                    toast.error(`❌ Server error while searching. Please try again later.`);
                } else {
                    toast.error(`❌ Search failed: ${errorMessage}`);
                }
            } else if (error.request) {
                toast.error('❌ No response from server. Please check your connection.');
            } else {
                toast.error('❌ Search request failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
            console.log('=== VEHICLE SEARCH COMPLETED ===');
        }
    };
    // Reset search
    const resetSearch = () => {
        setHasSearched(false);
        setFilteredVehicles(vehicles);
        setSearchCriteria(null);
        toast.success('Showing all vehicles');
    };
    // Quick action handlers
    const manageVehicle = () => {
        navigate('/vehiclerental/addvehicle');
    };
    const manageBranch = () => {
        toast.info('Opening branch management...');
    };
    const manageBookings = () => {
        toast.info('Opening booking management...');
    };
    // Menu item handlers
    const handleMenuItemClick = (itemName) => {
        setActiveMenuItem(itemName);
        if (itemName !== 'Vehicles') {
            resetSearch();
        }
    };
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };
    const moveToAccount = (accountType) => {
        toast.info(`Switching to ${accountType} account...`);
        setShowDropdown(false);
    };
    // Calculate stats
    const stats = {
        totalVehicles: vehicles.length,
        availableVehicles: vehicles.filter((v) => v.status === 'available').length,
        bookedVehicles: vehicles.filter((v) => v.status === 'booked').length,
        maintenanceCount: vehicles.filter((v) => v.status === 'maintenance').length,
    };
    const StatCard = ({ title, value, change }) => (
        <div className="stat-card">
            <div className="number">{value}</div>
            <div className="label">{title}</div>
            {change && <div className="change positive">{change}</div>}
        </div>
    );
    const ActionCard = ({ title, description, onClick }) => (
        <div className="action-card" onClick={onClick}>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
    const renderContent = () => {
        if (activeMenuItem === 'Dashboard') {
            return (
                <>
                    <div className="welcome-section">
                        <h1>Welcome, Fleet Manager!</h1>
                        <p>Ready to manage your vehicle rental business?</p>
                        <div className="action-buttons">
                            <button className="btn btn-primary" onClick={manageVehicle}>
                                Add Vehicle
                            </button>
                            <button className="btn btn-secondary" onClick={manageBranch}>
                                Manage Branch
                            </button>
                        </div>
                    </div>
                    <div className="stats-grid">
                        <StatCard title="Total Vehicles" value={stats.totalVehicles} change="+2 this month" />
                        <StatCard title="Available Vehicles" value={stats.availableVehicles} change="Ready to rent" />
                        <StatCard title="Booked Vehicles" value={stats.bookedVehicles} change="+1 today" />
                        <StatCard title="Maintenance" value={stats.maintenanceCount} change="Due this week" />
                    </div>
                    <div className="quick-actions">
                        <h2>Quick Actions</h2>
                        <div className="actions-grid">
                            <ActionCard
                                title="Manage Vehicle"
                                description="View and manage vehicles"
                                onClick={manageVehicle}
                            />
                            <ActionCard
                                title="Manage Branch"
                                description="View and manage branch operations"
                                onClick={manageBranch}
                            />
                            <ActionCard
                                title="Manage Bookings"
                                description="Handle rental requests and bookings"
                                onClick={manageBookings}
                            />
                        </div>
                    </div>
                </>
            );
        }
        if (activeMenuItem === 'Vehicles') {
            return (
                <div className="vehicles-page">
                    <EnhancedVehicleSearch
                        onSearch={handleVehicleSearch}
                        onReset={resetSearch}
                        vehicles={vehicles}
                        isLoading={isLoading}
                    />
                    <div className="vehicles-content">
                        {hasSearched && (
                            <div className="search-results-header">
                                <div className="results-info">
                                    <h2 className="results-title">
                                        {searchCriteria?.type === 'Branch' ? (
                                            <>
                                                📍 Vehicles in {searchCriteria.value}
                                                {searchCriteria?.error && <span className="error-indicator"> (Search Error)</span>}
                                            </>
                                        ) : searchCriteria?.type === 'Advanced Filters' ? (
                                            <>🔍 Filtered Results</>
                                        ) : (
                                            <>🚗 Search Results</>
                                        )}
                                    </h2>
                                    <p className="results-count">
                                        {searchCriteria?.error ? (
                                            <span className="error-text">Search failed - please try again</span>
                                        ) : (
                                            <>
                                                {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''} found
                                                {searchCriteria?.type === 'Branch' && filteredVehicles.length > 0 && (
                                                    <span className="branch-info"> in {searchCriteria.value} branch</span>
                                                )}
                                            </>
                                        )}
                                    </p>
                                </div>
                                <div className="search-actions">
                                    <button className="reset-search-btn" onClick={resetSearch}>
                                        <X className="w-4 h-4 mr-2" />
                                        Show All Vehicles
                                    </button>
                                    {searchCriteria?.type === 'Branch' && (
                                        <button
                                            className="retry-search-btn"
                                            onClick={() => handleVehicleSearch({ branch_name: searchCriteria.value })}
                                            disabled={isLoading}
                                        >
                                            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                            Retry Search
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        {isLoading ? (
                            <div className="loading-state">
                                <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                                <h3>Loading vehicles...</h3>
                                <p>Please wait while we fetch the latest vehicle data</p>
                            </div>
                        ) : (
                            <>
                                {filteredVehicles.length > 0 ? (
                                    <div className="vehicles-grid">
                                        {filteredVehicles.map((vehicle) => (
                                            <VehicleCard
                                                key={vehicle.vehicle_id}
                                                vehicle={vehicle}
                                                onEdit={handleEditVehicle}
                                                onDelete={handleDeleteVehicle}
                                                onViewDetails={handleViewVehicleDetails}
                                            />
                                        ))}
                                    </div>
                                ) : hasSearched ? (
                                    <div className="no-results">
                                        <div className="no-results-icon">
                                            <Search className="w-16 h-16 text-gray-400" />
                                        </div>
                                        <h3>No vehicles found</h3>
                                        <p>
                                            {searchCriteria?.type === 'Branch' ? (
                                                searchCriteria?.error ? (
                                                    <>
                                                        There was an error searching for vehicles in <strong>{searchCriteria.value}</strong>.
                                                        <br />Please check your connection and try again.
                                                    </>
                                                ) : (
                                                    <>
                                                        No vehicles are currently available in <strong>{searchCriteria.value}</strong> branch.
                                                        <br />This could mean all vehicles are booked or none are registered for this location.
                                                    </>
                                                )
                                            ) : (
                                                'No vehicles match your current filter criteria. Try adjusting your search filters.'
                                            )}
                                        </p>
                                        <div className="no-results-actions">
                                            <button className="btn btn-primary" onClick={resetSearch}>
                                                <RefreshCw className="w-4 h-4 mr-2" />
                                                Browse All Vehicles
                                            </button>
                                            {searchCriteria?.type === 'Branch' && !searchCriteria?.error && (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={manageVehicle}
                                                >
                                                    <Car className="w-4 h-4 mr-2" />
                                                    Add Vehicle to {searchCriteria.value}
                                                </button>
                                            )}
                                            {searchCriteria?.error && (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleVehicleSearch({ branch_name: searchCriteria.value })}
                                                    disabled={isLoading}
                                                >
                                                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                                    Try Again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="default-vehicles-view">
                                        <div className="welcome-banner">
                                            <h2>🚗 Explore Our Vehicle Fleet</h2>
                                            <p>Browse through our collection of {vehicles.length} vehicles or use the search above to find specific vehicles</p>
                                        </div>
                                        <div className="vehicles-grid">
                                            {vehicles.map((vehicle) => (
                                                <VehicleCard
                                                    key={vehicle.vehicle_id}
                                                    vehicle={vehicle}
                                                    onEdit={handleEditVehicle}
                                                    onDelete={handleDeleteVehicle}
                                                    onViewDetails={handleViewVehicleDetails}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {filteredVehicles.length > 0 && (
                                    <div className="vehicle-stats">
                                        <div className="stats-summary">
                                            <h3>Fleet Summary</h3>
                                            <div className="stats-items">
                                                <div className="stat-item">
                                                    <span className="stat-label">Available:</span>
                                                    <span className="stat-value available">
                                                        {filteredVehicles.filter(v => v.status === 'available').length}
                                                    </span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Booked:</span>
                                                    <span className="stat-value booked">
                                                        {filteredVehicles.filter(v => v.status === 'booked').length}
                                                    </span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Maintenance:</span>
                                                    <span className="stat-value maintenance">
                                                        {filteredVehicles.filter(v => v.status === 'maintenance').length}
                                                    </span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-label">Avg. Price:</span>
                                                    <span className="stat-value">
                                                        LKR {filteredVehicles.length > 0 ?
                                                            Math.round(filteredVehicles.reduce((sum, v) => sum + v.price_per_day, 0) / filteredVehicles.length)
                                                            : 0}/day
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            );
        }
        return (
            <div className="other-page">
                <h1>{activeMenuItem}</h1>
                <p>Content for {activeMenuItem} coming soon...</p>
            </div>
        );
    };

    // Vehicle Details Modal Content
    const renderVehicleDetails = (vehicle) => {
        if (!vehicle) return null;

        const getStatusConfig = (status) => {
            switch (status?.toLowerCase()) {
                case 'available':
                    return { 
                        color: '#22c55e', 
                        text: 'AVAILABLE',
                        bgColor: '#dcfce7',
                        textColor: '#15803d',
                        icon: '✅'
                    };
                case 'booked':
                    return { 
                        color: '#3b82f6', 
                        text: 'BOOKED',
                        bgColor: '#dbeafe',
                        textColor: '#1d4ed8',
                        icon: '📅'
                    };
                case 'maintenance':
                    return { 
                        color: '#f59e0b', 
                        text: 'MAINTENANCE',
                        bgColor: '#fef3c7',
                        textColor: '#d97706',
                        icon: '🔧'
                    };
                case 'active':
                    return { 
                        color: '#22c55e', 
                        text: 'ACTIVE',
                        bgColor: '#dcfce7',
                        textColor: '#15803d',
                        icon: '✅'
                    };
                default:
                    return { 
                        color: '#6b7280', 
                        text: 'UNKNOWN',
                        bgColor: '#f3f4f6',
                        textColor: '#374151',
                        icon: '❓'
                    };
            }
        };

        const getVehicleIcon = (type) => {
            switch (type?.toLowerCase()) {
                case 'tuk_tuk':
                    return '🛺';
                case 'motorbike':
                    return '🏍️';
                case 'car':
                    return '🚗';
                case 'van':
                    return '🚐';
                case 'bus':
                    return '🚌';
                case 'truck':
                    return '🚚';
                default:
                    return '🚘';
            }
        };

        const getFuelIcon = (fuelType) => {
            switch (fuelType?.toLowerCase()) {
                case 'petrol':
                    return '⛽';
                case 'diesel':
                    return '🛢️';
                case 'hybrid':
                    return '🔋';
                case 'electric':
                    return '⚡';
                default:
                    return '⛽';
            }
        };

        const formatVehicleType = (type) => {
            if (!type) return 'Unknown';
            return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
        };

        const formatFuelType = (fuel) => {
            if (!fuel) return 'Unknown';
            return fuel.charAt(0).toUpperCase() + fuel.slice(1);
        };

        const handleEdit = () => {
            if (vehicle.status === 'booked') {
                toast.error(`Cannot edit "${vehicle.vehicle_model}" - Vehicle is currently booked`);
                return;
            }
            navigate(`/vehiclerental/edit/${vehicle.vehicle_id}`);
            setSelectedVehicle(null);
        };

        const handleDelete = async () => {
            if (window.confirm(`Are you sure you want to delete "${vehicle.vehicle_model}"? This action cannot be undone.`)) {
                try {
                    const token = localStorage.getItem('token');
                    
                    const response = await axios.delete(
                        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/delete_vehicle/${vehicle.vehicle_id}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    
                    if (response.data.success) {
                        toast.success(`"${vehicle.vehicle_model}" deleted successfully`);
                        setVehicles(prev => prev.filter(v => v.vehicle_id !== vehicle.vehicle_id));
                        setFilteredVehicles(prev => prev.filter(v => v.vehicle_id !== vehicle.vehicle_id));
                        setSelectedVehicle(null);
                    } else {
                        toast.error(response.data.message || 'Failed to delete vehicle');
                    }
                } catch (error) {
                    console.error('Error deleting vehicle:', error);
                    
                    let errorMessage = 'Failed to delete vehicle';
                    if (error.response?.status === 403) {
                        errorMessage = "You don't have permission to delete this vehicle";
                    } else if (error.response?.status === 404) {
                        errorMessage = "Vehicle not found";
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                    
                    toast.error(errorMessage);
                }
            }
        };

        const statusConfig = getStatusConfig(vehicle.status);
        const vehicleIcon = getVehicleIcon(vehicle.vehicle_type);
        const fuelIcon = getFuelIcon(vehicle.fuel_type);
        const canEdit = vehicle.status !== 'booked';

        return (
            <div className="vehicle-details-container">
                <style jsx>{`
                    .vehicle-details-container {
                        max-width: 100%;
                        margin: 0;
                        padding: 0;
                        background: #f8fafc;
                    }

                    .details-header {
                        background: white;
                        padding: 24px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        margin-bottom: 24px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        flex-wrap: wrap;
                        gap: 16px;
                        transition: box-shadow 0.3s ease;
                    }

                    .details-header:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .header-left {
                        display: flex;
                        align-items: center;
                        gap: 16px;
                    }

                    .back-btn {
                        display: flex;
                        align-items: center;
                        padding: 8px 16px;
                        background: #f1f5f9;
                        color: #475569;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: background 0.2s ease, transform 0.1s ease;
                    }

                    .back-btn:hover {
                        background: #e2e8f0;
                        transform: translateY(-1px);
                    }

                    .header-info h1 {
                        font-size: 28px;
                        font-weight: 700;
                        color: #1e293b;
                        margin-bottom: 4px;
                    }

                    .header-info p {
                        color: #64748b;
                        font-size: 14px;
                    }

                    .header-actions {
                        display: flex;
                        gap: 12px;
                        align-items: center;
                    }

                    .action-btn {
                        display: flex;
                        align-items: center;
                        padding: 10px 16px;
                        border: 2px solid;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: all 0.2s ease;
                        background: transparent;
                    }

                    .action-btn.secondary {
                        color: #3b82f6;
                        border-color: #3b82f6;
                    }

                    .action-btn.secondary:hover:not(.disabled) {
                        background: #3b82f6;
                        color: white;
                        transform: translateY(-1px);
                    }

                    .action-btn.danger {
                        color: #ef4444;
                        border-color: #ef4444;
                    }

                    .action-btn.danger:hover {
                        background: #ef4444;
                        color: white;
                        transform: translateY(-1px);
                    }

                    .action-btn.disabled {
                        opacity: 0.5;
                        cursor: not-allowed;
                        background: #f3f4f6 !important;
                        color: #9ca3af !important;
                        border-color: #e5e7eb !important;
                    }

                    .vehicle-content {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 24px;
                    }

                    .vehicle-gallery {
                        background: white;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        transition: box-shadow 0.3s ease;
                    }

                    .vehicle-gallery:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }

                    .main-image {
                        position: relative;
                        height: 400px;
                        overflow: hidden;
                    }

                    .vehicle-image {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }

                    .main-image:hover .vehicle-image {
                        transform: scale(1.05);
                    }

                    .image-placeholder {
                        width: 100%;
                        height: 100%;
                        background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 64px;
                        color: #64748b;
                    }

                    .status-overlay {
                        position: absolute;
                        top: 16px;
                        right: 16px;
                        padding: 8px 16px;
                        border-radius: 20px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        background: ${statusConfig.color}cc; /* Semi-transparent */
                        color: white;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                        transition: transform 0.2s ease;
                    }

                    .status-overlay:hover {
                        transform: scale(1.05);
                    }

                    .vehicle-type-overlay {
                        position: absolute;
                        top: 16px;
                        left: 16px;
                        background: rgba(255, 255, 255, 0.95);
                        backdrop-filter: blur(12px);
                        padding: 12px;
                        border-radius: 50%;
                        font-size: 24px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease;
                    }

                    .vehicle-type-overlay:hover {
                        transform: rotate(15deg);
                    }

                    .image-count-overlay {
                        position: absolute;
                        bottom: 16px;
                        right: 16px;
                        background: rgba(0, 0, 0, 0.6);
                        color: white;
                        padding: 6px 12px;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background 0.2s ease;
                    }

                    .image-count-overlay:hover {
                        background: rgba(0, 0, 0, 0.8);
                    }

                    .thumbnail-grid {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 8px;
                        padding: 16px;
                    }

                    .thumbnail {
                        height: 80px;
                        border-radius: 8px;
                        overflow: hidden;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }

                    .thumbnail:hover {
                        transform: scale(1.05);
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    }

                    .thumbnail img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        transition: transform 0.3s ease;
                    }

                    .thumbnail:hover img {
                        transform: scale(1.1);
                    }

                    .vehicle-info {
                        display: flex;
                        flex-direction: column;
                        gap: 24px;
                    }

                    .info-card {
                        background: white;
                        padding: 24px;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        transition: box-shadow 0.3s ease, transform 0.2s ease;
                    }

                    .info-card:hover {
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                        transform: translateY(-2px);
                    }

                    .card-title {
                        font-size: 18px;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 16px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    }

                    .specs-grid {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 16px;
                    }

                    .spec-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        background: #f8fafc;
                        border-radius: 8px;
                        transition: background 0.2s ease;
                    }

                    .spec-item:hover {
                        background: #eff6ff;
                    }

                    .spec-icon {
                        width: 20px;
                        height: 20px;
                        color: #64748b;
                    }

                    .spec-content {
                        flex: 1;
                    }

                    .spec-label {
                        font-size: 12px;
                        color: #64748b;
                        font-weight: 500;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }

                    .spec-value {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1e293b;
                    }

                    .status-card {
                        background: ${statusConfig.bgColor};
                        color: ${statusConfig.textColor};
                        padding: 16px;
                        border-radius: 8px;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        transition: transform 0.2s ease;
                    }

                    .status-card:hover {
                        transform: translateY(-2px);
                    }

                    .status-icon {
                        font-size: 24px;
                    }

                    .price-card {
                        text-align: center;
                        padding: 24px;
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        border-radius: 12px;
                        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
                        transition: transform 0.2s ease;
                    }

                    .price-card:hover {
                        transform: scale(1.02);
                    }

                    .price-amount {
                        font-size: 32px;
                        font-weight: 700;
                        margin-bottom: 4px;
                    }

                    .price-label {
                        font-size: 14px;
                        opacity: 0.9;
                    }

                    .features-list {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    }

                    .feature-badge {
                        background: #eff6ff;
                        color: #2563eb;
                        padding: 6px 12px;
                        border-radius: 16px;
                        font-size: 12px;
                        font-weight: 500;
                        transition: background 0.2s ease, transform 0.1s ease;
                    }

                    .feature-badge:hover {
                        background: #dbeafe;
                        transform: translateY(-1px);
                    }

                    .contact-info {
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                    }

                    .contact-item {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                        padding: 12px;
                        background: #f8fafc;
                        border-radius: 8px;
                        transition: background 0.2s ease;
                    }

                    .contact-item:hover {
                        background: #eff6ff;
                    }

                    @media (max-width: 768px) {
                        .details-header {
                            flex-direction: column;
                            align-items: flex-start;
                        }

                        .header-actions {
                            width: 100%;
                            justify-content: flex-end;
                        }

                        .vehicle-content {
                            grid-template-columns: 1fr;
                        }

                        .specs-grid {
                            grid-template-columns: 1fr;
                        }

                        .thumbnail-grid {
                            grid-template-columns: repeat(3, 1fr);
                        }
                    }
                `}</style>

                {/* Header */}
                <div className="details-header">
                    <div className="header-left">
                        <button 
                            className="back-btn" 
                            onClick={() => setSelectedVehicle(null)}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Close
                        </button>
                        <div className="header-info">
                            <h1>{vehicle.vehicle_model}</h1>
                            <p>Vehicle ID: {vehicle.vehicle_id} • {formatVehicleType(vehicle.vehicle_type)}</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button 
                            className={`action-btn secondary ${!canEdit ? 'disabled' : ''}`}
                            onClick={handleEdit}
                            title={
                                canEdit 
                                    ? `Edit ${vehicle.vehicle_model}` 
                                    : `Cannot edit ${vehicle.vehicle_model} - Currently ${vehicle.status}`
                            }
                            disabled={!canEdit}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </button>
                        <button 
                            className="action-btn danger"
                            onClick={handleDelete}
                            title={`Delete ${vehicle.vehicle_model}`}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="vehicle-content">
                    {/* Vehicle Gallery */}
                    <div className="vehicle-gallery">
                        <div className="main-image">
                            {vehicle.images && vehicle.images.length > 0 ? (
                                <img 
                                    src={vehicle.images[0]} 
                                    alt={vehicle.vehicle_model}
                                    className="vehicle-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : (
                                <div className="image-placeholder">{vehicleIcon}</div>
                            )}
                            <div className="image-placeholder" style={{display: 'none'}}>{vehicleIcon}</div>
                            
                            <div className="vehicle-type-overlay">{vehicleIcon}</div>
                            <div className="status-overlay">{statusConfig.text}</div>
                            
                            {vehicle.images && vehicle.images.length > 1 && (
                                <div className="image-count-overlay">
                                    📷 {vehicle.images.length} photos
                                </div>
                            )}
                        </div>
                        
                        {vehicle.images && vehicle.images.length > 1 && (
                            <div className="thumbnail-grid">
                                {vehicle.images.slice(1, 5).map((image, index) => (
                                    <div key={index} className="thumbnail">
                                        <img src={image} alt={`${vehicle.vehicle_model} view ${index + 2}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Vehicle Information */}
                    <div className="vehicle-info">
                        {/* Vehicle Specifications */}
                        <div className="info-card">
                            <h3 className="card-title">
                                <Car className="w-5 h-5" />
                                Vehicle Specifications
                            </h3>
                            <div className="specs-grid">
                                <div className="spec-item">
                                    <Car className="spec-icon" />
                                    <div className="spec-content">
                                        <div className="spec-label">Vehicle Type</div>
                                        <div className="spec-value">{formatVehicleType(vehicle.vehicle_type)}</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">{fuelIcon}</span>
                                    <div className="spec-content">
                                        <div className="spec-label">Fuel Type</div>
                                        <div className="spec-value">{formatFuelType(vehicle.fuel_type)}</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <Users className="spec-icon" />
                                    <div className="spec-content">
                                        <div className="spec-label">Seating Capacity</div>
                                        <div className="spec-value">{vehicle.seating_capacity} passengers</div>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <MapPin className="spec-icon" />
                                    <div className="spec-content">
                                        <div className="spec-label">Branch</div>
                                        <div className="spec-value">{vehicle.branch_name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status & Pricing */}
                        <div className="info-card">
                            <h3 className="card-title">
                                <DollarSign className="w-5 h-5" />
                                Pricing & Status
                            </h3>
                            
                            <div className="price-card">
                                <div className="price-amount">
                                    LKR {(vehicle.price_per_day || 0).toLocaleString()}
                                </div>
                                <div className="price-label">per day</div>
                            </div>
                            
                            <div className="status-card">
                                <span className="status-icon">{statusConfig.icon}</span>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '16px' }}>
                                        Status: {statusConfig.text}
                                    </div>
                                    <div style={{ fontSize: '14px', opacity: '0.8' }}>
                                        {vehicle.status === 'available' && 'Ready for rental'}
                                        {vehicle.status === 'booked' && 'Currently rented out'}
                                        {vehicle.status === 'maintenance' && 'Under maintenance'}
                                        {vehicle.status === 'active' && 'Active in fleet'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        {vehicle.features && vehicle.features.length > 0 && (
                            <div className="info-card">
                                <h3 className="card-title">
                                    <Shield className="w-5 h-5" />
                                    Features & Amenities
                                </h3>
                                <div className="features-list">
                                    {vehicle.features.map((feature, index) => (
                                        <span key={index} className="feature-badge">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Information */}
                        <div className="info-card">
                            <h3 className="card-title">
                                <Calendar className="w-5 h-5" />
                                Additional Information
                            </h3>
                            <div className="contact-info">
                                <div className="contact-item">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span>Added: {vehicle.date ? new Date(vehicle.date).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                {vehicle.vehicle_book_image && (
                                    <div className="contact-item">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        <span>Registration documents available</span>
                                    </div>
                                )}
                                {vehicle.contact_number && (
                                    <div className="contact-item">
                                        <Phone className="w-4 h-4 text-blue-500" />
                                        <span>{vehicle.contact_number}</span>
                                    </div>
                                )}
                                {vehicle.description && (
                                    <div className="contact-item">
                                        <div>
                                            <div className="spec-label">Description</div>
                                            <div style={{ marginTop: '4px', color: '#374151' }}>
                                                {vehicle.description}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
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
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    background-color: #f8fafc;
                    color: #334155;
                    line-height: 1.6;
                }
                .main-container {
                    display: flex;
                    min-height: 100vh;
                }
                .header {
                    background: white;
                    padding: 15px 20px;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 100;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .logo {
                    font-size: 24px;
                    font-weight: 800;
                    color: #0071c2;
                    background: linear-gradient(135deg, #0071c2 0%, #003580 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .search-bar {
                    flex: 1;
                    max-width: 400px;
                    margin: 0 20px;
                }
                .district-dropdown {
                    width: 100%;
                    max-width: 400px;
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    background-color: #ffffff;
                    font-size: 14px;
                    color: #374151;
                    outline: none;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .district-dropdown:hover {
                    border-color: #0071c2;
                }
                .district-dropdown:focus {
                    border-color: #0071c2;
                    box-shadow: 0 0 0 3px rgba(0, 113, 194, 0.1);
                }
                .user-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }
                .notification {
                    position: relative;
                    padding: 8px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .notification:hover {
                    border-color: #0071c2;
                }
                .notification::after {
                    content: '1';
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    border: 2px solid #e2e8f0;
                    background: white;
                    border-radius: 8px;
                    cursor: pointer;
                    position: relative;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .user-profile:hover {
                    background-color: #f8fafc;
                    border-color: #0071c2;
                }
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-top: none;
                    border-radius: 0 0 8px 8px;
                    min-width: 220px;
                    z-index: 1000;
                    display: none;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                }
                .dropdown-menu.show {
                    display: block;
                }
                .dropdown-header {
                    padding: 12px 16px;
                    font-weight: 600;
                    border-bottom: 1px solid #e2e8f0;
                    color: #374151;
                    background-color: #f8fafc;
                }
                .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    border-bottom: 1px solid #f1f5f9;
                    transition: background-color 0.2s;
                    color: #475569;
                }
                .dropdown-item:hover {
                    background-color: #f8fafc;
                    color: #0071c2;
                }
                .dropdown-item:last-child {
                    border-bottom: none;
                }
                .sidebar {
                    width: 250px;
                    background: white;
                    border-right: 1px solid #e2e8f0;
                    margin-top: 70px;
                    position: fixed;
                    height: calc(100vh - 70px);
                    overflow-y: auto;
                    box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.05);
                }
                .sidebar-item {
                    padding: 16px 20px;
                    border-bottom: 1px solid #f1f5f9;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .sidebar-item:hover {
                    background-color: #f8fafc;
                    color: #0071c2;
                }
                .sidebar-item.active {
                    background: linear-gradient(135deg, #0071c2 0%, #003580 100%);
                    color: white;
                }
                .main-content {
                    flex: 1;
                    margin-left: 250px;
                    margin-top: 70px;
                    padding: 0;
                    min-height: calc(100vh - 70px);
                }
                .vehicles-page {
                    background: #f8fafc;
                    padding: 24px;
                }
                .vehicles-content {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .enhanced-search-container {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    margin-bottom: 24px;
                    overflow: hidden;
                }
                .search-header {
                    background: linear-gradient(135deg, #0071c2 0%, #003580 100%);
                    color: white;
                    padding: 24px;
                    text-align: center;
                }
                .search-title {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 8px;
                }
                .search-subtitle {
                    opacity: 0.9;
                    font-size: 16px;
                }
                .main-search-bar {
                    padding: 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    gap: 16px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .search-input-group {
                    position: relative;
                    flex: 1;
                    min-width: 250px;
                }
                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    color: #6b7280;
                    z-index: 1;
                }
                .search-select {
                    width: 100%;
                    padding: 12px 12px 12px 44px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    font-size: 16px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .search-select:focus {
                    outline: none;
                    border-color: #0071c2;
                    box-shadow: 0 0 0 3px rgba(0, 113, 194, 0.1);
                }
                .search-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .filter-toggle-btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    border: 2px solid #e5e7eb;
                    border-radius: 8px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }
                .filter-toggle-btn:hover {
                    border-color: #0071c2;
                    color: #0071c2;
                }
                .filter-toggle-btn.active {
                    background: #0071c2;
                    border-color: #0071c2;
                    color: white;
                }
                .search-btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 24px;
                    background: #0071c2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }
                .search-btn:hover {
                    background: #005bb5;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 113, 194, 0.3);
                }
                .search-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                .clear-btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 16px;
                    background: #ef4444;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .clear-btn:hover {
                    background: #dc2626;
                }
                .advanced-filters {
                    padding: 24px;
                    background: #f8fafc;
                    border-top: 1px solid #e5e7eb;
                }
                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 24px;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .filter-label {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                .filter-select,
                .filter-input {
                    padding: 10px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                }
                .filter-select:focus,
                .filter-input:focus {
                    outline: none;
                    border-color: #0071c2;
                    box-shadow: 0 0 0 3px rgba(0, 113, 194, 0.1);
                }
                .price-range {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .price-input {
                    flex: 1;
                }
                .price-separator {
                    color: #6b7280;
                    font-weight: 500;
                }
                .active-filters {
                    padding: 16px 24px;
                    background: #eff6ff;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .active-filters-label {
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }
                .active-filters-list {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .active-filter-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 8px;
                    background: #0071c2;
                    color: white;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .active-filter-tag button {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    padding: 2px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .active-filter-tag button:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                .search-results-header {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    margin-bottom: 24px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                .results-info {
                    flex: 1;
                }
                .results-title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 4px;
                }
                .error-indicator {
                    color: #ef4444;
                    font-size: 14px;
                }
                .results-count {
                    color: #64748b;
                    font-size: 14px;
                }
                .error-text {
                    color: #ef4444;
                    font-weight: 500;
                }
                .branch-info {
                    color: #0071c2;
                    font-weight: 500;
                }
                .search-actions {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    flex-wrap: wrap;
                }
                .reset-search-btn {
                    display: flex;
                    align-items: center;
                    padding: 10px 16px;
                    background: #f1f5f9;
                    color: #475569;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .reset-search-btn:hover {
                    background: #e2e8f0;
                    border-color: #cbd5e1;
                }
                .retry-search-btn {
                    display: flex;
                    align-items: center;
                    padding: 10px 16px;
                    background: #0071c2;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }
                .retry-search-btn:hover:not(:disabled) {
                    background: #005bb5;
                }
                .retry-search-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .loading-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .loading-state h3 {
                    font-size: 20px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                }
                .loading-state p {
                    color: #6b7280;
                    font-size: 14px;
                }
                .vehicles-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
                    gap: 20px;
                    margin-bottom: 32px;
                    justify-items: center;
                }
                .vehicle-card-container {
                    width: 100%;
                    max-width: 400px;
                    margin: 0;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    transition: all 0.3s ease;
                    position: relative;
                }
               
                .vehicle-card-container:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                }
               
                .vehicle-image-section {
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
               
                .vehicle-card-container:hover .vehicle-image {
                    transform: scale(1.05);
                }
               
                .vehicle-image-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                    color: #64748b;
                }
               
                .status-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                }
               
                .vehicle-type-indicator {
                    position: absolute;
                    top: 12px;
                    left: 12px;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(10px);
                    padding: 8px;
                    border-radius: 50%;
                    font-size: 20px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
               
                .vehicle-content {
                    padding: 20px;
                }
               
                .vehicle-header {
                    margin-bottom: 15px;
                }
               
                .vehicle-name {
                    font-size: 20px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 8px;
                    line-height: 1.3;
                }
               
                .vehicle-location {
                    display: flex;
                    align-items: center;
                    color: #64748b;
                    font-size: 14px;
                    margin-bottom: 8px;
                }
               
                .location-icon {
                    margin-right: 6px;
                }
               
                .vehicle-id {
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 500;
                }
               
                .vehicle-specs {
                    margin-bottom: 15px;
                }
               
                .specs-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                    margin-bottom: 15px;
                }
               
                .spec-item {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    color: #475569;
                    background: #f8fafc;
                    padding: 8px 10px;
                    border-radius: 8px;
                }
               
                .spec-icon {
                    margin-right: 6px;
                    font-size: 14px;
                }
               
                .spec-label {
                    font-weight: 500;
                    color: #374151;
                }
                .vehicle-features {
                    margin-bottom: 15px;
                }
               
                .features-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                }
               
                .features-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }
               
                .feature-badge {
                    background: #eff6ff;
                    color: #2563eb;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }
               
                .vehicle-price {
                    font-size: 18px;
                    font-weight: 700;
                    color: #059669;
                    margin-bottom: 8px;
                }
               
                .price-label {
                    font-size: 12px;
                    color: #6b7280;
                }
               
                .vehicle-status-info {
                    display: flex;
                    align-items: center;
                    font-size: 13px;
                    margin-bottom: 15px;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-weight: 500;
                }
               
                .status-icon {
                    margin-right: 6px;
                }
               
                .registration-info {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 10px;
                }
               
                .vehicle-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 20px;
                    align-items: center;
                }
               
                .btn-view-details {
                    flex: 1;
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    text-decoration: none;
                    text-align: center;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
               
                .btn-view-details:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                    text-decoration: none;
                    color: white;
                }
               
                .action-buttons {
                    display: flex;
                    gap: 8px;
                }
               
                .action-btn {
                    padding: 10px;
                    border: 2px solid;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                }
               
                .action-btn.secondary {
                    color: #3b82f6;
                    border-color: #3b82f6;
                }
               
                .action-btn.secondary:hover:not(.disabled) {
                    background: #3b82f6;
                    color: white;
                    transform: translateY(-1px);
                }
               
                .action-btn.danger {
                    color: #ef4444;
                    border-color: #ef4444;
                }
               
                .action-btn.danger:hover {
                    background: #ef4444;
                    color: white;
                    transform: translateY(-1px);
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
                .book-image-indicator {
                    position: absolute;
                    bottom: 12px;
                    left: 12px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 500;
                }
                .image-count {
                    position: absolute;
                    bottom: 12px;
                    right: 12px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 10px;
                    font-weight: 500;
                }
                .no-results {
                    background: white;
                    padding: 80px 40px;
                    text-align: center;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .no-results-icon {
                    margin-bottom: 24px;
                }
                .no-results h3 {
                    color: #374151;
                    margin-bottom: 16px;
                    font-size: 24px;
                    font-weight: 600;
                }
                .no-results p {
                    color: #6b7280;
                    margin-bottom: 32px;
                    font-size: 16px;
                    max-width: 500px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .no-results-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                .default-vehicles-view {
                    margin-bottom: 32px;
                }
                .welcome-banner {
                    background: white;
                    padding: 40px;
                    text-align: center;
                    border-radius: 12px;
                    margin-bottom: 32px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .welcome-banner h2 {
                    color: #1e293b;
                    margin-bottom: 12px;
                    font-size: 28px;
                    font-weight: 700;
                }
                .welcome-banner p {
                    color: #64748b;
                    font-size: 16px;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .vehicle-stats {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .stats-summary h3 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 16px;
                }
                .stats-items {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 16px;
                }
                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 16px;
                    background: #f8fafc;
                    border-radius: 8px;
                }
                .stat-label {
                    font-weight: 500;
                    color: #64748b;
                    font-size: 14px;
                }
                .stat-value {
                    font-weight: 600;
                    font-size: 16px;
                }
                .stat-value.available {
                    color: #059669;
                }
                .stat-value.booked {
                    color: #0071c2;
                }
                .stat-value.maintenance {
                    color: #d97706;
                }
                .welcome-section {
                    background: linear-gradient(135deg, #0071c2 0%, #003580 100%);
                    color: white;
                    padding: 40px;
                    margin-bottom: 30px;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .welcome-section h1 {
                    font-size: 32px;
                    margin-bottom: 12px;
                    font-weight: 700;
                }
                .welcome-section p {
                    margin-bottom: 24px;
                    opacity: 0.9;
                    font-size: 16px;
                }
                .action-buttons {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }
                .btn-primary {
                    background: white;
                    color: #0071c2;
                }
                .btn-primary:hover {
                    background: #f8fafc;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 113, 194, 0.15);
                }
                .btn-secondary {
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                }
                .btn-secondary:hover {
                    background: white;
                    color: #0071c2;
                }
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 24px;
                    margin-bottom: 40px;
                }
                .stat-card {
                    background: white;
                    padding: 24px;
                    border-radius: 12px;
                    text-align: center;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                    transition: all 0.2s ease;
                }
                .stat-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
                }
                .stat-card .number {
                    font-size: 32px;
                    font-weight: 700;
                    margin-bottom: 8px;
                    color: #0071c2;
                }
                .stat-card .label {
                    color: #64748b;
                    margin-bottom: 8px;
                    font-weight: 500;
                }
                .stat-card .change {
                    font-size: 12px;
                    font-weight: 500;
                }
                .change.positive {
                    color: #059669;
                }
                .quick-actions {
                    background: white;
                    padding: 32px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .quick-actions h2 {
                    margin-bottom: 24px;
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                }
                .actions-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                }
                .action-card {
                    padding: 24px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: white;
                }
                .action-card:hover {
                    border-color: #0071c2;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0, 113, 194, 0.15);
                }
                .action-card h3 {
                    margin-bottom: 12px;
                    font-size: 18px;
                    font-weight: 600;
                    color: #374151;
                }
                .action-card p {
                    font-size: 14px;
                    color: #6b7280;
                }
                .other-page {
                    padding: 40px;
                    text-align: center;
                    background: white;
                    margin: 24px;
                    border-radius: 12px;
                    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
                }
                .other-page h1 {
                    font-size: 32px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 16px;
                }
                .other-page p {
                    color: #6b7280;
                    font-size: 16px;
                }
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }
                .modal-content {
                    background: white;
                    border-radius: 8px;
                    max-width: 1200px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    padding: 20px;
                    position: relative;
                }
                @media (max-width: 1024px) {
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
                    .vehicles-grid {
                        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    }
                }
                @media (max-width: 768px) {
                    .header {
                        padding: 12px 16px;
                        flex-wrap: wrap;
                    }
                    .search-bar {
                        order: 3;
                        width: 100%;
                        margin: 12px 0 0 0;
                    }
                    .vehicles-page {
                        padding: 16px;
                    }
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                    .search-results-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .no-results {
                        padding: 60px 24px;
                    }
                    .welcome-banner {
                        padding: 24px;
                    }
                    .stats-items {
                        grid-template-columns: 1fr;
                    }
                    .vehicles-grid {
                        grid-template-columns: 1fr;
                    }
                    .main-search-bar {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .search-actions {
                        justify-content: center;
                    }
                    .filters-grid {
                        grid-template-columns: 1fr;
                    }
                    .active-filters {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                    .modal-content {
                        width: 95%;
                        padding: 16px;
                    }
                }
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
            <div className="header">
                <div className="logo">TourNexus</div>
                <div className="search-bar">
                    <select
                        className="district-dropdown"
                        onChange={(e) => handleVehicleSearch({ branch_name: e.target.value })}
                        defaultValue="All Branches"
                    >
                        {[
                            'All Branches', 'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
                            'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
                            'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
                            'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
                            'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle',
                        ].map((district) => (
                            <option key={district} value={district}>
                                📍 {district}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="user-section">
                    {/* <div className="notification"></div> */}
                    <div className="user-profile" onClick={toggleDropdown}>
                        <span>🔄 Change Account ▼</span>
                        <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                            <div className="dropdown-header">Switch Account Type</div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Guide')}>
                                🗺️ Tour Guide
                            </div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Hotel Owner')}>
                                🏨 Hotel Owner
                            </div>
                            <div className="dropdown-item" onClick={() => moveToAccount('Vehicle Rental Company')}>
                                🚗 Vehicle Rental
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="main-container">
                <div className="sidebar">
                    <div
                        className={`sidebar-item ${activeMenuItem === 'Dashboard' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('Dashboard')}
                    >
                        <span>📊</span>
                        <span>Dashboard</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeMenuItem === 'Vehicles' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('Vehicles')}
                    >
                        <span>🚗</span>
                        <span>Vehicles</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeMenuItem === 'Bookings' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('Bookings')}
                    >
                        <span>📋</span>
                        <span>Bookings</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeMenuItem === 'Profile' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('Profile')}
                    >
                        <span>👤</span>
                        <span>Profile</span>
                    </div>
                    <div
                        className={`sidebar-item ${activeMenuItem === 'Settings' ? 'active' : ''}`}
                        onClick={() => handleMenuItemClick('Settings')}
                    >
                        <span>⚙️</span>
                        <span>Settings</span>
                    </div>
                </div>
                <div className="main-content">{renderContent()}</div>
                {selectedVehicle && (
                    <div className="modal-overlay" onClick={() => setSelectedVehicle(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            {renderVehicleDetails(selectedVehicle)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}