import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
    ArrowLeft, Save, X, Car, Users, Fuel, MapPin, DollarSign, Shield, 
    Image, FileText, Phone, Edit3, RefreshCw, AlertCircle, Plus, 
    Trash2, Eye, Upload, Check, Calendar
} from 'lucide-react';

const EditVehicle = () => {
    const { vehicleId } = useParams();
    const navigate = useNavigate();
    
    // Form state
    const [formData, setFormData] = useState({
        vehicle_model: '',
        vehicle_type: '',
        fuel_type: '',
        seating_capacity: '',
        branch_name: '',
        price_per_day: '',
        features: [],
        images: [],
        vehicle_book_image: null,
        contact_number: '',
        description: '',
        status: 'available'
    });
    
    // UI state
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [newFeature, setNewFeature] = useState('');
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [bookImagePreview, setBookImagePreview] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [originalData, setOriginalData] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Options
    const vehicleTypes = [
        { value: 'tuk_tuk', label: 'Tuk Tuk', icon: '🛺' },
        { value: 'motorbike', label: 'Motorbike', icon: '🏍️' },
        { value: 'car', label: 'Car', icon: '🚗' },
        { value: 'van', label: 'Van', icon: '🚐' },
        { value: 'bus', label: 'Bus', icon: '🚌' },
        { value: 'truck', label: 'Truck', icon: '🚚' },
        { value: 'other', label: 'Other', icon: '🚘' }
    ];

    const fuelTypes = [
        { value: 'petrol', label: 'Petrol', icon: '⛽' },
        { value: 'diesel', label: 'Diesel', icon: '🛢️' },
        { value: 'hybrid', label: 'Hybrid', icon: '🔋' },
        { value: 'electric', label: 'Electric', icon: '⚡' }
    ];

    const statusOptions = [
        { value: 'available', label: 'Available', icon: '✅', color: '#22c55e' },
        { value: 'maintenance', label: 'Maintenance', icon: '🔧', color: '#f59e0b' },
        { value: 'active', label: 'Active', icon: '🟢', color: '#22c55e' }
    ];

    const districts = [
        'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
        'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
        'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
        'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
        'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
    ];

    // Predefined features
    const commonFeatures = [
        'Air Conditioning', 'GPS Navigation', 'Bluetooth', 'USB Charging',
        'Power Steering', 'Anti-lock Braking System', 'Airbags', 'Reverse Camera',
        'Parking Sensors', 'Sunroof', 'Leather Seats', 'Automatic Transmission',
        'Manual Transmission', 'Fuel Efficient', 'Child Safety Locks',
        'Entertainment System', 'WiFi Hotspot', 'Heated Seats'
    ];

    // Fetch vehicle data
    useEffect(() => {
        const fetchVehicle = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/view_vehicle_by_id/${vehicleId}`
                );

                if (response.data.success) {
                    const vehicle = response.data.data;
                    
                    // Set form data
                    const vehicleData = {
                        vehicle_model: vehicle.vehicle_model || '',
                        vehicle_type: vehicle.vehicle_type || '',
                        fuel_type: vehicle.fuel_type || '',
                        seating_capacity: vehicle.seating_capacity?.toString() || '',
                        branch_name: vehicle.branch_name || '',
                        price_per_day: vehicle.price_per_day?.toString() || '',
                        features: Array.isArray(vehicle.features) ? vehicle.features : [],
                        images: vehicle.images || [],
                        vehicle_book_image: vehicle.vehicle_book_image || null,
                        contact_number: vehicle.contact_number || '',
                        description: vehicle.description || '',
                        status: vehicle.status || 'available'
                    };

                    setFormData(vehicleData);
                    setOriginalData(vehicleData);
                    
                    // Set existing images
                    setExistingImages(vehicle.images || []);
                    setPreviewImages(vehicle.images || []);
                    
                    // Set book image preview if exists
                    if (vehicle.vehicle_book_image) {
                        setBookImagePreview(vehicle.vehicle_book_image);
                    }
                    
                    toast.success('Vehicle data loaded successfully');
                } else {
                    setError('Failed to load vehicle data: ' + (response.data.message || 'Unknown error'));
                    toast.error('Failed to load vehicle data');
                }
            } catch (err) {
                console.error('Error fetching vehicle:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Failed to load vehicle data';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        if (vehicleId) {
            fetchVehicle();
        }
    }, [vehicleId]);

    // Check for changes
    useEffect(() => {
        if (originalData) {
            const hasFormChanges = JSON.stringify(formData) !== JSON.stringify(originalData) ||
                                  newImageFiles.length > 0 ||
                                  imagesToDelete.length > 0;
            setHasChanges(hasFormChanges);
        }
    }, [formData, originalData, newImageFiles, imagesToDelete]);

    // Validation function
    const validateForm = () => {
        const errors = {};
        
        if (!formData.vehicle_model.trim()) {
            errors.vehicle_model = 'Vehicle model is required';
        }
        
        if (!formData.vehicle_type) {
            errors.vehicle_type = 'Vehicle type is required';
        }
        
        if (!formData.fuel_type) {
            errors.fuel_type = 'Fuel type is required';
        }
        
        if (!formData.seating_capacity || formData.seating_capacity < 1) {
            errors.seating_capacity = 'Valid seating capacity is required';
        }
        
        if (!formData.branch_name) {
            errors.branch_name = 'Branch location is required';
        }
        
        if (!formData.price_per_day || formData.price_per_day < 0) {
            errors.price_per_day = 'Valid price is required';
        }
        
        if (formData.contact_number && !/^[+\d\s\-()]+$/.test(formData.contact_number)) {
            errors.contact_number = 'Invalid contact number format';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'seating_capacity' || name === 'price_per_day' ? 
                    (value === '' ? '' : Number(value)) : value 
        }));
        
        // Clear validation error for this field
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Handle feature addition
    const addFeature = () => {
        if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
            toast.success('Feature added!');
        } else if (formData.features.includes(newFeature.trim())) {
            toast.error('Feature already exists');
        }
    };

    // Add predefined feature
    const addPredefinedFeature = (feature) => {
        if (!formData.features.includes(feature)) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, feature]
            }));
            toast.success(`${feature} added!`);
        } else {
            toast.error('Feature already added');
        }
    };

    // Handle feature removal
    const removeFeature = (index) => {
        const featureName = formData.features[index];
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
        toast.success(`${featureName} removed`);
    };

    // Handle new image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name} is not a valid image file`);
                return false;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
                toast.error(`${file.name} is too large (max 10MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Check total image limit
        const totalImages = previewImages.length + validFiles.length;
        if (totalImages > 10) {
            toast.error('Maximum 10 images allowed');
            return;
        }

        // Create previews and add to state
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);
        setNewImageFiles(prev => [...prev, ...validFiles]);
        
        toast.success(`${validFiles.length} image(s) added`);
    };

    // Handle image removal
    const removeImage = (index) => {
        const imageToRemove = previewImages[index];
        
        // Check if it's an existing image or new upload
        const existingIndex = existingImages.findIndex(img => img === imageToRemove);
        
        if (existingIndex !== -1) {
            // It's an existing image, mark for deletion
            setImagesToDelete(prev => [...prev, imageToRemove]);
        } else {
            // It's a new upload, remove from new files
            const newFileIndex = previewImages.slice(existingImages.length).findIndex(
                (_, i) => i === index - existingImages.length
            );
            if (newFileIndex !== -1) {
                setNewImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
                // Revoke object URL to prevent memory leaks
                URL.revokeObjectURL(imageToRemove);
            }
        }
        
        // Remove from preview
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        toast.success('Image removed');
    };

    // Handle book image upload
    const handleBookImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file
        const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            toast.error('Please upload a valid image or PDF file');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error('File size must be less than 10MB');
            return;
        }

        setFormData(prev => ({ ...prev, vehicle_book_image: file }));
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
            setBookImagePreview(URL.createObjectURL(file));
        } else {
            setBookImagePreview(null);
        }
        
        toast.success('Registration document uploaded');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix all validation errors');
            return;
        }

        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Authentication token not found. Please login again.');
                navigate('/login');
                return;
            }

            // Create FormData for multipart/form-data
            const updateData = new FormData();
            
            // Add basic form data
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'features') {
                    updateData.append(key, JSON.stringify(value));
                } else if (key === 'images') {
                    // Skip original images array, we'll handle images separately
                    return;
                } else if (key === 'vehicle_book_image' && value instanceof File) {
                    updateData.append(key, value);
                } else if (key !== 'vehicle_book_image') {
                    updateData.append(key, value?.toString() || '');
                }
            });

            // Add new image files
            newImageFiles.forEach(file => {
                updateData.append('new_images', file);
            });

            // Add images to delete
            if (imagesToDelete.length > 0) {
                updateData.append('delete_images', JSON.stringify(imagesToDelete));
            }

            // Add existing images to keep
            const imagesToKeep = existingImages.filter(img => !imagesToDelete.includes(img));
            if (imagesToKeep.length > 0) {
                updateData.append('existing_images', JSON.stringify(imagesToKeep));
            }

            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/vehicle/update_vehicle/${vehicleId}`,
                updateData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                toast.success('Vehicle updated successfully!');
                // Clean up object URLs
                newImageFiles.forEach(file => {
                    const url = previewImages.find(preview => preview.includes('blob:'));
                    if (url) URL.revokeObjectURL(url);
                });
                navigate('/vehiclerental/dashboard');
            } else {
                toast.error(response.data.message || 'Failed to update vehicle');
            }
        } catch (err) {
            console.error('Error updating vehicle:', err);
            
            let errorMessage = 'Failed to update vehicle';
            if (err.response?.status === 401) {
                errorMessage = 'Authentication failed. Please login again.';
                navigate('/login');
            } else if (err.response?.status === 403) {
                errorMessage = "You don't have permission to update this vehicle";
            } else if (err.response?.status === 404) {
                errorMessage = "Vehicle not found";
            } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }
            
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Handle navigation with unsaved changes
    const handleBack = () => {
        if (hasChanges) {
            if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
                // Clean up object URLs
                previewImages.forEach(url => {
                    if (url.startsWith('blob:')) {
                        URL.revokeObjectURL(url);
                    }
                });
                navigate('/vehiclerental/dashboard');
            }
        } else {
            navigate('/vehiclerental/dashboard');
        }
    };

    if (isLoading) {
        return (
            <div className="edit-vehicle-container">
                <style jsx>{`
                    .edit-vehicle-container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 24px;
                        background: #f8fafc;
                        min-height: 100vh;
                    }

                    .loading-state,
                    .error-state {
                        text-align: center;
                        padding: 80px 40px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        max-width: 500px;
                        margin: 100px auto;
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

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>
                <div className="loading-state">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                    <h3>Loading vehicle data...</h3>
                    <p>Please wait while we fetch the details</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-vehicle-container">
                <style jsx>{`
                    .edit-vehicle-container {
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 24px;
                        background: #f8fafc;
                        min-height: 100vh;
                    }

                    .loading-state,
                    .error-state {
                        text-align: center;
                        padding: 80px 40px;
                        background: white;
                        border-radius: 12px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                        max-width: 500px;
                        margin: 100px auto;
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

                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }

                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}</style>
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

    return (
        <div className="edit-vehicle-container">
            <style jsx>{`
                .edit-vehicle-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 24px;
                    background: #f8fafc;
                    min-height: 100vh;
                }

                .edit-header {
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
                    transition: all 0.2s ease;
                }

                .back-btn:hover {
                    background: #e2e8f0;
                    transform: translateY(-1px);
                }

                .header-info h1 {
                    font-size: 28px;
                    font-weight: 700;
                    color: #1e293b;
                    margin: 0;
                }

                .vehicle-info {
                    color: #64748b;
                    font-size: 14px;
                }

                .changes-indicator {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #fef3c7;
                    color: #d97706;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .form-container {
                    background: white;
                    padding: 32px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .form-section {
                    margin-bottom: 32px;
                }

                .section-title {
                    font-size: 20px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .form-label {
                    font-weight: 500;
                    color: #374151;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 14px;
                }

                .required {
                    color: #ef4444;
                }

                .form-input,
                .form-select,
                .form-textarea {
                    padding: 12px;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.2s ease;
                    background: white;
                }

                .form-input:focus,
                .form-select:focus,
                .form-textarea:focus {
                    border-color: #3b82f6;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }

                .form-input.error,
                .form-select.error,
                .form-textarea.error {
                    border-color: #ef4444;
                }

                .error-message {
                    color: #ef4444;
                    font-size: 12px;
                    margin-top: 4px;
                }

                .form-textarea {
                    min-height: 120px;
                    resize: vertical;
                }

                .option-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .feature-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .feature-input-group {
                    display: flex;
                    gap: 12px;
                }

                .add-feature-btn {
                    padding: 12px 24px;
                    background: #3b82f6;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    white-space: nowrap;
                }

                .add-feature-btn:hover {
                    background: #2563eb;
                    transform: translateY(-1px);
                }

                .predefined-features {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }

                .predefined-feature {
                    padding: 6px 12px;
                    background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    color: #475569;
                }

                .predefined-feature:hover {
                    background: #3b82f6;
                    color: white;
                    border-color: #3b82f6;
                }

                .predefined-feature.added {
                    background: #dcfce7;
                    color: #16a34a;
                    border-color: #16a34a;
                    cursor: not-allowed;
                }

                .features-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 12px;
                }

                .feature-tag {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 12px;
                    background: #eff6ff;
                    color: #2563eb;
                    border-radius: 16px;
                    font-size: 14px;
                    font-weight: 500;
                }

                .remove-feature {
                    cursor: pointer;
                    color: #ef4444;
                    transition: color 0.2s ease;
                    padding: 2px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .remove-feature:hover {
                    color: #dc2626;
                    background: rgba(239, 68, 68, 0.1);
                }

                .image-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .upload-area {
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 24px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                }

                .upload-area:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .upload-area.dragover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .upload-content {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }

                .upload-icon {
                    width: 48px;
                    height: 48px;
                    color: #6b7280;
                }

                .upload-text {
                    color: #374151;
                    font-weight: 500;
                }

                .upload-subtext {
                    color: #6b7280;
                    font-size: 14px;
                }

                .image-preview-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                    gap: 16px;
                    margin-top: 16px;
                }

                .image-preview {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s ease;
                }

                .image-preview:hover {
                    transform: scale(1.05);
                }

                .preview-img {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                }

                .image-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                }

                .image-preview:hover .image-overlay {
                    opacity: 1;
                }

                .image-actions {
                    display: flex;
                    gap: 8px;
                }

                .image-action {
                    padding: 8px;
                    background: rgba(255, 255, 255, 0.9);
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .image-action:hover {
                    background: white;
                    transform: scale(1.1);
                }

                .image-action.delete {
                    color: #ef4444;
                }

                .image-action.view {
                    color: #3b82f6;
                }

                .image-status {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    padding: 4px 8px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .status-existing {
                    background: rgba(34, 197, 94, 0.9);
                }

                .status-new {
                    background: rgba(59, 130, 246, 0.9);
                }

                .book-image-section {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .book-upload-area {
                    border: 2px dashed #d1d5db;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    background: #f9fafb;
                }

                .book-upload-area:hover {
                    border-color: #3b82f6;
                    background: #eff6ff;
                }

                .book-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: #f1f5f9;
                    border-radius: 8px;
                    margin-top: 12px;
                }

                .book-preview img {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .book-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .book-name {
                    font-weight: 500;
                    color: #374151;
                }

                .book-type {
                    font-size: 12px;
                    color: #6b7280;
                }

                .form-actions {
                    display: flex;
                    gap: 16px;
                    justify-content: flex-end;
                    margin-top: 32px;
                    padding-top: 24px;
                    border-top: 1px solid #e5e7eb;
                }

                .btn-cancel {
                    display: flex;
                    align-items: center;
                    padding: 12px 24px;
                    background: #f1f5f9;
                    color: #475569;
                    border: 2px solid #e2e8f0;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.2s ease;
                }

                .btn-cancel:hover {
                    background: #e2e8f0;
                    border-color: #cbd5e1;
                    transform: translateY(-1px);
                }

                .btn-save {
                    display: flex;
                    align-items: center;
                    padding: 12px 32px;
                    background: #22c55e;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 16px;
                    transition: all 0.2s ease;
                }

                .btn-save:hover:not(:disabled) {
                    background: #16a34a;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .btn-save:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .status-available {
                    background: #dcfce7;
                    color: #16a34a;
                }

                .status-maintenance {
                    background: #fef3c7;
                    color: #d97706;
                }

                .status-active {
                    background: #dcfce7;
                    color: #16a34a;
                }

                .image-count {
                    color: #6b7280;
                    font-size: 14px;
                    margin-top: 8px;
                }

                @media (max-width: 768px) {
                    .edit-vehicle-container {
                        padding: 16px;
                    }

                    .edit-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .form-grid {
                        grid-template-columns: 1fr;
                    }

                    .feature-input-group {
                        flex-direction: column;
                    }

                    .image-preview-grid {
                        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    }

                    .form-actions {
                        flex-direction: column;
                    }

                    .form-container {
                        padding: 20px;
                    }
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .animate-spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>

            {/* Header */}
            <div className="edit-header">
                <div className="header-left">
                    <button className="back-btn" onClick={handleBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="header-info">
                        <h1>Edit Vehicle</h1>
                        <div className="vehicle-info">
                            {formData.vehicle_model} • ID: {vehicleId}
                        </div>
                    </div>
                </div>
                {hasChanges && (
                    <div className="changes-indicator">
                        <AlertCircle className="w-4 h-4" />
                        Unsaved changes
                    </div>
                )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="form-container">
                {/* Basic Information */}
                <div className="form-section">
                    <h3 className="section-title">
                        <Car className="w-5 h-5" />
                        Basic Information
                    </h3>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">
                                <Edit3 className="w-4 h-4" />
                                Vehicle Model <span className="required">*</span>
                            </label>
                            <input
                                type="text"
                                name="vehicle_model"
                                value={formData.vehicle_model}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.vehicle_model ? 'error' : ''}`}
                                placeholder="e.g., Toyota Corolla"
                                required
                            />
                            {validationErrors.vehicle_model && (
                                <span className="error-message">{validationErrors.vehicle_model}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Car className="w-4 h-4" />
                                Vehicle Type <span className="required">*</span>
                            </label>
                            <select
                                name="vehicle_type"
                                value={formData.vehicle_type}
                                onChange={handleChange}
                                className={`form-select ${validationErrors.vehicle_type ? 'error' : ''}`}
                                required
                            >
                                <option value="">Select Type</option>
                                {vehicleTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.icon} {type.label}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.vehicle_type && (
                                <span className="error-message">{validationErrors.vehicle_type}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Fuel className="w-4 h-4" />
                                Fuel Type <span className="required">*</span>
                            </label>
                            <select
                                name="fuel_type"
                                value={formData.fuel_type}
                                onChange={handleChange}
                                className={`form-select ${validationErrors.fuel_type ? 'error' : ''}`}
                                required
                            >
                                <option value="">Select Fuel Type</option>
                                {fuelTypes.map(fuel => (
                                    <option key={fuel.value} value={fuel.value}>
                                        {fuel.icon} {fuel.label}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.fuel_type && (
                                <span className="error-message">{validationErrors.fuel_type}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Users className="w-4 h-4" />
                                Seating Capacity <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="seating_capacity"
                                value={formData.seating_capacity}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.seating_capacity ? 'error' : ''}`}
                                placeholder="e.g., 5"
                                min="1"
                                max="50"
                                required
                            />
                            {validationErrors.seating_capacity && (
                                <span className="error-message">{validationErrors.seating_capacity}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <MapPin className="w-4 h-4" />
                                Branch Location <span className="required">*</span>
                            </label>
                            <select
                                name="branch_name"
                                value={formData.branch_name}
                                onChange={handleChange}
                                className={`form-select ${validationErrors.branch_name ? 'error' : ''}`}
                                required
                            >
                                <option value="">Select Branch</option>
                                {districts.map(district => (
                                    <option key={district} value={district}>
                                        📍 {district}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.branch_name && (
                                <span className="error-message">{validationErrors.branch_name}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <DollarSign className="w-4 h-4" />
                                Price per Day (LKR) <span className="required">*</span>
                            </label>
                            <input
                                type="number"
                                name="price_per_day"
                                value={formData.price_per_day}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.price_per_day ? 'error' : ''}`}
                                placeholder="e.g., 5000"
                                min="0"
                                step="100"
                                required
                            />
                            {validationErrors.price_per_day && (
                                <span className="error-message">{validationErrors.price_per_day}</span>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Shield className="w-4 h-4" />
                                Status <span className="required">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-select"
                                required
                            >
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.icon} {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                <Phone className="w-4 h-4" />
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contact_number"
                                value={formData.contact_number}
                                onChange={handleChange}
                                className={`form-input ${validationErrors.contact_number ? 'error' : ''}`}
                                placeholder="e.g., +94 77 123 4567"
                            />
                            {validationErrors.contact_number && (
                                <span className="error-message">{validationErrors.contact_number}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="form-section">
                    <h3 className="section-title">
                        <Shield className="w-5 h-5" />
                        Features & Amenities
                    </h3>
                    <div className="feature-section">
                        <div className="feature-input-group">
                            <input
                                type="text"
                                value={newFeature}
                                onChange={(e) => setNewFeature(e.target.value)}
                                className="form-input"
                                placeholder="Add a custom feature..."
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                            />
                            <button type="button" onClick={addFeature} className="add-feature-btn">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Feature
                            </button>
                        </div>

                        <div className="predefined-features">
                            <span style={{color: '#6b7280', fontSize: '14px', fontWeight: '500', marginRight: '8px'}}>
                                Quick Add:
                            </span>
                            {commonFeatures.map((feature) => (
                                <button
                                    key={feature}
                                    type="button"
                                    onClick={() => addPredefinedFeature(feature)}
                                    className={`predefined-feature ${formData.features.includes(feature) ? 'added' : ''}`}
                                    disabled={formData.features.includes(feature)}
                                >
                                    {formData.features.includes(feature) ? (
                                        <>
                                            <Check className="w-3 h-3 mr-1" style={{display: 'inline'}} />
                                            {feature}
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-3 h-3 mr-1" style={{display: 'inline'}} />
                                            {feature}
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>

                        {formData.features.length > 0 && (
                            <div className="features-list">
                                {formData.features.map((feature, index) => (
                                    <span key={index} className="feature-tag">
                                        {feature}
                                        <button
                                            type="button"
                                            className="remove-feature"
                                            onClick={() => removeFeature(index)}
                                            title="Remove feature"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicle Images */}
                <div className="form-section">
                    <h3 className="section-title">
                        <Image className="w-5 h-5" />
                        Vehicle Images
                    </h3>
                    <div className="image-section">
                        <label htmlFor="images-upload" className="upload-area">
                            <input
                                id="images-upload"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            <div className="upload-content">
                                <Upload className="upload-icon" />
                                <div className="upload-text">Upload Vehicle Images</div>
                                <div className="upload-subtext">
                                    Click or drag images here (Max 10 images, 10MB each)
                                </div>
                            </div>
                        </label>

                        {previewImages.length > 0 && (
                            <>
                                <div className="image-preview-grid">
                                    {previewImages.map((img, index) => {
                                        const isExisting = existingImages.includes(img);
                                        return (
                                            <div key={index} className="image-preview">
                                                <img src={img} alt={`Preview ${index + 1}`} className="preview-img" />
                                                <div className="image-overlay">
                                                    <div className="image-actions">
                                                        <button
                                                            type="button"
                                                            className="image-action view"
                                                            onClick={() => window.open(img, '_blank')}
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="image-action delete"
                                                            onClick={() => removeImage(index)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className={`image-status ${isExisting ? 'status-existing' : 'status-new'}`}>
                                                    {isExisting ? 'Existing' : 'New'}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="image-count">
                                    {previewImages.length} image{previewImages.length !== 1 ? 's' : ''} selected
                                    {newImageFiles.length > 0 && ` (${newImageFiles.length} new)`}
                                    {imagesToDelete.length > 0 && ` (${imagesToDelete.length} to be removed)`}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Registration Document */}
                <div className="form-section">
                    <h3 className="section-title">
                        <FileText className="w-5 h-5" />
                        Registration Document
                    </h3>
                    <div className="book-image-section">
                        <label htmlFor="book-upload" className="book-upload-area">
                            <input
                                id="book-upload"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={handleBookImageUpload}
                                style={{ display: 'none' }}
                            />
                            <div className="upload-content">
                                <FileText className="w-8 h-8 text-gray-400 mb-2" />
                                <div className="upload-text">Upload Vehicle Registration</div>
                                <div className="upload-subtext">
                                    Supported formats: JPG, PNG, PDF (Max 10MB)
                                </div>
                            </div>
                        </label>

                        {(bookImagePreview || (typeof formData.vehicle_book_image === 'string')) && (
                            <div className="book-preview">
                                {bookImagePreview && (
                                    <img src={bookImagePreview} alt="Registration document" />
                                )}
                                <div className="book-info">
                                    <div className="book-name">
                                        {formData.vehicle_book_image instanceof File 
                                            ? formData.vehicle_book_image.name 
                                            : 'Current registration document'}
                                    </div>
                                    <div className="book-type">
                                        {formData.vehicle_book_image instanceof File 
                                            ? formData.vehicle_book_image.type 
                                            : 'Existing document'}
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({ ...prev, vehicle_book_image: null }));
                                        setBookImagePreview(null);
                                    }}
                                    className="image-action delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="form-section">
                    <h3 className="section-title">
                        <Edit3 className="w-5 h-5" />
                        Additional Information
                    </h3>
                    <div className="form-group">
                        <label className="form-label">
                            <Edit3 className="w-4 h-4" />
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="form-textarea"
                            placeholder="Provide a detailed description of the vehicle, its condition, special features, etc."
                            rows="4"
                        />
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" className="btn-cancel" onClick={handleBack}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </button>
                    <button type="submit" className="btn-save" disabled={isSaving || !hasChanges}>
                        {isSaving ? (
                            <>
                                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                                Saving Changes...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditVehicle;