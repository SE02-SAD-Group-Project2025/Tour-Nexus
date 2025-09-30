import React, { useState, useEffect } from "react";
import { Calendar, MapPin, User, Phone, Star, Send } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function GuideBookingForm({
  guide,
  selectedDates,
  onSubmit,
  onCancel,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    checkInDate: localStorage.getItem("checkindate") || "",
    checkOutDate: localStorage.getItem("checkoutdate") || "",
    no_of_guests_count: 1,
    nationality: "",
    emergency_contact: "",
    special_requests: "",
  });
  const [loading, setLoading] = useState(false);

  // Debug selectedDates
  useEffect(() => {
    console.log("Received selectedDates:", selectedDates);
  }, [selectedDates]);

  const handleInputChange = (field, value) => {
    // Prevent changes to checkInDate and checkOutDate
    if (field === "checkInDate" || field === "checkOutDate") {
      return;
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (formData.no_of_guests_count < 1) {
      toast.error("Number of guests must be at least 1");
      return;
    }

    if (!formData.nationality) {
      toast.error("Please select a nationality");
      return;
    }

    if (!formData.emergency_contact) {
      toast.error("Please provide an emergency contact");
      return;
    }

    // Calculate duration
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const duration = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Calculate total amount
    const total_amount =
      guide.daily_rate * duration * formData.no_of_guests_count;

    // Get tourist email from local storage
    const tourist_email = localStorage.getItem("email");

    if (!tourist_email) {
      toast.error("Please login to make a booking");
      return;
    }

    // Prepare booking data to match controller expectations
    const bookingData = {
      guide_id: guide.guide_id,
      guide_email: guide.email,
      email: tourist_email,
      price_per_day: guide.daily_rate.toString(),
      check_in_date: formData.checkInDate,
      check_out_date: formData.checkOutDate,
      days_count: duration.toString(),
      no_of_guests_count: formData.no_of_guests_count.toString(),
      total_amount: total_amount.toString(),
      nationality: formData.nationality,
      emergency_contact: formData.emergency_contact,
      special_requests: formData.special_requests,
      booking_status: "requested",
    };

    try {
      setLoading(true);
      console.log("Sending booking data:", bookingData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/guidebookings/book`,
        bookingData
      );

      console.log("Booking response:", response.data);

      if (response.data.success) {
        toast.success("Booking request sent successfully!");
        if (onSubmit) {
          onSubmit(response.data.data);
        }
        navigate("/tourist/dashboard", {
          state: { activeMenuItem: "My Bookings" },
        });
      } else {
        toast.error("Booking failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error creating booking:", error);

      // Handle specific error responses
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 409) {
        toast.error("Guide is not available for the selected dates");
      } else if (error.response?.status === 400) {
        toast.error("Invalid booking data. Please check your inputs.");
      } else {
        toast.error("Failed to create booking. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount for display
  const totalAmount =
    formData.checkInDate && formData.checkOutDate && guide.daily_rate
      ? guide.daily_rate *
        Math.ceil(
          (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) /
            (1000 * 60 * 60 * 24)
        ) *
        formData.no_of_guests_count
      : 0;

  // Calculate duration for display
  const duration =
    formData.checkInDate && formData.checkOutDate
      ? Math.ceil(
          (new Date(formData.checkOutDate) - new Date(formData.checkInDate)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  if (!guide || !guide.guide_id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Error: Guide data not available
        </h2>
        <button
          onClick={onCancel}
          className="mt-4 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Book Your Guide
          </h1>
          <p className="text-gray-600">
            Complete your booking with {guide.full_name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guide Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <img
                  src={guide.profile_image || "https://via.placeholder.com/150"}
                  alt={guide.full_name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/150")
                  }
                />
                <h2 className="text-xl font-bold text-gray-900">
                  {guide.full_name}
                </h2>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">
                    {guide.rating || "N/A"}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({guide.total_reviews || 0} reviews)
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {guide.years_of_experience} years experience
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{guide.contact_number}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {guide.languages?.join(", ") || "Languages not specified"}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {guide.area_cover?.join(", ") || "Areas not specified"}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Daily Rate:</span>
                  <span className="font-semibold">
                    LKR {guide.daily_rate?.toLocaleString() || "N/A"}
                  </span>
                </div>
              </div>

              {formData.checkInDate && formData.checkOutDate && (
                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Booking Summary
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Days:</span>
                      <span>{duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Guests:</span>
                      <span>{formData.no_of_guests_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rate per day:</span>
                      <span>LKR {guide.daily_rate?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-blue-900 border-t border-blue-200 pt-2">
                      <span>Total:</span>
                      <span>LKR {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="space-y-6">
                {/* Selected Dates Display */}
                {formData.checkInDate && formData.checkOutDate && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">
                      Selected Dates
                    </h3>
                    <div className="flex items-center text-green-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>
                        {formData.checkInDate} to {formData.checkOutDate}
                      </span>
                    </div>
                  </div>
                )}

                {/* Tour Details */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Tour Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkInDate}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={formData.checkOutDate}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (Days)
                      </label>
                      <input
                        type="text"
                        value={duration > 0 ? duration : "---"}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Guests <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.no_of_guests_count}
                        onChange={(e) =>
                          handleInputChange(
                            "no_of_guests_count",
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter number of guests"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.nationality}
                        onChange={(e) =>
                          handleInputChange("nationality", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Select Nationality</option>
                        <option value="Afghan">Afghan</option>
                        <option value="Albanian">Albanian</option>
                        <option value="Algerian">Algerian</option>
                        <option value="American">American</option>
                        <option value="Australian">Australian</option>
                        <option value="Austrian">Austrian</option>
                        <option value="Bangladeshi">Bangladeshi</option>
                        <option value="Belgian">Belgian</option>
                        <option value="Brazilian">Brazilian</option>
                        <option value="British">British</option>
                        <option value="Bulgarian">Bulgarian</option>
                        <option value="Canadian">Canadian</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Colombian">Colombian</option>
                        <option value="Croatian">Croatian</option>
                        <option value="Czech">Czech</option>
                        <option value="Danish">Danish</option>
                        <option value="Dutch">Dutch</option>
                        <option value="Egyptian">Egyptian</option>
                        <option value="English">English</option>
                        <option value="Estonian">Estonian</option>
                        <option value="Ethiopian">Ethiopian</option>
                        <option value="Filipino">Filipino</option>
                        <option value="Finnish">Finnish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Greek">Greek</option>
                        <option value="Indian">Indian</option>
                        <option value="Indonesian">Indonesian</option>
                        <option value="Iranian">Iranian</option>
                        <option value="Iraqi">Iraqi</option>
                        <option value="Irish">Irish</option>
                        <option value="Israeli">Israeli</option>
                        <option value="Italian">Italian</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Jordanian">Jordanian</option>
                        <option value="Kenyan">Kenyan</option>
                        <option value="Malaysian">Malaysian</option>
                        <option value="Mexican">Mexican</option>
                        <option value="Moroccan">Moroccan</option>
                        <option value="Nepalese">Nepalese</option>
                        <option value="New Zealander">New Zealander</option>
                        <option value="Nigerian">Nigerian</option>
                        <option value="Norwegian">Norwegian</option>
                        <option value="Pakistani">Pakistani</option>
                        <option value="Polish">Polish</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Romanian">Romanian</option>
                        <option value="Russian">Russian</option>
                        <option value="Saudi">Saudi</option>
                        <option value="Scottish">Scottish</option>
                        <option value="Singaporean">Singaporean</option>
                        <option value="South African">South African</option>
                        <option value="South Korean">South Korean</option>
                        <option value="Spanish">Spanish</option>
                        <option value="Sri Lankan">Sri Lankan</option>
                        <option value="Swedish">Swedish</option>
                        <option value="Swiss">Swiss</option>
                        <option value="Thai">Thai</option>
                        <option value="Turkish">Turkish</option>
                        <option value="Ukrainian">Ukrainian</option>
                        <option value="Vietnamese">Vietnamese</option>
                        <option value="Welsh">Welsh</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Emergency Contact{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.emergency_contact}
                        onChange={(e) =>
                          handleInputChange("emergency_contact", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter emergency contact number"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Any valid phone number format is accepted
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        rows={3}
                        value={formData.special_requests}
                        onChange={(e) =>
                          handleInputChange("special_requests", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Any specific requirements or preferences..."
                      />
                    </div>
                  </div>
                </div>

                {/* Terms and Total */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      LKR {totalAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      • Calculation: {guide.daily_rate?.toLocaleString()}{" "}
                      LKR/day × {duration} days × {formData.no_of_guests_count}{" "}
                      guests
                    </p>
                    <p>
                      • Final amount may vary based on specific requirements and
                      additional services
                    </p>
                    <p>• Payment will be processed after guide confirmation</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={
                      loading || !formData.checkInDate || !formData.checkOutDate
                    }
                    className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 flex items-center justify-center disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    {loading ? "Submitting..." : "Submit Booking Request"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
