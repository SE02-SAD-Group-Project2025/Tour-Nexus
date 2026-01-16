import React, { useState } from 'react';
import { Upload, Trash2, Car, X, MapPin, Fuel, Users, DollarSign, Camera, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import mediaUpload from '../utils/mediaUpload';

const AddVehicleForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vehicle information state - Matching exact schema
  const [branch_name, setBranchName] = useState('');
  const [images, setImages] = useState([]); // Vehicle images array
  const [vehicle_book_image, setVehicleBookImage] = useState(''); // Single registration book image
  const [vehicle_type, setVehicleType] = useState('');
  const [vehicle_model, setVehicleModel] = useState('');
  const [seating_capacity, setSeatingCapacity] = useState('');
  const [price_per_day, setPricePerDay] = useState('');
  const [fuel_type, setFuelType] = useState('');

  // Branch options with 25 districts
  const branchOptions = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa',
    'Badulla', 'Moneragala', 'Ratnapura', 'Kegalle'
  ];

  // Vehicle type options - Matching schema enum
  const vehicleTypeOptions = [
    { value: 'tuk_tuk', label: 'Tuk Tuk', icon: '🛺' },
    { value: 'motorbike', label: 'Motorbike', icon: '🏍️' },
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'van', label: 'Van', icon: '🚐' },
    { value: 'other', label: 'Other', icon: '🚘' }
  ];

  // Fuel type options - Matching schema enum
  const fuelTypeOptions = [
    { value: 'petrol', label: 'Petrol' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' }
  ];

  // STEP DEFINITIONS - Simplified to match schema requirements
  const getSteps = () => [
    { number: 1, title: 'Basic Information', desc: 'Vehicle details & location' },
    { number: 2, title: 'Images & Documents', desc: 'Photos & registration book' },
    { number: 3, title: 'Pricing & Capacity', desc: 'Set price & specifications' },
    { number: 4, title: 'Review & Submit', desc: 'Final review' }
  ];

  const steps = getSteps();
  const totalSteps = steps.length;

  // IMAGE HANDLING FUNCTIONS

  // Handle vehicle images upload (multiple)
  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;
    
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random() + Math.floor(Math.random() * 1000),
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages(prev => [...prev, ...newImages]);
  };

  // Handle vehicle book image upload (single)
  const handleBookImageUpload = (file) => {
    if (!file) return;
    
    if (vehicle_book_image) {
      URL.revokeObjectURL(vehicle_book_image.preview);
    }
    
    const newImage = {
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    };
    
    setVehicleBookImage(newImage);
  };

  // Remove vehicle image
  const removeImage = (imageId) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter(img => img.id !== imageId);
    });
  };

  // Remove vehicle book image
  const removeBookImage = () => {
    if (vehicle_book_image) {
      URL.revokeObjectURL(vehicle_book_image.preview);
      setVehicleBookImage('');
    }
  };

  // NAVIGATION FUNCTIONS WITH VALIDATION

  const nextStep = () => {
    // Step 1: Basic Information validation
    if (currentStep === 1) {
      if (!branch_name) {
        toast.error("Please select a branch location");
        return;
      }
      if (!vehicle_type) {
        toast.error("Please select a vehicle type");
        return;
      }
      if (!vehicle_model.trim()) {
        toast.error("Please enter the vehicle model");
        return;
      }
      if (!fuel_type) {
        toast.error("Please select a fuel type");
        return;
      }
    }

    // Step 2: Images & Documents validation
    if (currentStep === 2) {
      if (images.length === 0) {
        toast.error("Please upload at least one vehicle image");
        return;
      }
      if (!vehicle_book_image) {
        toast.error("Please upload the vehicle registration book image");
        return;
      }
    }

    // Step 3: Pricing validation
    if (currentStep === 3) {
      if (!seating_capacity || seating_capacity < 1) {
        toast.error("Please enter a valid seating capacity (minimum 1)");
        return;
      }
      if (!price_per_day || price_per_day < 0) {
        toast.error("Please enter a valid price per day (cannot be negative)");
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // SUBMIT FUNCTION - Matching controller expectations
  const submitVehicle = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        setIsSubmitting(false);
        return;
      }

      // Upload all images
      console.log('Uploading vehicle images...');
      const imageUrls = await Promise.all(images.map(img => mediaUpload(img.file)));
      
      console.log('Uploading registration book...');
      const bookImageUrl = await mediaUpload(vehicle_book_image.file);

      // Prepare vehicle data - Matching exact schema requirements
      const vehicleData = {
        branch_name: branch_name.trim(),
        images: imageUrls, // Array of image URLs
        vehicle_book_image: bookImageUrl, // Single image URL
        vehicle_type: vehicle_type,
        vehicle_model: vehicle_model.trim(),
        seating_capacity: parseInt(seating_capacity),
        price_per_day: parseFloat(price_per_day),
        fuel_type: fuel_type
        // status will default to 'active' as per schema
        // date will default to Date.now() as per schema
        // vehicle_id will be generated by the controller
      };

      console.log('Submitting vehicle data:', vehicleData);

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + '/api/vehicle/addvehicle',
        vehicleData,
        {
          headers: {
            'Authorization': 'Bearer ' + token,
          }
        }
      );

      console.log('Response:', response);
      toast.success('Vehicle added successfully!');
      navigate('/vehiclerental/dashboard');

    } catch (error) {
      console.error('Error adding vehicle:', error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong!');
      } else {
        toast.error('Network error! Please check your connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // RENDER FUNCTIONS

  // Step indicator component
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="relative">
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
          }}
        ></div>

        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            
            return (
              <div key={step.number} className="flex flex-col items-center group">
                <div className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 transform
                  ${isCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-100' 
                    : isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200' 
                    : 'bg-white text-gray-400 border-2 border-gray-300 hover:border-gray-400'
                  }
                `}>
                  {isCompleted ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    step.number
                  )}
                  
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"></div>
                  )}
                </div>

                <div className="mt-3 text-center min-w-0">
                  <div className={`text-sm font-semibold transition-colors duration-200 ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className={`text-xs mt-1 transition-colors duration-200 ${
                    isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {step.desc}
                  </div>
                  
                  {isActive && (
                    <div className="mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <div className="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep} of {totalSteps}
            </span>
            <div className="ml-3 flex space-x-1">
              {Array.from({ length: totalSteps }, (_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    i + 1 === currentStep
                      ? 'bg-blue-500 scale-125'
                      : i + 1 < currentStep
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 1: Basic Information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Car className="w-5 h-5 mr-2 text-blue-500" />
          Vehicle Basic Information
        </h3>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Branch Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Branch Location *
            </label>
            <select
              value={branch_name}
              onChange={(e) => setBranchName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select your branch location</option>
              {branchOptions.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          {/* Vehicle Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Vehicle Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {vehicleTypeOptions.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setVehicleType(type.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    vehicle_type === type.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-sm font-medium">{type.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle Model */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Model *
            </label>
            <input
              type="text"
              value={vehicle_model}
              onChange={(e) => setVehicleModel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., Toyota Corolla, Honda Civic, Bajaj RE"
              required
            />
          </div>

          {/* Fuel Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Fuel className="w-4 h-4 inline mr-1" />
              Fuel Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {fuelTypeOptions.map((fuel) => (
                <button
                  key={fuel.value}
                  type="button"
                  onClick={() => setFuelType(fuel.value)}
                  className={`p-3 border-2 rounded-lg text-center transition-all ${
                    fuel_type === fuel.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-sm font-medium">{fuel.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Images & Documents
  const renderImagesAndDocuments = () => (
    <div className="space-y-6">
      {/* Vehicle Images */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Camera className="w-5 h-5 mr-2 text-blue-500" />
          Vehicle Images *
        </h3>
        
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload vehicle images</span>
              <span className="text-xs text-gray-400">PNG, JPG up to 10MB each (minimum 1 image required)</span>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt="Vehicle preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="text-xs text-gray-500">
          {images.length} vehicle image(s) uploaded (Required: At least 1)
        </div>
      </div>

      {/* Registration Book */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-green-500" />
          Vehicle Registration Book *
        </h3>
        
        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Click to upload registration book</span>
              <span className="text-xs text-gray-400">Clear photo of vehicle registration document (Required)</span>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleBookImageUpload(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>

        {vehicle_book_image && (
          <div className="relative group inline-block">
            <img
              src={vehicle_book_image.preview}
              alt="Registration book"
              className="w-48 h-32 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeBookImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          {vehicle_book_image ? 'Registration book uploaded ✓' : 'Registration book required'}
        </div>
      </div>
    </div>
  );

  // Step 3: Pricing & Capacity
  const renderPricingAndCapacity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-500" />
          Pricing & Vehicle Capacity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Seating Capacity *
            </label>
            <input
              type="number"
              min="1"
              value={seating_capacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Number of seats (minimum 1)"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              Enter the maximum number of passengers this vehicle can accommodate
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price per Day (LKR) *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price_per_day}
              onChange={(e) => setPricePerDay(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter daily rental price"
              required
            />
            <div className="mt-1 text-xs text-gray-500">
              Set a competitive price for your vehicle rental (cannot be negative)
            </div>
          </div>
        </div>

        {/* Pricing Guidelines */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Pricing Guidelines</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Tuk Tuk:</strong> LKR 2,000 - 4,000 per day</p>
            <p>• <strong>Motorbike:</strong> LKR 1,500 - 3,000 per day</p>
            <p>• <strong>Car:</strong> LKR 5,000 - 15,000 per day</p>
            <p>• <strong>Van:</strong> LKR 8,000 - 20,000 per day</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Review & Submit
  const renderReviewAndSubmit = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <Car className="w-5 h-5 mr-2 text-blue-500" />
          Review Your Vehicle Listing
        </h3>
        
        {/* Vehicle Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Basic Information</h4>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Branch:</strong> {branch_name}</p>
                <p><strong>Type:</strong> {vehicleTypeOptions.find(t => t.value === vehicle_type)?.label || vehicle_type}</p>
                <p><strong>Model:</strong> {vehicle_model}</p>
                <p><strong>Fuel Type:</strong> {fuelTypeOptions.find(f => f.value === fuel_type)?.label || fuel_type}</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-sm font-semibold text-green-800 mb-2">Capacity & Pricing</h4>
              <div className="space-y-1 text-sm text-green-700">
                <p><strong>Seating Capacity:</strong> {seating_capacity} passengers</p>
                <p><strong>Price per Day:</strong> LKR {price_per_day ? parseFloat(price_per_day).toLocaleString() : '0'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="text-sm font-semibold text-purple-800 mb-2">Media & Documents</h4>
              <div className="space-y-1 text-sm text-purple-700">
                <p><strong>Vehicle Images:</strong> {images.length} uploaded</p>
                <p><strong>Registration Book:</strong> {vehicle_book_image ? 'Uploaded ✓' : 'Missing ⚠️'}</p>
              </div>
            </div>

            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="text-sm font-semibold text-orange-800 mb-2">Status</h4>
              <div className="text-sm text-orange-700">
                <p>Your vehicle will be set to <strong>"Active"</strong> status after submission and will be available for booking once approved.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Preview */}
        {images.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Vehicle Image Gallery</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {images.map((image) => (
                <img
                  key={image.id}
                  src={image.preview}
                  alt="Vehicle"
                  className="w-full h-16 object-cover rounded border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Registration Book Preview */}
        {vehicle_book_image && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Registration Book</h4>
            <img
              src={vehicle_book_image.preview}
              alt="Registration Book"
              className="w-48 h-32 object-cover rounded border"
            />
          </div>
        )}

        {/* Final confirmation */}
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Before You Submit</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Ensure all information matches your vehicle registration document</li>
            <li>• Vehicle images clearly show the condition and exterior/interior</li>
            <li>• Registration book image is clear and readable</li>
            <li>• Pricing is competitive and fair for your vehicle type</li>
            <li>• All required fields are completed accurately</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Main component render
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Vehicle</h1>
          <p className="text-gray-600">Add your vehicle to our rental platform and start earning with confident renters</p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Render appropriate step content */}
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderImagesAndDocuments()}
          {currentStep === 3 && renderPricingAndCapacity()}
          {currentStep === 4 && renderReviewAndSubmit()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/vehiclerental/dashboard')}
              className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-all"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-lg font-medium transition-all"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  disabled={isSubmitting}
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={submitVehicle}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Vehicle'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleForm;
