import { useState, useEffect } from 'react';
import { 
    ArrowLeft, Save, Plus, Trash2, Upload, X, MapPin, Phone, 
    Building, FileText, Car, Bed, Users, Star, Image as ImageIcon,
    CheckCircle, AlertCircle, Camera
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import mediaUpload from '../utils/mediaUpload'; // Import your media upload utility

function EditHotelForm({ hotel, onBack, onSave }) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        hotel_name: '',
        images: [], // Will store existing URLs
        address: '',
        city: '',
        contact_number: '',
        description: '',
        parking_available: false,
        room_types: []
    });
    
    // New states for file uploads
    const [newHotelImages, setNewHotelImages] = useState([]); // New images to upload
    const [newRoomImages, setNewRoomImages] = useState({}); // New room images by room index
    
    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('basic');

    // Predefined facility options for quick selection
    const facilityOptions = [
        'Air Conditioning', 'Free WiFi', 'TV', 'Private Bathroom', 
        'Mini Bar', 'Safe', 'Balcony', 'Room Service', 
        'Hair Dryer', 'Coffee Maker', 'Iron', 'Telephone',
        'Kitchenette', 'Jacuzzi', 'Sea View', 'Mountain View'
    ];

    // Initialize form data when hotel prop changes
    useEffect(() => {
        if (hotel) {
            // Check if hotel is approved
            if (hotel.status !== 'approved') {
                const statusMessage = hotel.status === 'pending' 
                    ? 'Hotel is still pending approval. You cannot edit pending hotels.'
                    : 'Hotel has been rejected. You cannot edit rejected hotels.';
                toast.error(statusMessage);
                onBack();
                return;
            }

            setFormData({
                hotel_name: hotel.hotel_name || '',
                images: Array.isArray(hotel.images) ? [...hotel.images] : [],
                address: hotel.address || '',
                city: hotel.city || '',
                contact_number: hotel.contact_number || '',
                description: hotel.description || '',
                parking_available: hotel.parking_available || false,
                room_types: Array.isArray(hotel.room_types) ? hotel.room_types.map(room => ({
                    name: room.name || room.type || '',
                    count: room.count || 1,
                    price: room.price || 0,
                    facilities: Array.isArray(room.facilities) ? [...room.facilities] : [],
                    images: Array.isArray(room.images) ? [...room.images] : []
                })) : []
            });

            // Initialize new room images state
            const roomImagesState = {};
            if (Array.isArray(hotel.room_types)) {
                hotel.room_types.forEach((_, index) => {
                    roomImagesState[index] = [];
                });
            }
            setNewRoomImages(roomImagesState);
        }
    }, [hotel, onBack]);

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        // Basic information validation
        if (!formData.hotel_name.trim()) {
            newErrors.hotel_name = 'Hotel name is required';
        }
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!formData.contact_number.trim()) {
            newErrors.contact_number = 'Contact number is required';
        } else if (!/^[0-9+\-\s]+$/.test(formData.contact_number)) {
            newErrors.contact_number = 'Invalid contact number format';
        }

        // Room types validation
        if (formData.room_types.length === 0) {
            newErrors.room_types = 'At least one room type is required';
        } else {
            formData.room_types.forEach((room, index) => {
                if (!room.name.trim()) {
                    newErrors[`room_${index}_name`] = 'Room name is required';
                }
                if (!room.count || room.count < 1) {
                    newErrors[`room_${index}_count`] = 'Room count must be at least 1';
                }
                if (!room.price || room.price < 0) {
                    newErrors[`room_${index}_price`] = 'Room price must be greater than 0';
                }
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the validation errors');
            return;
        }

        setIsLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            let finalFormData = { ...formData };

            // Upload new hotel images if any
            if (newHotelImages.length > 0) {
                const loadingToast = toast.loading('Uploading hotel images...');
                try {
                    const uploadPromises = newHotelImages.map(img => mediaUpload(img.file));
                    const uploadedUrls = await Promise.all(uploadPromises);
                    finalFormData.images = [...finalFormData.images, ...uploadedUrls];
                    toast.dismiss(loadingToast);
                    toast.success(`${uploadedUrls.length} hotel image(s) uploaded successfully!`);
                } catch (error) {
                    toast.dismiss(loadingToast);
                    throw new Error('Failed to upload hotel images: ' + error.message);
                }
            }

            // Upload new room images if any
            if (Object.keys(newRoomImages).some(key => newRoomImages[key].length > 0)) {
                const loadingToast = toast.loading('Uploading room images...');
                try {
                    let totalUploaded = 0;
                    for (let roomIndex = 0; roomIndex < finalFormData.room_types.length; roomIndex++) {
                        const roomNewImages = newRoomImages[roomIndex] || [];
                        if (roomNewImages.length > 0) {
                            const uploadPromises = roomNewImages.map(img => mediaUpload(img.file));
                            const uploadedUrls = await Promise.all(uploadPromises);
                            finalFormData.room_types[roomIndex].images = [
                                ...finalFormData.room_types[roomIndex].images,
                                ...uploadedUrls
                            ];
                            totalUploaded += uploadedUrls.length;
                        }
                    }
                    toast.dismiss(loadingToast);
                    toast.success(`${totalUploaded} room image(s) uploaded successfully!`);
                } catch (error) {
                    toast.dismiss(loadingToast);
                    throw new Error('Failed to upload room images: ' + error.message);
                }
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/hotel/update_hotel/${hotel.hotel_id}`,
                finalFormData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Hotel updated successfully!');
                onSave(finalFormData);
                onBack();
            } else {
                toast.error(response.data.message || 'Failed to update hotel');
            }
        } catch (error) {
            console.error('Error updating hotel:', error);
            
            let errorMessage = 'Failed to update hotel';
            if (error.response?.status === 403) {
                errorMessage = 'You do not have permission to edit this hotel';
            } else if (error.response?.status === 404) {
                errorMessage = 'Hotel not found';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    // Handle hotel image upload
    const handleHotelImageUpload = (files) => {
        if (!files || files.length === 0) return;
        
        const newImages = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file)
        }));
        
        setNewHotelImages(prev => [...prev, ...newImages]);
    };

    // Remove hotel image (existing or new)
    const removeHotelImage = (index, isNew = false) => {
        if (isNew) {
            setNewHotelImages(prev => {
                const imageToRemove = prev[index];
                if (imageToRemove) {
                    URL.revokeObjectURL(imageToRemove.preview);
                }
                return prev.filter((_, i) => i !== index);
            });
        } else {
            setFormData(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        }
    };

    // Handle room image upload
    const handleRoomImageUpload = (roomIndex, files) => {
        if (!files || files.length === 0) return;
        
        const newImages = Array.from(files).map(file => ({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file)
        }));
        
        setNewRoomImages(prev => ({
            ...prev,
            [roomIndex]: [...(prev[roomIndex] || []), ...newImages]
        }));
    };

    // Remove room image (existing or new)
    const removeRoomImage = (roomIndex, imageIndex, isNew = false) => {
        if (isNew) {
            setNewRoomImages(prev => {
                const roomImages = prev[roomIndex] || [];
                const imageToRemove = roomImages[imageIndex];
                if (imageToRemove) {
                    URL.revokeObjectURL(imageToRemove.preview);
                }
                return {
                    ...prev,
                    [roomIndex]: roomImages.filter((_, i) => i !== imageIndex)
                };
            });
        } else {
            setFormData(prev => ({
                ...prev,
                room_types: prev.room_types.map((room, i) => 
                    i === roomIndex ? {
                        ...room,
                        images: room.images.filter((_, i) => i !== imageIndex)
                    } : room
                )
            }));
        }
    };

    // Handle room type operations
    const handleAddRoomType = () => {
        const newIndex = formData.room_types.length;
        setFormData(prev => ({
            ...prev,
            room_types: [...prev.room_types, {
                name: '',
                count: 1,
                price: 0,
                facilities: [],
                images: []
            }]
        }));
        
        // Initialize new images state for this room
        setNewRoomImages(prev => ({
            ...prev,
            [newIndex]: []
        }));
    };

    const handleRemoveRoomType = (index) => {
        setFormData(prev => ({
            ...prev,
            room_types: prev.room_types.filter((_, i) => i !== index)
        }));
        
        // Clean up new images for this room
        const roomNewImages = newRoomImages[index] || [];
        roomNewImages.forEach(img => URL.revokeObjectURL(img.preview));
        
        setNewRoomImages(prev => {
            const updated = { ...prev };
            delete updated[index];
            // Reindex remaining rooms
            const reindexed = {};
            Object.keys(updated).forEach(key => {
                const oldIndex = parseInt(key);
                if (oldIndex > index) {
                    reindexed[oldIndex - 1] = updated[oldIndex];
                } else {
                    reindexed[oldIndex] = updated[oldIndex];
                }
            });
            return reindexed;
        });
        
        // Clear related errors
        const newErrors = { ...errors };
        delete newErrors[`room_${index}_name`];
        delete newErrors[`room_${index}_count`];
        delete newErrors[`room_${index}_price`];
        setErrors(newErrors);
    };

    const handleRoomTypeChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            room_types: prev.room_types.map((room, i) => 
                i === index ? { ...room, [field]: value } : room
            )
        }));
        
        // Clear error
        if (errors[`room_${index}_${field}`]) {
            setErrors(prev => ({
                ...prev,
                [`room_${index}_${field}`]: undefined
            }));
        }
    };

    // Handle facility operations for room types
    const handleAddFacility = (roomIndex, facility) => {
        if (facility.trim()) {
            setFormData(prev => ({
                ...prev,
                room_types: prev.room_types.map((room, i) => 
                    i === roomIndex ? {
                        ...room,
                        facilities: [...room.facilities, facility.trim()]
                    } : room
                )
            }));
        }
    };

    const handleRemoveFacility = (roomIndex, facilityIndex) => {
        setFormData(prev => ({
            ...prev,
            room_types: prev.room_types.map((room, i) => 
                i === roomIndex ? {
                    ...room,
                    facilities: room.facilities.filter((_, fi) => fi !== facilityIndex)
                } : room
            )
        }));
    };

    // Facility input component
    const FacilityInput = ({ roomIndex, placeholder = "Enter facility" }) => {
        const [facility, setFacility] = useState('');
        
        const handleAdd = () => {
            if (facility.trim()) {
                handleAddFacility(roomIndex, facility);
                setFacility('');
            }
        };

        const handleKeyPress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
            }
        };

        return (
            <div className="facility-input">
                <input
                    type="text"
                    value={facility}
                    onChange={(e) => setFacility(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="facility-input-field"
                />
                <button type="button" onClick={handleAdd} className="add-facility-btn">
                    <Plus className="w-4 h-4" />
                </button>
            </div>
        );
    };

    if (!hotel) {
        return (
            <div className="edit-hotel-container">
                <div className="error-message-container">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
                    <h3>Hotel data not found</h3>
                    <button onClick={onBack} className="btn btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-hotel-container">
            {/* Header */}
            <div className="edit-header">
                <div className="header-content">
                    <button onClick={onBack} className="back-button">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Hotels
                    </button>
                    
                    <div className="header-info">
                        <h1>Edit Hotel</h1>
                        <div className="hotel-meta">
                            <span className="hotel-id">ID: {hotel.hotel_id}</span>
                            <div className="status-badge approved">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Approved
                            </div>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        form="edit-hotel-form"
                        disabled={isLoading}
                        className="save-button"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-navigation">
                <button
                    type="button"
                    className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
                    onClick={() => setActiveTab('basic')}
                >
                    <Building className="w-4 h-4 mr-2" />
                    Basic Info
                </button>
                <button
                    type="button"
                    className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
                    onClick={() => setActiveTab('images')}
                >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Images
                </button>
                <button
                    type="button"
                    className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('rooms')}
                >
                    <Bed className="w-4 h-4 mr-2" />
                    Room Types
                </button>
            </div>

            {/* Form */}
            <form id="edit-hotel-form" onSubmit={handleSubmit} className="edit-form">
                {/* Basic Information Tab */}
                {activeTab === 'basic' && (
                    <div className="tab-content">
                        <div className="form-section">
                            <h3 className="section-title">Hotel Information</h3>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        <Building className="w-4 h-4 mr-2" />
                                        Hotel Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.hotel_name}
                                        onChange={(e) => handleInputChange('hotel_name', e.target.value)}
                                        className={`form-input ${errors.hotel_name ? 'error' : ''}`}
                                        placeholder="Enter hotel name"
                                    />
                                    {errors.hotel_name && (
                                        <span className="error-message">{errors.hotel_name}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        className={`form-input ${errors.city ? 'error' : ''}`}
                                        placeholder="Enter city"
                                    />
                                    {errors.city && (
                                        <span className="error-message">{errors.city}</span>
                                    )}
                                </div>

                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <MapPin className="w-4 h-4 mr-2" />
                                        Address *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                        className={`form-input ${errors.address ? 'error' : ''}`}
                                        placeholder="Enter full address"
                                    />
                                    {errors.address && (
                                        <span className="error-message">{errors.address}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Contact Number *
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contact_number}
                                        onChange={(e) => handleInputChange('contact_number', e.target.value)}
                                        className={`form-input ${errors.contact_number ? 'error' : ''}`}
                                        placeholder="Enter contact number"
                                    />
                                    {errors.contact_number && (
                                        <span className="error-message">{errors.contact_number}</span>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <Car className="w-4 h-4 mr-2" />
                                        Parking Available
                                    </label>
                                    <div className="checkbox-group">
                                        <input
                                            type="checkbox"
                                            id="parking"
                                            checked={formData.parking_available}
                                            onChange={(e) => handleInputChange('parking_available', e.target.checked)}
                                            className="form-checkbox"
                                        />
                                        <label htmlFor="parking" className="checkbox-label">
                                            Yes, parking is available
                                        </label>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label className="form-label">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="form-textarea"
                                        placeholder="Describe your hotel..."
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                    <div className="tab-content">
                        <div className="form-section">
                            <h3 className="section-title">Hotel Images</h3>
                            
                            <div className="images-section">
                                {/* Upload new images */}
                                <div className="mb-6">
                                    <label className="upload-area">
                                        <div className="upload-content">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-600">Click to upload new hotel images</span>
                                            <span className="text-xs text-gray-400">PNG, JPG up to 10MB each</span>
                                        </div>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleHotelImageUpload(e.target.files)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {/* Existing Images */}
                                {formData.images.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-700 mb-3">Current Images</h4>
                                        <div className="images-grid">
                                            {formData.images.map((image, index) => (
                                                <div key={`existing-${index}`} className="image-item">
                                                    <img 
                                                        src={image} 
                                                        alt={`Hotel image ${index + 1}`}
                                                        className="preview-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                    <div className="image-placeholder" style={{ display: 'none' }}>
                                                        <Camera className="w-8 h-8 text-gray-400" />
                                                        <span>Failed to load</span>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHotelImage(index, false)}
                                                        className="remove-image-btn"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* New Images */}
                                {newHotelImages.length > 0 && (
                                    <div className="mb-6">
                                        <h4 className="text-md font-medium text-gray-700 mb-3">New Images to Upload</h4>
                                        <div className="images-grid">
                                            {newHotelImages.map((image, index) => (
                                                <div key={`new-${index}`} className="image-item">
                                                    <img 
                                                        src={image.preview} 
                                                        alt={`New hotel image ${index + 1}`}
                                                        className="preview-image"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeHotelImage(index, true)}
                                                        className="remove-image-btn"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="new-image-badge">NEW</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                
                                {formData.images.length === 0 && newHotelImages.length === 0 && (
                                    <div className="empty-state">
                                        <ImageIcon className="w-12 h-12 text-gray-300 mb-2" />
                                        <p>No images added yet</p>
                                        <p className="text-sm text-gray-500">Upload some hotel images to showcase your property</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Room Types Tab */}
                {activeTab === 'rooms' && (
                    <div className="tab-content">
                        <div className="form-section">
                            <div className="section-header">
                                <h3 className="section-title">Room Types</h3>
                                <button
                                    type="button"
                                    onClick={handleAddRoomType}
                                    className="add-room-btn"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Room Type
                                </button>
                            </div>
                            
                            {errors.room_types && (
                                <div className="error-message">{errors.room_types}</div>
                            )}
                            
                            <div className="rooms-list">
                                {formData.room_types.map((room, roomIndex) => (
                                    <div key={roomIndex} className="room-type-card">
                                        <div className="room-header">
                                            <h4>Room Type {roomIndex + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveRoomType(roomIndex)}
                                                className="remove-room-btn"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        
                                        <div className="room-form-grid">
                                            <div className="form-group">
                                                <label className="form-label">Room Name *</label>
                                                <input
                                                    type="text"
                                                    value={room.name}
                                                    onChange={(e) => handleRoomTypeChange(roomIndex, 'name', e.target.value)}
                                                    className={`form-input ${errors[`room_${roomIndex}_name`] ? 'error' : ''}`}
                                                    placeholder="e.g., Deluxe Room"
                                                />
                                                {errors[`room_${roomIndex}_name`] && (
                                                    <span className="error-message">{errors[`room_${roomIndex}_name`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Room Count *</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={room.count}
                                                    onChange={(e) => handleRoomTypeChange(roomIndex, 'count', parseInt(e.target.value) || 1)}
                                                    className={`form-input ${errors[`room_${roomIndex}_count`] ? 'error' : ''}`}
                                                />
                                                {errors[`room_${roomIndex}_count`] && (
                                                    <span className="error-message">{errors[`room_${roomIndex}_count`]}</span>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label className="form-label">Price per Night (LKR) *</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={room.price}
                                                    onChange={(e) => handleRoomTypeChange(roomIndex, 'price', parseFloat(e.target.value) || 0)}
                                                    className={`form-input ${errors[`room_${roomIndex}_price`] ? 'error' : ''}`}
                                                />
                                                {errors[`room_${roomIndex}_price`] && (
                                                    <span className="error-message">{errors[`room_${roomIndex}_price`]}</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Room Facilities */}
                                        <div className="facilities-section">
                                            <label className="form-label">Facilities</label>
                                            
                                            {/* Quick select facilities */}
                                            <div className="facility-options">
                                                {facilityOptions.map((facility, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleAddFacility(roomIndex, facility)}
                                                        className="facility-option-btn"
                                                        disabled={room.facilities.includes(facility)}
                                                    >
                                                        + {facility}
                                                    </button>
                                                ))}
                                            </div>

                                            <FacilityInput 
                                                roomIndex={roomIndex}
                                                placeholder="Add custom facility (e.g., AC, WiFi, TV)"
                                            />
                                            <div className="facilities-list">
                                                {room.facilities.map((facility, facilityIndex) => (
                                                    <div key={facilityIndex} className="facility-tag">
                                                        <span>{facility}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveFacility(roomIndex, facilityIndex)}
                                                            className="remove-facility-btn"
                                                        >
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Room Images */}
                                        <div className="room-images-section">
                                            <label className="form-label">Room Images</label>
                                            
                                            {/* Upload new room images */}
                                            <div className="mb-4">
                                                <label className="upload-area-small">
                                                    <div className="upload-content-small">
                                                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                                                        <span className="text-xs text-gray-600">Upload room images</span>
                                                    </div>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) => handleRoomImageUpload(roomIndex, e.target.files)}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>

                                            {/* Existing room images */}
                                            {room.images.length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-sm font-medium text-gray-600 mb-2">Current Images</h5>
                                                    <div className="room-images-grid">
                                                        {room.images.map((image, imageIndex) => (
                                                            <div key={`existing-room-${roomIndex}-${imageIndex}`} className="room-image-item">
                                                                <img 
                                                                    src={image} 
                                                                    alt={`Room image ${imageIndex + 1}`}
                                                                    className="room-preview-image"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextSibling.style.display = 'flex';
                                                                    }}
                                                                />
                                                                <div className="image-placeholder-small" style={{ display: 'none' }}>
                                                                    <Camera className="w-4 h-4 text-gray-400" />
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeRoomImage(roomIndex, imageIndex, false)}
                                                                    className="remove-room-image-btn"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* New room images */}
                                            {newRoomImages[roomIndex] && newRoomImages[roomIndex].length > 0 && (
                                                <div className="mb-4">
                                                    <h5 className="text-sm font-medium text-gray-600 mb-2">New Images to Upload</h5>
                                                    <div className="room-images-grid">
                                                        {newRoomImages[roomIndex].map((image, imageIndex) => (
                                                            <div key={`new-room-${roomIndex}-${imageIndex}`} className="room-image-item">
                                                                <img 
                                                                    src={image.preview} 
                                                                    alt={`New room image ${imageIndex + 1}`}
                                                                    className="room-preview-image"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeRoomImage(roomIndex, imageIndex, true)}
                                                                    className="remove-room-image-btn"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                </button>
                                                                <div className="new-image-badge-small">NEW</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                
                                {formData.room_types.length === 0 && (
                                    <div className="empty-state">
                                        <Bed className="w-12 h-12 text-gray-300 mb-2" />
                                        <p>No room types added yet</p>
                                        <p className="text-sm text-gray-500">Add room types to complete your hotel setup</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </form>

            {/* Complete Styles */}
            <style jsx>{`
                .edit-hotel-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .edit-header {
                    background: white;
                    border-bottom: 2px solid #e2e8f0;
                    padding: 20px 30px;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .header-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                }

                .back-button {
                    display: flex;
                    align-items: center;
                    background: #f1f5f9;
                    color: #475569;
                    border: 1px solid #e2e8f0;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .back-button:hover {
                    background: #e2e8f0;
                    transform: translateY(-1px);
                }

                .header-info h1 {
                    font-size: 24px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0 0 8px 0;
                }

                .hotel-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .hotel-id {
                    background: #f1f5f9;
                    color: #64748b;
                    padding: 4px 8px;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                }

                .status-badge {
                    display: flex;
                    align-items: center;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-badge.approved {
                    background: #dcfce7;
                    color: #166534;
                }

                .save-button {
                    display: flex;
                    align-items: center;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    min-width: 140px;
                    justify-content: center;
                }

                .save-button:hover:not(:disabled) {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }

                .save-button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .tab-navigation {
                    display: flex;
                    background: white;
                    border-bottom: 2px solid #e2e8f0;
                    overflow-x: auto;
                }

                .tab-button {
                    display: flex;
                    align-items: center;
                    padding: 16px 24px;
                    background: none;
                    border: none;
                    color: #64748b;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    white-space: nowrap;
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

                .edit-form {
                    background: white;
                    margin: 0;
                }

                .tab-content {
                    padding: 30px;
                }

                .form-section {
                    margin-bottom: 30px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                }

                .section-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .add-room-btn {
                    display: flex;
                    align-items: center;
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 10px 16px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                }

                .add-room-btn:hover {
                    background: #059669;
                    transform: translateY(-1px);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                .form-group.full-width {
                    grid-column: 1 / -1;
                }

                .form-label {
                    display: flex;
                    align-items: center;
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 8px;
                    font-size: 14px;
                }

                .form-input,
                .form-textarea {
                    padding: 12px 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    background: white;
                }

                .form-input:focus,
                .form-textarea:focus {
                    outline: none;
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-input.error,
                .form-textarea.error {
                    border-color: #ef4444;
                }

                .form-textarea {
                    resize: vertical;
                    min-height: 100px;
                }

                .checkbox-group {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 0;
                }

                .form-checkbox {
                    width: 18px;
                    height: 18px;
                    accent-color: #3b82f6;
                }

                .checkbox-label {
                    color: #374151;
                    font-size: 14px;
                    cursor: pointer;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                /* Images Section */
                .images-section {
                    max-width: 800px;
                }

                .upload-area {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 120px;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    cursor: pointer;
                    background: #f9fafb;
                    transition: all 0.2s ease;
                }

                .upload-area:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                }

                .upload-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .upload-area-small {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 80px;
                    border: 2px dashed #d1d5db;
                    border-radius: 6px;
                    cursor: pointer;
                    background: #f9fafb;
                    transition: all 0.2s ease;
                }

                .upload-area-small:hover {
                    background: #f3f4f6;
                    border-color: #9ca3af;
                }

                .upload-content-small {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }

                .images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                }

                .image-item {
                    position: relative;
                    aspect-ratio: 16/10;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 2px solid #e2e8f0;
                    background: #f8fafc;
                }

                .preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                    font-size: 12px;
                    text-align: center;
                    padding: 10px;
                }

                .remove-image-btn {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .remove-image-btn:hover {
                    background: rgba(239, 68, 68, 1);
                    transform: scale(1.1);
                }

                .new-image-badge {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    background: #10b981;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 600;
                }

                .empty-state {
                    text-align: center;
                    padding: 40px;
                    color: #6b7280;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    margin: 20px 0;
                }

                /* Room Types Section */
                .rooms-list {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .room-type-card {
                    background: #f8fafc;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 24px;
                    transition: all 0.2s ease;
                }

                .room-type-card:hover {
                    border-color: #3b82f6;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
                }

                .room-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .room-header h4 {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin: 0;
                }

                .remove-room-btn {
                    background: #ef4444;
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .remove-room-btn:hover {
                    background: #dc2626;
                    transform: scale(1.05);
                }

                .room-form-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr;
                    gap: 16px;
                    margin-bottom: 20px;
                }

                /* Facilities Section */
                .facilities-section {
                    margin-bottom: 20px;
                }

                .facility-options {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .facility-option-btn {
                    text-align: left;
                    padding: 8px 12px;
                    font-size: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .facility-option-btn:hover:not(:disabled) {
                    background: #f8fafc;
                    border-color: #3b82f6;
                }

                .facility-option-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    background: #f3f4f6;
                }

                .facility-input {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .facility-input-field {
                    flex: 1;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 13px;
                }

                .add-facility-btn {
                    background: #10b981;
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .add-facility-btn:hover {
                    background: #059669;
                }

                .facilities-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .facility-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    background: #dbeafe;
                    color: #1e40af;
                    padding: 6px 10px;
                    border-radius: 16px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .remove-facility-btn {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    padding: 0;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .remove-facility-btn:hover {
                    background: #fee2e2;
                }

                /* Room Images Section */
                .room-images-section {
                    border-top: 1px solid #e2e8f0;
                    padding-top: 16px;
                }

                .room-images-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    gap: 12px;
                    margin-top: 12px;
                }

                .room-image-item {
                    position: relative;
                    aspect-ratio: 4/3;
                    border-radius: 6px;
                    overflow: hidden;
                    border: 1px solid #e2e8f0;
                }

                .room-preview-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .image-placeholder-small {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                    font-size: 10px;
                }

                .remove-room-image-btn {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    background: rgba(239, 68, 68, 0.9);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 10px;
                }

                .remove-room-image-btn:hover {
                    background: rgba(239, 68, 68, 1);
                }

                .new-image-badge-small {
                    position: absolute;
                    top: 4px;
                    left: 4px;
                    background: #10b981;
                    color: white;
                    padding: 1px 4px;
                    border-radius: 3px;
                    font-size: 8px;
                    font-weight: 600;
                }

                /* Error State */
                .error-message-container {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6b7280;
                }

                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-block;
                    text-align: center;
                }

                .btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .btn-primary:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                /* Responsive Design */
                @media (max-width: 1024px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .room-form-grid {
                        grid-template-columns: 1fr;
                    }

                    .images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    }

                    .facility-options {
                        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    }
                }

                @media (max-width: 768px) {
                    .edit-header {
                        padding: 15px 20px;
                    }

                    .header-content {
                        flex-direction: column;
                        gap: 15px;
                        align-items: stretch;
                    }

                    .tab-content {
                        padding: 20px;
                    }

                    .tab-navigation {
                        overflow-x: auto;
                    }

                    .room-type-card {
                        padding: 16px;
                    }

                    .images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    }

                    .room-images-grid {
                        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
                    }

                    .section-header {
                        flex-direction: column;
                        gap: 15px;
                        align-items: stretch;
                    }

                    .facility-options {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 480px) {
                    .edit-header {
                        padding: 12px 15px;
                    }

                    .header-info h1 {
                        font-size: 20px;
                    }

                    .tab-content {
                        padding: 15px;
                    }

                    .form-grid {
                        gap: 15px;
                    }

                    .room-form-grid {
                        gap: 12px;
                    }

                    .save-button {
                        padding: 10px 20px;
                        font-size: 14px;
                    }

                    .images-grid {
                        grid-template-columns: 1fr 1fr;
                    }

                    .room-images-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                /* Animation and Transitions */
                .room-type-card {
                    animation: slideIn 0.3s ease;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .facility-tag {
                    animation: fadeIn 0.2s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .image-item {
                    animation: zoomIn 0.2s ease;
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                /* Loading States */
                .save-button:disabled {
                    position: relative;
                    overflow: hidden;
                }

                .save-button:disabled::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    animation: loading 1.5s infinite;
                }

                @keyframes loading {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
            `}</style>
        </div>
    );
}

export default EditHotelForm;