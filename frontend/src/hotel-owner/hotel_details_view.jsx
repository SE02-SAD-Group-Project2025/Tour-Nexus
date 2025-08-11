import { useState, useEffect } from 'react';
import { 
    ArrowLeft, MapPin, Phone, Mail, Calendar, Building, Bed, Car, 
    Wifi, Coffee, Shield, Star, Edit, Trash2, Eye, EyeOff, Users,
    CheckCircle, Clock, XCircle, Image as ImageIcon, Info, Tag
} from 'lucide-react';

function HotelDetailsView({ hotel, onBack, onEdit, onDelete }) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllImages, setShowAllImages] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Status styling function
    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved':
                return {
                    bg: 'bg-green-50',
                    text: 'text-green-700',
                    border: 'border-green-200',
                    icon: CheckCircle,
                    color: '#16a34a'
                };
            case 'pending':
                return {
                    bg: 'bg-yellow-50',
                    text: 'text-yellow-700',
                    border: 'border-yellow-200',
                    icon: Clock,
                    color: '#ca8a04'
                };
            case 'rejected':
                return {
                    bg: 'bg-red-50',
                    text: 'text-red-700',
                    border: 'border-red-200',
                    icon: XCircle,
                    color: '#dc2626'
                };
            default:
                return {
                    bg: 'bg-gray-50',
                    text: 'text-gray-700',
                    border: 'border-gray-200',
                    icon: Info,
                    color: '#6b7280'
                };
        }
    };

    const statusStyle = getStatusStyle(hotel.status);
    const StatusIcon = statusStyle.icon;

    // Calculate total revenue potential
    const calculateRevenuePotential = () => {
        if (!hotel.room_types || hotel.room_types.length === 0) return 0;
        
        return hotel.room_types.reduce((total, room) => {
            return total + (room.price * room.count * 30); // Monthly potential
        }, 0);
    };

    const revenuePotential = calculateRevenuePotential();

    return (
        <div className="hotel-details-container">
            {/* Header Section */}
            <div className="details-header">
                <div className="header-top">
                    <button 
                        onClick={onBack}
                        className="back-button"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to My Hotels
                    </button>
                    
                    <div className="header-actions">
                        <button 
                            onClick={() => onEdit(hotel.hotel_id, hotel.hotel_name)}
                            className="action-button edit-button"
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit Hotel
                        </button>
                        <button 
                            onClick={() => onDelete(hotel.hotel_id, hotel.hotel_name)}
                            className="action-button delete-button"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Hotel
                        </button>
                    </div>
                </div>

                <div className="hotel-title-section">
                    <div className="title-info">
                        <h1 className="hotel-title">{hotel.hotel_name}</h1>
                        <div className="hotel-metadata">
                            <span className="hotel-id-display">ID: {hotel.hotel_id}</span>
                            <div className={`status-badge-large ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                <StatusIcon className="w-4 h-4 mr-2" />
                                {hotel.status}
                            </div>
                        </div>
                    </div>
                    
                    <div className="quick-stats">
                        <div className="stat-item">
                            <Bed className="w-5 h-5 text-blue-600" />
                            <span>{hotel.total_rooms} Rooms</span>
                        </div>
                        <div className="stat-item">
                            <Building className="w-5 h-5 text-blue-600" />
                            <span>{hotel.room_types?.length || 0} Room Types</span>
                        </div>
                        <div className="stat-item">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <span>{hotel.city}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Gallery Section */}
            {hotel.hasImages && (
                <div className="image-gallery-section">
                    <div className="main-image-container">
                        <img
                            src={hotel.images[selectedImageIndex]}
                            alt={`${hotel.hotel_name} - Image ${selectedImageIndex + 1}`}
                            className="main-image"
                            onError={(e) => {
                                e.target.src = '/placeholder-hotel.jpg';
                            }}
                        />
                        <div className="image-overlay">
                            <span className="image-counter">
                                {selectedImageIndex + 1} / {hotel.images.length}
                            </span>
                        </div>
                    </div>
                    
                    {hotel.images.length > 1 && (
                        <div className="thumbnail-gallery">
                            {hotel.images.slice(0, showAllImages ? hotel.images.length : 5).map((image, index) => (
                                <div
                                    key={index}
                                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                                </div>
                            ))}
                            
                            {hotel.images.length > 5 && (
                                <button
                                    className="show-more-images"
                                    onClick={() => setShowAllImages(!showAllImages)}
                                >
                                    {showAllImages ? (
                                        <>
                                            <EyeOff className="w-4 h-4 mr-1" />
                                            Show Less
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="w-4 h-4 mr-1" />
                                            +{hotel.images.length - 5} More
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Tab Navigation */}
            <div className="tab-navigation">
                {['overview', 'rooms', 'details', 'analytics'].map((tab) => (
                    <button
                        key={tab}
                        className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
                {activeTab === 'overview' && (
                    <div className="overview-content">
                        <div className="content-grid">
                            {/* Basic Information Card */}
                            <div className="info-card">
                                <h3 className="card-title">Basic Information</h3>
                                <div className="info-list">
                                    <div className="info-item">
                                        <Building className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="label">Hotel Name</span>
                                            <span className="value">{hotel.hotel_name}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <MapPin className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="label">Location</span>
                                            <span className="value">{hotel.address}, {hotel.city}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <Phone className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="label">Contact</span>
                                            <span className="value">{hotel.contact_number || 'Not provided'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <Mail className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="label">Email</span>
                                            <span className="value">{hotel.email}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="info-item">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <span className="label">Registered</span>
                                            <span className="value">{hotel.registrationDate}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities Card */}
                            <div className="info-card">
                                <h3 className="card-title">Amenities & Features</h3>
                                <div className="amenities-grid">
                                    <div className={`amenity-item ${hotel.parking_available ? 'available' : 'unavailable'}`}>
                                        <Car className="w-5 h-5" />
                                        <span>Parking</span>
                                        {hotel.parking_available ? (
                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                        ) : (
                                            <XCircle className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                    
                                    {/* <div className="amenity-item available">
                                        <Wifi className="w-5 h-5" />
                                        <span>WiFi</span>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                    
                                    <div className="amenity-item available">
                                        <Coffee className="w-5 h-5" />
                                        <span>Dining</span>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                    
                                    <div className="amenity-item available">
                                        <Shield className="w-5 h-5" />
                                        <span>Security</span>
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        {/* Description Section */}
                        {hotel.description && (
                            <div className="description-section">
                                <h3 className="section-title">Description</h3>
                                <p className="description-text">{hotel.description}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'rooms' && (
                    <div className="rooms-content">
                        <div className="rooms-header">
                            <h3 className="section-title">Room Types & Pricing</h3>
                            <div className="rooms-summary">
                                <span>{hotel.room_types?.length || 0} room types available</span>
                                <span>•</span>
                                <span>{hotel.total_rooms} total rooms</span>
                            </div>
                        </div>

                        <div className="rooms-grid">
                            {hotel.room_types && hotel.room_types.length > 0 ? (
                                hotel.room_types.map((room, index) => (
                                    <div key={index} className="room-card">
                                        <div className="room-header">
                                            <h4 className="room-name">{room.name || room.type}</h4>
                                            <div className="room-price">
                                                LKR {room.price.toLocaleString()}
                                                <span className="price-period">/night</span>
                                            </div>
                                        </div>
                                        
                                        <div className="room-info">
                                            <div className="room-stat">
                                                <Bed className="w-4 h-4 text-gray-500" />
                                                <span>{room.count} rooms available</span>
                                            </div>
                                            
                                            <div className="room-stat">
                                                <Users className="w-4 h-4 text-gray-500" />
                                                <span>Up to 2 guests</span>
                                            </div>
                                        </div>

                                        {room.facilities && room.facilities.length > 0 && (
                                            <div className="room-facilities">
                                                <span className="facilities-label">Facilities:</span>
                                                <div className="facilities-list">
                                                    {room.facilities.slice(0, 3).map((facility, fIndex) => (
                                                        <span key={fIndex} className="facility-tag">
                                                            {facility}
                                                        </span>
                                                    ))}
                                                    {room.facilities.length > 3 && (
                                                        <span className="facility-tag more">
                                                            +{room.facilities.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="room-revenue">
                                            <span className="revenue-label">Monthly Potential:</span>
                                            <span className="revenue-amount">
                                                LKR {(room.price * room.count * 30).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-rooms">
                                    <Bed className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p>No room types configured</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'details' && (
                    <div className="details-content">
                        <div className="details-grid">
                            <div className="detail-section">
                                <h4 className="detail-title">Technical Details</h4>
                                <div className="detail-list">
                                    <div className="detail-row">
                                        <span className="detail-label">Hotel ID:</span>
                                        <span className="detail-value">{hotel.hotel_id}</span>
                                    </div>
                                    {/* <div className="detail-row">
                                        <span className="detail-label">Database ID:</span>
                                        <span className="detail-value">{hotel.id}</span>
                                    </div> */}
                                    <div className="detail-row">
                                        <span className="detail-label">Status:</span>
                                        <span className="detail-value">{hotel.status}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Registration Date:</span>
                                        <span className="detail-value">{hotel.registrationDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h4 className="detail-title">Media Information</h4>
                                <div className="detail-list">
                                    <div className="detail-row">
                                        <span className="detail-label">Total Images:</span>
                                        <span className="detail-value">{hotel.images?.length || 0}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Has Gallery:</span>
                                        <span className="detail-value">{hotel.hasImages ? 'Yes' : 'No'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="analytics-content">
                        <div className="analytics-grid">
                            <div className="analytics-card">
                                <h4 className="analytics-title">Revenue Potential</h4>
                                <div className="analytics-value">
                                    LKR {revenuePotential.toLocaleString()}
                                </div>
                                <div className="analytics-label">Monthly Potential (100% occupancy)</div>
                            </div>

                            <div className="analytics-card">
                                <h4 className="analytics-title">Room Utilization</h4>
                                <div className="analytics-value">{hotel.total_rooms}</div>
                                <div className="analytics-label">Total Available Rooms</div>
                            </div>

                            <div className="analytics-card">
                                <h4 className="analytics-title">Average Room Price</h4>
                                <div className="analytics-value">
                                    LKR {hotel.room_types && hotel.room_types.length > 0 
                                        ? Math.round(hotel.room_types.reduce((sum, room) => sum + room.price, 0) / hotel.room_types.length).toLocaleString()
                                        : 0
                                    }
                                </div>
                                <div className="analytics-label">Per Night</div>
                            </div>

                            <div className="analytics-card">
                                <h4 className="analytics-title">Room Categories</h4>
                                <div className="analytics-value">{hotel.room_types?.length || 0}</div>
                                <div className="analytics-label">Different Room Types</div>
                            </div>
                        </div>

                        {hotel.room_types && hotel.room_types.length > 0 && (
                            <div className="pricing-breakdown">
                                <h4 className="section-title">Pricing Breakdown</h4>
                                <div className="pricing-table">
                                    <div className="table-header">
                                        <span>Room Type</span>
                                        <span>Count</span>
                                        <span>Price/Night</span>
                                        <span>Monthly Potential</span>
                                    </div>
                                    {hotel.room_types.map((room, index) => (
                                        <div key={index} className="table-row">
                                            <span className="room-type-name">{room.name || room.type}</span>
                                            <span>{room.count}</span>
                                            <span>LKR {room.price.toLocaleString()}</span>
                                            <span>LKR {(room.price * room.count * 30).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style jsx>{`
                .hotel-details-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .details-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                }

                .header-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    backdrop-filter: blur(10px);
                }

                .back-button:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: translateY(-1px);
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .action-button {
                    display: flex;
                    align-items: center;
                    padding: 10px 16px;
                    border-radius: 8px;
                    border: none;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .edit-button {
                    background: rgba(34, 197, 94, 0.9);
                    color: white;
                }

                .edit-button:hover {
                    background: rgba(34, 197, 94, 1);
                    transform: translateY(-1px);
                }

                .delete-button {
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                }

                .delete-button:hover {
                    background: rgba(239, 68, 68, 1);
                    transform: translateY(-1px);
                }

                .hotel-title-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }

                .title-info h1 {
                    font-size: 32px;
                    margin: 0 0 10px 0;
                    font-weight: 700;
                }

                .hotel-metadata {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .hotel-id-display {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 12px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 14px;
                }

                .status-badge-large {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border: 2px solid;
                }

                .quick-stats {
                    display: flex;
                    gap: 24px;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 16px;
                    font-weight: 500;
                }

                .image-gallery-section {
                    padding: 0;
                }

                .main-image-container {
                    position: relative;
                    height: 400px;
                    overflow: hidden;
                }

                .main-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-overlay {
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                }

                .thumbnail-gallery {
                    display: flex;
                    gap: 8px;
                    padding: 16px;
                    overflow-x: auto;
                }

                .thumbnail {
                    width: 80px;
                    height: 60px;
                    border-radius: 6px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 2px solid transparent;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .thumbnail.active {
                    border-color: #3b82f6;
                    transform: scale(1.05);
                }

                .thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .show-more-images {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 60px;
                    background: rgba(59, 130, 246, 0.1);
                    border: 2px dashed #3b82f6;
                    border-radius: 6px;
                    color: #3b82f6;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                .show-more-images:hover {
                    background: rgba(59, 130, 246, 0.2);
                }

                .tab-navigation {
                    display: flex;
                    border-bottom: 2px solid #f1f5f9;
                    background: #f8fafc;
                }

                .tab-button {
                    padding: 16px 32px;
                    background: none;
                    border: none;
                    font-size: 16px;
                    font-weight: 500;
                    color: #64748b;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .tab-button.active {
                    color: #3b82f6;
                }

                .tab-button.active::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background: #3b82f6;
                }

                .tab-button:hover:not(.active) {
                    color: #475569;
                    background: rgba(59, 130, 246, 0.05);
                }

                .tab-content {
                    padding: 30px;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                    margin-bottom: 30px;
                }

                .info-card {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                }

                .info-list {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .info-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                }

                .info-item > div {
                    flex: 1;
                }

                .label {
                    display: block;
                    font-size: 14px;
                    color: #64748b;
                    margin-bottom: 4px;
                }

                .value {
                    display: block;
                    font-size: 16px;
                    font-weight: 500;
                    color: #1e293b;
                }

                .amenities-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .amenity-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px;
                    background: white;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                }

                .amenity-item.available {
                    background: rgba(34, 197, 94, 0.05);
                    border-color: rgba(34, 197, 94, 0.2);
                }

                .amenity-item.unavailable {
                    background: rgba(239, 68, 68, 0.05);
                    border-color: rgba(239, 68, 68, 0.2);
                    opacity: 0.7;
                }

                .description-section {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 16px;
                }

                .description-text {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #475569;
                }

                .rooms-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .rooms-summary {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    font-size: 14px;
                }

                .rooms-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 20px;
                }

                .room-card {
                    background: white;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 20px;
                    transition: all 0.2s ease;
                }

                .room-card:hover {
                    border-color: #3b82f6;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
                }

                .room-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 16px;
                }

                .room-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .room-price {
                    font-size: 20px;
                    font-weight: 700;
                    color: #3b82f6;
                    text-align: right;
                }

                .price-period {
                    font-size: 14px;
                    font-weight: 400;
                    color: #64748b;
                    display: block;
                }

                .room-info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 16px;
                }

                .room-stat {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #64748b;
                    font-size: 14px;
                }

                .room-facilities {
                    margin-bottom: 16px;
                }

                .facilities-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: #374151;
                    display: block;
                    margin-bottom: 8px;
                }

                .facilities-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .facility-tag {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .facility-tag.more {
                    background: #f1f5f9;
                    color: #64748b;
                }

                .room-revenue {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #e2e8f0;
                }

                .revenue-label {
                    font-size: 14px;
                    color: #64748b;
                }

                .revenue-amount {
                    font-size: 16px;
                    font-weight: 600;
                    color: #059669;
                }

                .no-rooms {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #64748b;
                }

                .details-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 30px;
                }

                .detail-section {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .detail-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 16px;
                }

                .detail-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }

                .detail-row:last-child {
                    border-bottom: none;
                }

                .detail-label {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 500;
                }

                .detail-value {
                    font-size: 14px;
                    color: #1e293b;
                    font-weight: 500;
                    font-family: monospace;
                }

                .analytics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .analytics-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 24px;
                    border-radius: 12px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .analytics-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255, 255, 255, 0.1);
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .analytics-card:hover::before {
                    opacity: 1;
                }

                .analytics-title {
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    opacity: 0.9;
                }

                .analytics-value {
                    font-size: 28px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .analytics-label {
                    font-size: 12px;
                    opacity: 0.8;
                }

                .pricing-breakdown {
                    background: #f8fafc;
                    padding: 24px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }

                .pricing-table {
                    background: white;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }

                .table-header {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
                    gap: 16px;
                    padding: 16px;
                    background: #f1f5f9;
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                }

                .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1.5fr 1.5fr;
                    gap: 16px;
                    padding: 16px;
                    border-top: 1px solid #e2e8f0;
                    font-size: 14px;
                    align-items: center;
                }

                .table-row:hover {
                    background: #f8fafc;
                }

                .room-type-name {
                    font-weight: 500;
                    color: #1e293b;
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .content-grid {
                        grid-template-columns: 1fr;
                    }

                    .details-grid {
                        grid-template-columns: 1fr;
                    }

                    .analytics-grid {
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    }

                    .table-header,
                    .table-row {
                        grid-template-columns: 1.5fr 0.5fr 1fr 1fr;
                        gap: 12px;
                    }
                }

                @media (max-width: 768px) {
                    .hotel-details-container {
                        margin: 0;
                        border-radius: 0;
                    }

                    .details-header {
                        padding: 20px;
                    }

                    .header-top {
                        flex-direction: column;
                        gap: 16px;
                        align-items: stretch;
                    }

                    .header-actions {
                        justify-content: center;
                    }

                    .hotel-title-section {
                        flex-direction: column;
                        gap: 16px;
                        align-items: flex-start;
                    }

                    .title-info h1 {
                        font-size: 24px;
                    }

                    .quick-stats {
                        flex-direction: column;
                        gap: 12px;
                    }

                    .main-image-container {
                        height: 250px;
                    }

                    .tab-navigation {
                        overflow-x: auto;
                    }

                    .tab-button {
                        padding: 12px 20px;
                        white-space: nowrap;
                    }

                    .tab-content {
                        padding: 20px;
                    }

                    .rooms-grid {
                        grid-template-columns: 1fr;
                    }

                    .amenities-grid {
                        grid-template-columns: 1fr;
                    }

                    .analytics-grid {
                        grid-template-columns: 1fr;
                    }

                    .table-header,
                    .table-row {
                        grid-template-columns: 1fr;
                        gap: 8px;
                        text-align: left;
                    }

                    .table-header > span:not(:first-child),
                    .table-row > span:not(:first-child) {
                        padding-left: 16px;
                        font-size: 12px;
                    }
                }

                @media (max-width: 480px) {
                    .details-header {
                        padding: 16px;
                    }

                    .title-info h1 {
                        font-size: 20px;
                    }

                    .action-button {
                        padding: 8px 12px;
                        font-size: 14px;
                    }

                    .room-header {
                        flex-direction: column;
                        gap: 8px;
                        align-items: flex-start;
                    }

                    .room-price {
                        font-size: 18px;
                    }
                }
            `}</style>
        </div>
    );
}

export default HotelDetailsView;