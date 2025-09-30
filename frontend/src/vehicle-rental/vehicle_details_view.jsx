import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, Edit, Trash2, Car, Users, Fuel, MapPin, 
    Calendar, DollarSign, Shield, Wifi, Coffee, Music,
    Navigation, Phone, Mail, RefreshCw, AlertCircle
} from 'lucide-react';

const VehicleDetailsView = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [vehicle, setVehicle] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch vehicle details or use passed state
    useEffect(() => {
        if (location.state?.vehicle) {
            setVehicle(location.state.vehicle);
            setIsLoading(false);
            setError(null);
        } else if (vehicleId) {
            const fetchVehicleDetails = async () => {
                try {
                    setIsLoading(true);
                    setError(null);

                    const response = await axios.get(
                        `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/view_vehicle_by_id/${vehicleId}`
                    );

                    if (response.data.success) {
                        setVehicle(response.data.data);
                    } else {
                        setError(response.data.message || 'Failed to fetch vehicle details');
                    }
                } catch (error) {
                    console.error('Error fetching vehicle details:', error);
                    
                    let errorMessage = 'Failed to load vehicle details';
                    if (error.response?.status === 404) {
                        errorMessage = 'Vehicle not found';
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    }
                    
                    setError(errorMessage);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchVehicleDetails();
        } else {
            setError('Invalid vehicle ID');
            setIsLoading(false);
        }
    }, [vehicleId, location.state]);

    // Get vehicle status configuration
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

    // Format text for display
    const formatVehicleType = (type) => {
        if (!type) return 'Unknown';
        return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatFuelType = (fuel) => {
        if (!fuel) return 'Unknown';
        return fuel.charAt(0).toUpperCase() + fuel.slice(1);
    };

    // Handle edit vehicle
    const handleEdit = () => {
        if (vehicle.status === 'booked') {
            toast.error(`Cannot edit "${vehicle.vehicle_model}" - Vehicle is currently booked`);
            return;
        }
        navigate(`/vehiclerental/edit/${vehicleId}`);
    };

    // Handle delete vehicle
    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${vehicle.vehicle_model}"? This action cannot be undone.`)) {
            try {
                const token = localStorage.getItem('token');
                
                const response = await axios.delete(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/delete_vehicle/${vehicleId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                
                if (response.data.success) {
                    toast.success(`"${vehicle.vehicle_model}" deleted successfully`);
                    navigate('/vehiclerental/dashboard');
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

    // Loading state
    if (isLoading) {
        return (
            <div className="vehicle-details-container">
                <div className="loading-state">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <h3>Loading vehicle details...</h3>
                    <p>Please wait while we fetch the vehicle information</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="vehicle-details-container">
                <div className="error-state">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3>Failed to Load Vehicle</h3>
                    <p>{error}</p>
                    <div className="error-actions">
                        <button 
                            className="btn btn-primary" 
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </button>
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => navigate('/vehiclerental/dashboard')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main render
    if (!vehicle) {
        return (
            <div className="vehicle-details-container">
                <div className="error-state">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3>Vehicle Not Found</h3>
                    <p>The requested vehicle could not be found.</p>
                    <button 
                        className="btn btn-primary" 
                        onClick={() => navigate('/vehiclerental/dashboard')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const statusConfig = getStatusConfig(vehicle.status);
    const vehicleIcon = getVehicleIcon(vehicle.vehicle_type);
    const fuelIcon = getFuelIcon(vehicle.fuel_type);
    const canEdit = vehicle.status !== 'booked';

    return (
        <div className="vehicle-details-container">
            <style jsx>{`
                .vehicle-details-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 24px;
                    background: #f8fafc;
                    min-height: 100vh;
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

                .loading-state,
                .error-state {
                    text-align: center;
                    padding: 80px 40px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .loading-state h3,
                .error-state h3 {
                    font-size: 24px;
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 8px;
                }

                .loading-state p,
                .error-state p {
                    color: #6b7280;
                    margin-bottom: 24px;
                }

                .error-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    display: flex;
                    align-items: center;
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    text-decoration: none;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .btn-primary:hover {
                    background: #2563eb;
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: #f1f5f9;
                    color: #475569;
                }

                .btn-secondary:hover {
                    background: #e2e8f0;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .vehicle-details-container {
                        padding: 16px;
                    }

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

                    .error-actions {
                        flex-direction: column;
                        align-items: center;
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

            {/* Header */}
            <div className="details-header">
                <div className="header-left">
                    <button 
                        className="back-btn" 
                        onClick={() => navigate('/vehiclerental/dashboard')}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
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

export default VehicleDetailsView;