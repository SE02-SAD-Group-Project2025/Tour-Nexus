import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function HotelBookingPage() {
  const { hotel_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRoomData = location.state?.selectedRoom;
  const searchParams = location.state?.searchParams;
  const [hotelData, setHotelData] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(selectedRoomData || null);
  const [roomAvailability, setRoomAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [rooms, setRooms] = useState(searchParams?.rooms || "1");
  const [guests, setGuests] = useState(searchParams?.guests || "2");
  const [checkInDate, setCheckInDate] = useState(
    searchParams?.checkInDate || ""
  );
  const [checkOutDate, setCheckOutDate] = useState(
    searchParams?.checkOutDate || ""
  );
  const [specialRequests, setSpecialRequests] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [numberOfNights, setNumberOfNights] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [elementComplete, setElementComplete] = useState({
    cardNumber: false,
    expiryDate: false,
    cvv: false,
  });
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchHotelData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/hotel/view_hotels_by_id/${hotel_id}`
        );
        const hotel = {
          id: response.data._id,
          hotel_id: response.data.hotel_id,
          name: response.data.hotel_name,
          email: response.data.email,
          address: response.data.address,
          city: response.data.city,
          contact_number: response.data.contact_number,
          description: response.data.description,
          parkingAvailable: response.data.parking_available,
          images: response.data.images || [],
          status: response.data.status,
          totalRooms: response.data.total_rooms,
          roomCategories:
            response.data.room_types?.map((room, index) => ({
              id: index + 1,
              categoryName: room.name,
              roomCount: room.count,
              availableRoomCount: room.available_room_count,
              pricePerNight: room.price,
              facilities: room.facilities || [],
              images: room.images || [],
            })) || [],
        };
        setHotelData(hotel);
        if (!selectedRoom && hotel.roomCategories.length > 0) {
          const availableRooms = hotel.roomCategories.filter(
            (room) => room.availableRoomCount > 0
          );
          if (availableRooms.length > 0) {
            setSelectedRoom(availableRooms[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        toast.error("Failed to load hotel details. Please try again.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    if (hotel_id) {
      fetchHotelData();
    } else {
      navigate("/tourist/dashboard");
    }
  }, [hotel_id, navigate, selectedRoom]);

  useEffect(() => {
    const fetchRoomAvailability = async () => {
      if (!checkInDate || !checkOutDate || !hotel_id) return;
      try {
        setAvailabilityLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/hotelbooking/availability/${hotel_id}`,
          {
            params: {
              check_in_date: checkInDate,
              check_out_date: checkOutDate,
            },
          }
        );
        if (response.data.success) {
          setRoomAvailability(response.data.data.room_availability);
        } else {
          toast.error(
            response.data.message || "Failed to check room availability"
          );
          setRoomAvailability([]);
        }
      } catch (error) {
        console.error("Error fetching room availability:", error);
        toast.error("Failed to check room availability");
        setRoomAvailability([]);
      } finally {
        setAvailabilityLoading(false);
      }
    };
    fetchRoomAvailability();
  }, [checkInDate, checkOutDate, hotel_id]);

  const handleRoomsChange = (newRooms) => {
    const roomCount = parseInt(newRooms) || 0;
    setRooms(newRooms);
    setErrors((prev) => ({ ...prev, rooms: "" }));
    if (roomCount > 0) {
      const maxGuests = roomCount * 4;
      const currentGuests = parseInt(guests) || 0;
      if (currentGuests > maxGuests) {
        setErrors((prev) => ({
          ...prev,
          guests: `Maximum ${maxGuests} guests allowed for ${roomCount} room${
            roomCount > 1 ? "s" : ""
          }`,
        }));
        setGuests("");
      } else {
        setErrors((prev) => ({ ...prev, guests: "" }));
      }
      const availabilityData = roomAvailability.find(
        (r) => r.roomType === selectedRoom?.categoryName
      );
      if (availabilityData && roomCount > availabilityData.availableRooms) {
        setErrors((prev) => ({
          ...prev,
          rooms: `Only ${availabilityData.availableRooms} rooms available for ${selectedRoom.categoryName} on selected dates`,
        }));
      }
    } else {
      setGuests("");
      setErrors((prev) => ({ ...prev, guests: "" }));
    }
  };

  const handleGuestsChange = (newGuests) => {
    const roomCount = parseInt(rooms) || 0;
    const maxGuests = roomCount * 4;
    const guestCount = parseInt(newGuests) || 0;
    if (roomCount === 0) {
      setErrors((prev) => ({
        ...prev,
        guests: "Please select number of rooms first",
      }));
      return;
    }
    if (guestCount > maxGuests) {
      setErrors((prev) => ({
        ...prev,
        guests: `Maximum ${maxGuests} guests allowed for ${roomCount} room${
          roomCount > 1 ? "s" : ""
        }`,
      }));
      return;
    }
    setErrors((prev) => ({ ...prev, guests: "" }));
    setGuests(newGuests);
  };

  const handleElementChange = (elementType) => (event) => {
    setErrors((prev) => ({
      ...prev,
      [elementType]: event.error ? event.error.message : "",
    }));
    setElementComplete((prev) => ({ ...prev, [elementType]: event.complete }));
  };

  useEffect(() => {
    if (checkInDate && checkOutDate && rooms && selectedRoom) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const roomCount = parseInt(rooms) || 0;
      if (nights > 0 && roomCount > 0) {
        setNumberOfNights(nights);
        const total = nights * roomCount * selectedRoom.pricePerNight;
        setTotalPrice(total);
      } else {
        setNumberOfNights(0);
        setTotalPrice(0);
      }
    } else {
      setNumberOfNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, rooms, selectedRoom]);

  const validateForm = () => {
    const newErrors = {};
    const roomCount = parseInt(rooms) || 0;
    const guestCount = parseInt(guests) || 0;
    const availabilityData = roomAvailability.find(
      (r) => r.roomType === selectedRoom?.categoryName
    );
    if (
      selectedRoom &&
      availabilityData &&
      roomCount > availabilityData.availableRooms
    ) {
      newErrors.rooms = `Only ${availabilityData.availableRooms} rooms available for ${selectedRoom.categoryName} on selected dates`;
    }
    if (!checkInDate) newErrors.checkInDate = "Check-in date is required";
    if (!checkOutDate) newErrors.checkOutDate = "Check-out date is required";
    if (roomCount < 1) newErrors.rooms = "At least 1 room is required";
    if (guestCount < 1) newErrors.guests = "At least 1 guest is required";
    if (guestCount > roomCount * 4) {
      newErrors.guests = `Maximum ${
        roomCount * 4
      } guests allowed for ${roomCount} room${roomCount > 1 ? "s" : ""}`;
    }
    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (checkIn < today) {
        newErrors.checkInDate = "Check-in date cannot be in the past";
      }
      if (checkOut <= checkIn) {
        newErrors.checkOutDate = "Check-out date must be after check-in date";
      }
    }
    if (!elementComplete.cardNumber) {
      newErrors.cardNumber =
        newErrors.cardNumber || "Please enter a valid card number";
    }
    if (!elementComplete.expiryDate) {
      newErrors.expiryDate =
        newErrors.expiryDate || "Please enter a valid expiry date";
    }
    if (!elementComplete.cvv) {
      newErrors.cvv = newErrors.cvv || "Please enter a valid CVV";
    }
    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !selectedRoom || !hotelData) {
      toast.error("Please correct the errors in the form");
      return;
    }
    setIsLoading(true);
    try {
      const userEmail = localStorage.getItem("email");
      const bookingPayload = {
        hotel_id: hotelData.hotel_id,
        category_id: selectedRoom.id,
        no_of_rooms: parseInt(rooms),
        no_of_guests: parseInt(guests),
        per_price: selectedRoom.pricePerNight,
        total_price: totalPrice,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        special_requests: specialRequests,
        booking_status: "pending",
        email: userEmail,
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotelbooking/create`,
        bookingPayload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.data.success) {
        setBookingSuccess(true);
        setBookingId(response.data.booking.booking_id);
        toast.success("Booking created successfully!");
        setCardholderName("");
        if (elements) {
          elements.getElement(CardNumberElement)?.clear();
          elements.getElement(CardExpiryElement)?.clear();
          elements.getElement(CardCvcElement)?.clear();
        }
        setErrors({});
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.message || "Server error occurred";
        toast.error(`Booking failed: ${errorMessage}`);
        if (error.response.status === 400 && error.response.data.errors) {
          setErrors(error.response.data.errors);
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏨</div>
          <div className="text-xl text-gray-600">Loading hotel details...</div>
        </div>
      </div>
    );
  }

  if (!hotelData || !selectedRoom || hotelData.status !== "approved") {
    return (
      <div className="min-h-screen bg-gray-50 p-5 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg border">
          <div className="text-6xl mb-4">❌</div>
          <div className="text-xl text-gray-800 mb-4">Hotel Not Available</div>
          <div className="text-gray-600 mb-6">
            {!hotelData
              ? "Hotel not found."
              : hotelData.status !== "approved"
              ? "Hotel is not currently accepting bookings."
              : "No rooms available for booking."}
          </div>
          <button
            onClick={() => navigate("/tourist/dashboard")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 p-5 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-200 text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Booking Confirmed!
          </h1>
          <div className="mb-4">
            <p className="text-gray-600">Your booking ID:</p>
            <p className="text-xl font-bold text-gray-800">{bookingId}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              <strong>Hotel:</strong> {hotelData.name}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Room:</strong> {selectedRoom.categoryName}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Check-in:</strong>{" "}
              {new Date(checkInDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Check-out:</strong>{" "}
              {new Date(checkOutDate).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total:</strong> LKR {totalPrice.toLocaleString()}
            </p>
          </div>
          <div className="mb-6 text-sm text-gray-600">
            <p>You will receive a confirmation email shortly.</p>
            <p>Please save your booking ID for future reference.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/bookings/${bookingId}`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
            >
              View Booking
            </button>
            <button
              onClick={() => navigate("/tourist/dashboard")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              Back to Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white p-6 rounded-lg mb-8 border border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-4 py-2 rounded mb-5 text-sm hover:bg-gray-700"
          >
            ← Back to Hotel Details
          </button>
          <h1 className="text-3xl font-bold mb-3 text-gray-800">
            {" "}
            Book Your Stay{" "}
          </h1>
          <div className="text-gray-600 mb-2">
            <strong>{hotelData.name}</strong> - {selectedRoom.categoryName}
          </div>
          <div className="text-gray-600 text-sm"> 📍 {hotelData.address} </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {" "}
                Select Room Type{" "}
              </h2>
              {availabilityLoading ? (
                <div className="text-center text-gray-600">
                  Checking room availability...
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {hotelData.roomCategories
                    .filter((room) => {
                      const availabilityData = roomAvailability.find(
                        (r) => r.roomType === room.categoryName
                      );
                      return (
                        availabilityData?.available &&
                        availabilityData?.availableRooms > 0
                      );
                    })
                    .map((room) => {
                      const availabilityData = roomAvailability.find(
                        (r) => r.roomType === room.categoryName
                      );
                      return (
                        <div
                          key={room.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedRoom?.id === room.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => setSelectedRoom(room)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">
                                {room.categoryName}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {availabilityData?.availableRooms || 0} room
                                {availabilityData?.availableRooms > 1
                                  ? "s"
                                  : ""}{" "}
                                available
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {room.facilities
                                  .slice(0, 3)
                                  .map((facility, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded"
                                    >
                                      {facility}
                                    </span>
                                  ))}
                                {room.facilities.length > 3 && (
                                  <span className="text-xs text-gray-500">
                                    {" "}
                                    +{room.facilities.length - 3} more{" "}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-green-600">
                                {" "}
                                LKR {room.pricePerNight.toLocaleString()}{" "}
                              </div>
                              <div className="text-sm text-gray-500">
                                per night
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  {roomAvailability.length === 0 && !availabilityLoading && (
                    <div className="text-center text-gray-600">
                      {" "}
                      No rooms available for selected dates. Please try
                      different dates.{" "}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-white p-8 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {" "}
                Booking Details{" "}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Check-in Date *{" "}
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.checkInDate && (
                    <span className="text-red-500 text-sm">
                      {" "}
                      {errors.checkInDate}{" "}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Check-out Date *{" "}
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={checkInDate || new Date().toISOString().split("T")[0]}
                  />
                  {errors.checkOutDate && (
                    <span className="text-red-500 text-sm">
                      {" "}
                      {errors.checkOutDate}{" "}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Number of Rooms *{" "}
                  </label>
                  <select
                    value={rooms}
                    onChange={(e) => handleRoomsChange(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={availabilityLoading || !selectedRoom}
                  >
                    <option value="">Select rooms</option>
                    {selectedRoom &&
                      roomAvailability.find(
                        (r) => r.roomType === selectedRoom.categoryName
                      )?.availableRooms &&
                      [
                        ...Array(
                          Math.min(
                            roomAvailability.find(
                              (r) => r.roomType === selectedRoom.categoryName
                            ).availableRooms,
                            10
                          )
                        ),
                      ].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} room{i > 0 ? "s" : ""}
                        </option>
                      ))}
                  </select>
                  {rooms && selectedRoom && (
                    <div className="text-xs text-gray-500 mt-1">
                      {parseInt(rooms) || 0} room
                      {(parseInt(rooms) || 0) > 1 ? "s" : ""} = Maximum{" "}
                      {(parseInt(rooms) || 0) * 4} guests allowed
                    </div>
                  )}
                  {errors.rooms && (
                    <span className="text-red-500 text-sm">
                      {" "}
                      {errors.rooms}{" "}
                    </span>
                  )}
                </div>
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Number of Guests *{" "}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => handleGuestsChange(e.target.value)}
                    className={`w-full p-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                      errors.guests
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    disabled={!rooms || parseInt(rooms) === 0}
                  >
                    <option value="">Select guests</option>
                    {rooms &&
                      [...Array((parseInt(rooms) || 0) * 4)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} guest{i > 0 ? "s" : ""}
                        </option>
                      ))}
                  </select>
                  {errors.guests && (
                    <span className="text-red-500 text-sm block mt-1">
                      {" "}
                      {errors.guests}{" "}
                    </span>
                  )}
                  {(!rooms || parseInt(rooms) === 0) && (
                    <div className="text-xs text-gray-400 mt-1">
                      {" "}
                      Please select number of rooms first{" "}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {" "}
                Payment Details{" "}
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Card Number *{" "}
                  </label>
                  <div
                    className={`p-3 border rounded-lg text-base focus-within:ring-2 ${
                      errors.cardNumber
                        ? "border-red-500 focus-within:ring-red-500"
                        : "border-gray-300 focus-within:ring-blue-500"
                    }`}
                  >
                    <CardNumberElement
                      options={{
                        placeholder: "1234 5678 9012 3456",
                        showIcon: true,
                      }}
                      onChange={handleElementChange("cardNumber")}
                    />
                  </div>
                  {errors.cardNumber && (
                    <span className="text-red-500 text-sm">
                      {" "}
                      {errors.cardNumber}{" "}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-bold text-gray-700">
                      {" "}
                      Expiry Date *{" "}
                    </label>
                    <div
                      className={`p-3 border rounded-lg text-base focus-within:ring-2 ${
                        errors.expiryDate
                          ? "border-red-500 focus-within:ring-red-500"
                          : "border-gray-300 focus-within:ring-blue-500"
                      }`}
                    >
                      <CardExpiryElement
                        onChange={handleElementChange("expiryDate")}
                      />
                    </div>
                    {errors.expiryDate && (
                      <span className="text-red-500 text-sm">
                        {" "}
                        {errors.expiryDate}{" "}
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 font-bold text-gray-700">
                      {" "}
                      CVV *{" "}
                    </label>
                    <div
                      className={`p-3 border rounded-lg text-base focus-within:ring-2 ${
                        errors.cvv
                          ? "border-red-500 focus-within:ring-red-500"
                          : "border-gray-300 focus-within:ring-blue-500"
                      }`}
                    >
                      <CardCvcElement onChange={handleElementChange("cvv")} />
                    </div>
                    {errors.cvv && (
                      <span className="text-red-500 text-sm">
                        {" "}
                        {errors.cvv}{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-bold text-gray-700">
                    {" "}
                    Cardholder Name *{" "}
                  </label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className={`w-full p-3 border rounded-lg text-base focus:outline-none focus:ring-2 ${
                      errors.cardholderName
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    placeholder="Full name on card"
                  />
                  {errors.cardholderName && (
                    <span className="text-red-500 text-sm">
                      {" "}
                      {errors.cardholderName}{" "}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg mb-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {" "}
                Special Requests{" "}
              </h2>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg text-base min-h-[100px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any special requests or requirements (optional)"
              />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-lg border border-gray-200 sticky top-5">
              <h2 className="text-xl font-bold mb-6 text-gray-800">
                {" "}
                Booking Summary{" "}
              </h2>
              {selectedRoom && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="font-bold mb-1">
                    {" "}
                    {selectedRoom.categoryName}{" "}
                  </div>
                  <div className="text-gray-600 text-sm mb-2">
                    {" "}
                    LKR {selectedRoom.pricePerNight.toLocaleString()} per night{" "}
                  </div>
                  <div className="text-xs text-gray-500">
                    {roomAvailability.find(
                      (r) => r.roomType === selectedRoom.categoryName
                    )?.availableRooms || 0}{" "}
                    room
                    {(roomAvailability.find(
                      (r) => r.roomType === selectedRoom.categoryName
                    )?.availableRooms || 0) > 1
                      ? "s"
                      : ""}{" "}
                    available
                  </div>
                </div>
              )}
              {numberOfNights > 0 && selectedRoom && (
                <div className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Check-in:</span>
                    <span className="font-semibold">
                      {new Date(checkInDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Check-out:</span>
                    <span className="font-semibold">
                      {new Date(checkOutDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Nights:</span>
                    <span className="font-semibold">{numberOfNights}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Rooms:</span>
                    <span className="font-semibold">
                      {parseInt(rooms) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Guests:</span>
                    <span className="font-semibold">
                      {parseInt(guests) || 0}
                    </span>
                  </div>
                </div>
              )}
              {numberOfNights > 0 && selectedRoom && (
                <div className="border-b border-gray-200 pb-4 mb-4 text-sm">
                  <div className="flex justify-between mb-1 text-gray-600">
                    <span>
                      {selectedRoom.categoryName} × {parseInt(rooms) || 0} room
                      {(parseInt(rooms) || 0) > 1 ? "s" : ""}
                    </span>
                    <span>
                      LKR{" "}
                      {(
                        selectedRoom.pricePerNight * (parseInt(rooms) || 0)
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>
                      × {numberOfNights} night{numberOfNights > 1 ? "s" : ""}
                    </span>
                    <span>LKR {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              )}
              {selectedRoom &&
                selectedRoom.facilities &&
                selectedRoom.facilities.length > 0 && (
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="text-sm font-semibold mb-2">
                      Room Includes:
                    </div>
                    <div className="text-xs text-gray-600">
                      {selectedRoom.facilities
                        .slice(0, 4)
                        .map((facility, index) => (
                          <div key={index} className="mb-1">
                            • {facility}
                          </div>
                        ))}
                      {selectedRoom.facilities.length > 4 && (
                        <div className="text-blue-600">
                          +{selectedRoom.facilities.length - 4} more facilities
                        </div>
                      )}
                    </div>
                  </div>
                )}
              <div className="border-b-2 border-green-600 pb-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-green-600">
                  <span>Total Price:</span>
                  <span>LKR {totalPrice.toLocaleString()}</span>
                </div>
                {numberOfNights > 0 && (
                  <div className="text-xs text-gray-600 text-right mt-1">
                    ({numberOfNights} night{numberOfNights > 1 ? "s" : ""} ×{" "}
                    {parseInt(rooms) || 0} room
                    {(parseInt(rooms) || 0) > 1 ? "s" : ""})
                  </div>
                )}
              </div>
              <div className="mb-6 text-xs text-gray-600">
                <div className="font-semibold mb-2">Booking Terms:</div>
                <ul className="space-y-1">
                  <li>• Free cancellation up to 24 hours before check-in</li>
                  <li>• Payment will be processed immediately</li>
                  <li>• Check-in: 2:00 PM | Check-out: 11:00 AM</li>
                  <li>• Valid photo ID required at check-in</li>
                </ul>
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  totalPrice === 0 ||
                  !selectedRoom ||
                  availabilityLoading
                }
                className={`w-full py-4 rounded-lg text-lg font-bold transition-colors ${
                  isLoading ||
                  totalPrice === 0 ||
                  !selectedRoom ||
                  availabilityLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isLoading
                  ? "Processing..."
                  : availabilityLoading
                  ? "Checking Availability..."
                  : totalPrice === 0
                  ? "Complete Booking Details"
                  : `Confirm Booking - LKR ${totalPrice.toLocaleString()}`}
              </button>
              <div className="text-xs text-gray-600 text-center mt-3">
                {" "}
                🔒 Secure payment • You will receive a confirmation email{" "}
              </div>
              {hotelData && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm font-semibold mb-2">Need Help?</div>
                  <div className="text-xs text-gray-600">
                    <div>📧 {hotelData.email}</div>
                    {hotelData.contact_number && (
                      <div>📞 {hotelData.contact_number}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
