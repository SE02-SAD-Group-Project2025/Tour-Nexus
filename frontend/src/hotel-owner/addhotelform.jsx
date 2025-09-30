import React, { useState } from "react";
import { Upload, Plus, Trash2, Star, Car, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";

const AddHotelForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Basic hotel information state
  const [hotel_name, setHotelName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [star, setStar] = useState(0);
  const [contact_number, setContactNumber] = useState("");
  const [description, setDescription] = useState("");
  const [parking_available, setParkingAvailable] = useState(false);
  const [images, setImages] = useState([]); // Hotel main images

  // NEW: Room types configuration state
  const [roomTypeCount, setRoomTypeCount] = useState(0); // How many room types they want
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0); // Which room type we're currently filling
  const [roomTypesData, setRoomTypesData] = useState([]); // Array to store all room types data

  // Predefined facility options for quick selection
  const facilityOptions = [
    "Air Conditioning",
    "Free WiFi",
    "TV",
    "Private Bathroom",
    "Mini Bar",
    "Safe",
    "Balcony",
    "Room Service",
    "Hair Dryer",
    "Coffee Maker",
    "Iron",
    "Telephone",
    "Kitchenette",
    "Jacuzzi",
    "Sea View",
    "Mountain View",
  ];

  // STEP DEFINITIONS - Dynamic based on room type count
  const getSteps = () => {
    if (roomTypeCount === 0) {
      return [
        { number: 1, title: "Basic Information", desc: "Hotel details" },
        { number: 2, title: "Room Types Count", desc: "How many room types?" },
      ];
    }

    const steps = [
      { number: 1, title: "Basic Information", desc: "Hotel details" },
      { number: 2, title: "Room Types Count", desc: "How many room types?" },
    ];

    // Add steps for each room type
    for (let i = 0; i < roomTypeCount; i++) {
      steps.push({
        number: 3 + i,
        title: `Room Type ${i + 1}`,
        desc: `Configure room type ${i + 1}`,
      });
    }

    // Add final step for hotel images
    steps.push({
      number: 3 + roomTypeCount,
      title: "Hotel Images",
      desc: "Upload hotel photos",
    });

    return steps;
  };

  const steps = getSteps();
  const totalSteps = steps.length;

  // ROOM TYPE MANAGEMENT FUNCTIONS

  // Function to add a facility to current room type
  const addFacilityToCurrentRoom = (facilityName) => {
    if (!facilityName.trim()) return;

    setRoomTypesData((prev) => {
      const updated = [...prev];
      if (!updated[currentRoomIndex].facilities.includes(facilityName)) {
        updated[currentRoomIndex].facilities.push(facilityName);
      }
      return updated;
    });
  };

  // Function to remove facility from current room type
  const removeFacilityFromCurrentRoom = (facilityIndex) => {
    setRoomTypesData((prev) => {
      const updated = [...prev];
      updated[currentRoomIndex].facilities.splice(facilityIndex, 1);
      return updated;
    });
  };

  // Function to update current room type data
  const updateCurrentRoomData = (field, value) => {
    setRoomTypesData((prev) => {
      const updated = [...prev];
      updated[currentRoomIndex] = {
        ...updated[currentRoomIndex],
        [field]: value,
      };
      return updated;
    });
  };

  // Handle room type count change - Initialize empty room data
  const handleRoomTypeCountChange = (count) => {
    setRoomTypeCount(count);
    setCurrentRoomIndex(0); // Reset to first room

    // Initialize empty room types data
    const newRoomTypes = [];
    for (let i = 0; i < count; i++) {
      newRoomTypes.push({
        name: "",
        count: 1,
        price: 0,
        facilities: [],
        images: [],
      });
    }
    setRoomTypesData(newRoomTypes);
  };

  // IMAGE HANDLING FUNCTIONS

  // Handle image upload for current room type - FIXED
  const handleRoomImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random() + Math.floor(Math.random() * 1000), // More unique ID
      file,
      preview: URL.createObjectURL(file),
    }));

    setRoomTypesData((prev) => {
      const updated = [...prev];
      if (!updated[currentRoomIndex]) return prev;

      updated[currentRoomIndex] = {
        ...updated[currentRoomIndex],
        images: [...(updated[currentRoomIndex].images || []), ...newImages],
      };
      return updated;
    });
  };

  // Handle hotel main images upload - FIXED
  const handleHotelImageUpload = (files) => {
    if (!files || files.length === 0) return;

    const newImages = Array.from(files).map((file) => ({
      id: Date.now() + Math.random() + Math.floor(Math.random() * 1000), // More unique ID
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  // Remove image from current room type - FIXED
  const removeRoomImage = (imageId) => {
    setRoomTypesData((prev) => {
      const updated = [...prev];
      if (!updated[currentRoomIndex] || !updated[currentRoomIndex].images)
        return prev;

      const imageToRemove = updated[currentRoomIndex].images.find(
        (img) => img.id === imageId
      );
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }

      updated[currentRoomIndex] = {
        ...updated[currentRoomIndex],
        images: updated[currentRoomIndex].images.filter(
          (img) => img.id !== imageId
        ),
      };
      return updated;
    });
  };

  // Remove hotel image
  const removeHotelImage = (imageId) => {
    setImages((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  // NAVIGATION FUNCTIONS

  // Next step with validation
  const nextStep = () => {
    // Validation for Step 1: Basic Information
    if (currentStep === 1) {
      if (!hotel_name || !address || !description) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    // Validation for Step 2: Room Type Count
    if (currentStep === 2) {
      if (roomTypeCount === 0) {
        toast.error("Please specify how many room types your hotel has");
        return;
      }
    }

    // Validation for Room Type Steps
    if (currentStep >= 3 && currentStep < 3 + roomTypeCount) {
      const currentRoom = roomTypesData[currentRoomIndex];

      if (!currentRoom.name || !currentRoom.name.trim()) {
        toast.error("Please enter a name for this room type");
        return;
      }

      if (!currentRoom.count || currentRoom.count < 1) {
        toast.error("Please enter a valid room count");
        return;
      }

      if (!currentRoom.price || currentRoom.price <= 0) {
        toast.error("Please enter a valid price");
        return;
      }

      if (currentRoom.images.length === 0) {
        toast.error("Please upload at least one image for this room type");
        return;
      }
    }

    // Validation for Step 1: Basic Information
    if (currentStep === 1) {
      if (!hotel_name || !address || !city || !contact_number || !description) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Add star rating validation
      if (!star || star < 1 || star > 5) {
        toast.error("Please select a valid star rating (1-5 stars)");
        return;
      }
    }

    // Move to next step
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));

    // Update current room index when moving through room type steps
    if (currentStep >= 3 && currentStep < 2 + roomTypeCount) {
      setCurrentRoomIndex((prev) => prev + 1);
    }
  };

  // Previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));

    // Update current room index when moving back through room type steps
    if (currentStep > 3 && currentStep <= 3 + roomTypeCount) {
      setCurrentRoomIndex((prev) => prev - 1);
    }
  };

  // SUBMIT FUNCTION
  const submitHotel = async () => {
    setIsSubmitting(true);

    try {
      // Check authentication
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        setIsSubmitting(false);
        return;
      }

      // Final validation
      if (images.length === 0) {
        toast.error("Please upload at least one hotel image");
        setIsSubmitting(false);
        return;
      }

      // Upload hotel main images
      console.log("Uploading hotel images...");
      const hotelImagePromises = images.map((img) => mediaUpload(img.file));
      const hotelImageUrls = await Promise.all(hotelImagePromises);
      console.log("Hotel images uploaded:", hotelImageUrls);

      // Upload room images and prepare room types data
      console.log("Processing room types...");
      const processedRoomTypes = [];

      for (let i = 0; i < roomTypesData.length; i++) {
        const roomType = roomTypesData[i];

        // Upload images for this room type
        console.log(`Uploading images for room type ${i + 1}...`);
        const roomImagePromises = roomType.images.map((img) =>
          mediaUpload(img.file)
        );
        const roomImageUrls = await Promise.all(roomImagePromises);

        // Prepare room type data for backend
        processedRoomTypes.push({
          name: roomType.name.trim(),
          count: parseInt(roomType.count),
          price: parseFloat(roomType.price),
          facilities: roomType.facilities,
          images: roomImageUrls,
        });
      }

      // Prepare final hotel data for submission
      const hotelData = {
        hotel_name: hotel_name.trim(),
        address: address.trim(),
        city: city.trim(),
        star: star,
        contact_number: contact_number.trim(),
        description: description.trim(),
        parking_available: parking_available,
        images: hotelImageUrls,
        room_types: processedRoomTypes,
      };

      console.log("Submitting hotel data:", hotelData);

      // Submit to backend
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/hotel/addhotel",
        hotelData,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      console.log("Response:", response);
      toast.success("Hotel added successfully!");
      navigate("/hotelowner/dashboard");
    } catch (error) {
      console.error("Error adding hotel:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong!");
      } else {
        toast.error("Network error! Please check your connection.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // RENDER FUNCTIONS

  // Step indicator component - BEAUTIFUL NEW DESIGN
  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="relative">
        {/* Progress line background */}
        <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 rounded-full"></div>

        {/* Active progress line */}
        <div
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        ></div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isUpcoming = currentStep < step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center group"
              >
                {/* Step circle */}
                <div
                  className={`
                  relative w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 transform
                  ${
                    isCompleted
                      ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg scale-100"
                      : isActive
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg scale-110 ring-4 ring-blue-200"
                      : "bg-white text-gray-400 border-2 border-gray-300 hover:border-gray-400"
                  }
                `}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    step.number
                  )}

                  {/* Active step pulse effect */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25"></div>
                  )}
                </div>

                {/* Step info */}
                <div className="mt-3 text-center min-w-0">
                  <div
                    className={`text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div
                    className={`text-xs mt-1 transition-colors duration-200 ${
                      isActive || isCompleted
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.desc}
                  </div>

                  {/* Active step indicator */}
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

        {/* Step counter */}
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
                      ? "bg-blue-500 scale-125"
                      : i + 1 < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 1: Basic hotel information
  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Hotel Information
        </h3>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Name *
            </label>
            <input
              type="text"
              value={hotel_name}
              onChange={(e) => setHotelName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter your hotel name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter hotel address"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter hotel City"
              required
            />
          </div>

          {/* Star Rating Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Hotel Star Rating *
            </label>
            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((starValue) => (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setStar(starValue)}
                  className={`transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 rounded ${
                    starValue <= star
                      ? "text-yellow-500 hover:text-yellow-600"
                      : "text-gray-300 hover:text-yellow-400"
                  }`}
                >
                  <Star
                    className="w-6 h-6"
                    fill={starValue <= star ? "currentColor" : "none"}
                  />
                </button>
              ))}
              <span className="ml-3 text-sm font-medium text-gray-700">
                {star}/5 stars
              </span>
            </div>

            {star > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  {star === 1 && "Budget - Basic accommodation"}
                  {star === 2 && "Economy - Standard amenities"}
                  {star === 3 && "Mid-range - Good facilities"}
                  {star === 4 && "Superior - High-quality service"}
                  {star === 5 && "Luxury - Exceptional experience"}
                </p>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              Star ratings help guests understand your hotel's service level and
              pricing category.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotline *
            </label>
            <input
              type="text"
              value={contact_number}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Enter hotel Hotline Number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hotel Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your hotel, its unique features, and what makes it special..."
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={parking_available}
                onChange={(e) => setParkingAvailable(e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-2 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  Parking Available
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Ask how many room types
  const renderRoomTypeCount = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          How many room types does your hotel have?
        </h3>
        <p className="text-gray-600 mb-6">
          Tell us how many different types of rooms you offer. For example:
          Standard Room, Deluxe Room, Suite, etc.
        </p>

        <div className="flex justify-center mb-6">
          <input
            type="number"
            min="1"
            max="10"
            value={roomTypeCount || ""}
            onChange={(e) =>
              handleRoomTypeCountChange(parseInt(e.target.value) || 0)
            }
            className="w-32 px-4 py-3 text-center text-2xl font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div className="text-sm text-gray-500">
          Choose between 1-10 room types. You can always modify this later.
        </div>

        {roomTypeCount > 0 && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Great! You will configure <strong>{roomTypeCount}</strong> room
              type{roomTypeCount > 1 ? "s" : ""} in the next steps.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Step 3+: Individual room type configuration
  const renderRoomTypeStep = () => {
    const currentRoom = roomTypesData[currentRoomIndex] || {};
    const roomNumber = currentRoomIndex + 1;

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Configure Room Type {roomNumber} of {roomTypeCount}
            </h3>
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Basic room information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type Name *
              </label>
              <input
                type="text"
                value={currentRoom.name || ""}
                onChange={(e) => updateCurrentRoomData("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Deluxe Ocean View"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Rooms *
              </label>
              <input
                type="number"
                min="1"
                value={currentRoom.count || ""}
                onChange={(e) =>
                  updateCurrentRoomData("count", parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night (LKR) *
              </label>
              <input
                type="number"
                min="0"
                value={currentRoom.price || ""}
                onChange={(e) =>
                  updateCurrentRoomData(
                    "price",
                    parseFloat(e.target.value) || 0
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Facilities Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Facilities
            </label>

            {/* Quick select facilities */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              {facilityOptions.map((facility, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addFacilityToCurrentRoom(facility)}
                  className="text-left p-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  + {facility}
                </button>
              ))}
            </div>

            {/* Selected facilities */}
            {currentRoom.facilities && currentRoom.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {currentRoom.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {facility}
                    <button
                      type="button"
                      onClick={() => removeFacilityFromCurrentRoom(index)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom facility input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add custom facility..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addFacilityToCurrentRoom(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.target.previousElementSibling;
                  addFacilityToCurrentRoom(input.value);
                  input.value = "";
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Images Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Room Images *
            </label>

            <div className="mb-4">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Click to upload room images
                  </span>
                  <span className="text-xs text-gray-400">
                    PNG, JPG up to 10MB each
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleRoomImageUpload(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>

            {currentRoom.images && currentRoom.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentRoom.images.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.preview}
                      alt="Room preview"
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeRoomImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500">
              {currentRoom.images ? currentRoom.images.length : 0} image(s)
              uploaded for this room type
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Final step: Hotel images
  const renderHotelImages = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Hotel Images
        </h3>
        <p className="text-gray-600 mb-4">
          Upload images of your hotel's common areas, exterior, lobby,
          restaurant, pool, etc. These images will help guests understand your
          hotel's atmosphere and facilities.
        </p>

        <div className="mb-4">
          <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                Click to upload hotel images
              </span>
              <span className="text-xs text-gray-400">
                PNG, JPG up to 10MB each
              </span>
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

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt="Hotel preview"
                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeHotelImage(image.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-gray-500">
          {images.length} hotel image(s) uploaded
        </div>

        {/* Summary of configured room types */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="text-sm font-medium text-green-800 mb-2">
            Room Types Summary:
          </h4>
          <div className="space-y-1">
            {roomTypesData.map((room, index) => (
              <div key={index} className="text-sm text-green-700">
                • {room.name}: {room.count} rooms at LKR {room.price}/night
              </div>
            ))}
          </div>
          <div className="text-sm text-green-700 mt-2 font-medium">
            Total Rooms:{" "}
            {roomTypesData.reduce(
              (total, room) => total + parseInt(room.count),
              0
            )}
          </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Hotel
          </h1>
          <p className="text-gray-600">
            Join our platform and start welcoming guests from around the world
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Main Form Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Render appropriate step content */}
          {currentStep === 1 && renderBasicInfo()}
          {currentStep === 2 && renderRoomTypeCount()}
          {currentStep >= 3 &&
            currentStep < 3 + roomTypeCount &&
            renderRoomTypeStep()}
          {currentStep === 3 + roomTypeCount && renderHotelImages()}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate("/hotelowner/dashboard")}
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
                  onClick={submitHotel}
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit Hotel"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHotelForm;
