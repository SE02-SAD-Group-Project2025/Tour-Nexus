import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import mediaUpload from '../utils/mediaUpload';

const AddGuideForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [full_name, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [years_of_experience, setYearsOfExperience] = useState("");
  const [guide_license_no, setGuideLicenseNo] = useState("");
  const [contact_number, setContactNumber] = useState("");
  const [bio, setBio] = useState("");
  const [profile_image, setProfileImage] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [area_cover, setAreaCover] = useState([]);
  const [daily_rate, setDailyRate] = useState("");
  const [hourly_rate, setHourlyRate] = useState("");

  // Options
  const languageOptions = [
    'English', 'Sinhala', 'Tamil', 'German', 'French', 'Spanish',
    'Italian', 'Russian', 'Chinese', 'Japanese', 'Korean', 'Hindi'
  ];

  const specialtyOptions = [
    'Cultural Tours', 'Wildlife Safari', 'Adventure Tours', 'Historical Sites',
    'Beach Tours', 'Mountain Trekking', 'Tea Plantation Tours', 'Photography Tours',
    'Bird Watching', 'Food Tours', 'Temple Tours', 'Nature Walks'
  ];

  const areaOptions = [
    'Colombo', 'Kandy', 'Galle', 'Nuwara Eliya', 'Ella', 'Sigiriya',
    'Dambulla', 'Anuradhapura', 'Polonnaruwa', 'Yala', 'Udawalawe',
    'Mirissa', 'Unawatuna', 'Bentota', 'Negombo', 'Trincomalee'
  ];

  // Handle image upload
  const handleImageUpload = (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    const imageObject = {
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    };
    
    setProfileImage(imageObject);
  };

  // Remove uploaded image
  const removeImage = () => {
    if (profile_image) {
      URL.revokeObjectURL(profile_image.preview);
    }
    setProfileImage(null);
  };

  // Handle checkbox selections
  const handleLanguageChange = (language) => {
    setLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(l => l !== language)
        : [...prev, language]
    );
  };

  const handleSpecialtyChange = (specialty) => {
    setSpecialities(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleAreaChange = (area) => {
    setAreaCover(prev => 
      prev.includes(area) 
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  // Handle contact number input (only 9 digits after +94)
  const handleContactNumberChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 9) {
      setContactNumber(value);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!full_name.trim()) {
      toast.error("Full name is required");
      return false;
    }
    
    if (!age || age < 18 || age > 80) {
      toast.error("Age must be between 18 and 80");
      return false;
    }
    
    if (!gender) {
      toast.error("Please select your gender");
      return false;
    }
    
    if (!years_of_experience || years_of_experience < 0) {
      toast.error("Years of experience is required");
      return false;
    }
    
    if (!guide_license_no.trim()) {
      toast.error("Guide license number is required");
      return false;
    }
    
    if (!contact_number) {
      toast.error("Contact number is required");
      return false;
    }
    
    const phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(contact_number)) {
      toast.error("Please provide a valid 9-digit phone number (e.g., 0712345678)");
      return false;
    }
    
    if (!bio.trim()) {
      toast.error("Bio is required");
      return false;
    }
    
    if (bio.trim().length < 50) {
      toast.error("Bio must be at least 50 characters long");
      return false;
    }
    
    if (languages.length === 0) {
      toast.error("Please select at least one language");
      return false;
    }

    if (specialities.length === 0) {
      toast.error("Please select at least one specialty");
      return false;
    }

    if (area_cover.length === 0) {
      toast.error("Please select at least one area you cover");
      return false;
    }
    
    if (!daily_rate || daily_rate <= 0) {
      toast.error("Daily rate must be greater than 0");
      return false;
    }
    
    if (!hourly_rate || hourly_rate <= 0) {
      toast.error("Hourly rate must be greater than 0");
      return false;
    }
    
    return true;
  };

  // Submit function
  const submitGuide = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to continue");
        setIsSubmitting(false);
        return;
      }

      let profileImageUrl = "";
      if (profile_image && profile_image.file) {
        toast.loading("Uploading profile image...");
        try {
          console.log("Starting image upload...", profile_image.file);
          profileImageUrl = await mediaUpload(profile_image.file);
          toast.dismiss();
          console.log("Profile image uploaded successfully:", profileImageUrl);
        } catch (uploadError) {
          toast.dismiss();
          console.error("Image upload error:", uploadError);
          console.error("Error details:", uploadError.message);
          console.error("Error response:", uploadError.response?.data);
          
          const continueWithoutImage = window.confirm(
            "Failed to upload profile image. Would you like to continue registration without a profile image?"
          );
          
          if (!continueWithoutImage) {
            setIsSubmitting(false);
            return;
          }
          
          profileImageUrl = "";
          toast.info("Continuing without profile image");
        }
      }

      const guideData = {
        full_name: full_name.trim(),
        age: parseInt(age),
        gender: gender,
        years_of_experience: parseInt(years_of_experience),
        guide_license_no: guide_license_no.trim(),
        contact_number: `+94${contact_number}`,
        bio: bio.trim(),
        profile_image: profileImageUrl,
        languages: languages,
        specialities: specialities,
        area_cover: area_cover,
        daily_rate: parseFloat(daily_rate),
        hourly_rate: parseFloat(hourly_rate)
      };

      console.log("Submitting guide data:", guideData);

      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/guide/addguide", 
        guideData, 
        {
          headers: {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Response:", response);
      toast.success("Guide registration submitted successfully! Pending admin approval.");
      navigate("/guide/dashboard");

    } catch (error) {
      console.error("Error registering guide:", error);
      if (error.response) {
        const message = error.response.data.message || "Registration failed";
        toast.error(message);
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Guide Registration</h1>
          <p className="text-gray-600">Fill in your details to register as a guide</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={full_name}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your age"
                    min="18"
                    max="80"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    value={years_of_experience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Years of guiding experience"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guide License Number *
                  </label>
                  <input
                    type="text"
                    value={guide_license_no}
                    onChange={(e) => setGuideLicenseNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Enter your guide license number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">+94</span>
                    <input
                      type="text"
                      value={contact_number}
                      onChange={handleContactNumberChange}
                      className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="712345678"
                      maxLength={9}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Enter 9 digits (e.g., 0712345678)</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Tell us about yourself and your guiding experience... (minimum 50 characters)"
                    required
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {bio.length}/50 characters minimum
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Profile Image
              </h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="flex items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <span className="text-sm font-medium text-gray-600">Click to upload profile image</span>
                      <span className="text-xs text-gray-400 mt-1">PNG, JPG, WebP up to 10MB</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>

                {profile_image && (
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={profile_image.preview}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{profile_image.file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(profile_image.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Languages *
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {languageOptions.map((language) => (
                  <label key={language} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={languages.includes(language)}
                      onChange={() => handleLanguageChange(language)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{language}</span>
                  </label>
                ))}
              </div>
              {languages.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">Selected Languages:</p>
                  <p className="text-sm text-blue-600">{languages.join(', ')}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Specialties *
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialtyOptions.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={specialities.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
              {specialities.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">Selected Specialties:</p>
                  <p className="text-sm text-blue-600">{specialities.join(', ')}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Areas You Cover *
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {areaOptions.map((area) => (
                  <label key={area} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={area_cover.includes(area)}
                      onChange={() => handleAreaChange(area)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{area}</span>
                  </label>
                ))}
              </div>
              {area_cover.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-800 mb-1">Selected Areas:</p>
                  <p className="text-sm text-blue-600">{area_cover.join(', ')}</p>
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Pricing *
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Rate (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={daily_rate}
                      onChange={(e) => setDailyRate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hourly Rate (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={hourly_rate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="0.00"
                      min="1"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 space-x-4">
              <button
                type="button"
                onClick={() => navigate('/guide/dashboard')}
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitGuide}
                disabled={isSubmitting}
                className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  'Register as Guide'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddGuideForm;