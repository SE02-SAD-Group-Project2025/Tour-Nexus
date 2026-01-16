import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewAllHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("hotel_name");
  const [currentPage, setCurrentPage] = useState(1);
  const [hotelsPerPage] = useState(12);

  // Mock navigate function for demonstration
  const navigate = useNavigate();

  // Fetch hotels from API
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/hotel/view_all_hotels`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHotels(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch hotels: ${err.message}`);
      setLoading(false);
      console.error("Error fetching hotels:", err);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Filter and search logic
  const filteredHotels = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.hotel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.hotel_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || hotel.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedHotels = [...filteredHotels].sort((a, b) => {
    switch (sortBy) {
      case "hotel_name":
        return a.hotel_name?.localeCompare(b.hotel_name) || 0;
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "city":
        return a.city?.localeCompare(b.city) || 0;
      case "total_rooms":
        return (b.total_rooms || 0) - (a.total_rooms || 0);
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = sortedHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(sortedHotels.length / hotelsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-gradient-to-r from-emerald-500 to-green-500";
      case "pending":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "rejected":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  // Get lowest room price for display
  const getLowestPrice = (roomTypes) => {
    if (!roomTypes || roomTypes.length === 0) return "N/A";
    return Math.min(...roomTypes.map((room) => room.price));
  };

  // Get stats for display
  const stats = {
    total: hotels.length,
    approved: hotels.filter((h) => h.status === "approved").length,
    pending: hotels.filter((h) => h.status === "pending").length,
    rejected: hotels.filter((h) => h.status === "rejected").length,
  };

  if (loading) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Loading Hotels...
          </h2>
          <p className="mt-2 text-white/80">
            Please wait while we fetch the hotel data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center max-w-md w-full border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Error Loading Hotels
          </h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={fetchHotels}
            className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  View All Hotels
                </h1>
                <p className="text-white/80 mt-2">
                  Browse and discover all registered hotels
                </p>
              </div>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="group bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/30 flex items-center gap-2"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Section */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Hotels",
                value: stats.total,
                color: "from-blue-500 to-indigo-600",
                icon: "🏨",
              },
              {
                label: "Approved",
                value: stats.approved,
                color: "from-emerald-500 to-green-600",
                icon: "✅",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "from-amber-500 to-orange-600",
                icon: "⏳",
              },
              {
                label: "Rejected",
                value: stats.rejected,
                color: "from-red-500 to-pink-600",
                icon: "❌",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`text-3xl bg-gradient-to-r ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Search Hotels
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, city, ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                  />
                  <svg
                    className="absolute left-3 top-3.5 h-5 w-5 text-white/50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Filter by Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="all" className="bg-gray-800">
                    All Status
                  </option>
                  <option value="approved" className="bg-gray-800">
                    Approved
                  </option>
                  <option value="pending" className="bg-gray-800">
                    Pending
                  </option>
                  <option value="rejected" className="bg-gray-800">
                    Rejected
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                >
                  <option value="hotel_name" className="bg-gray-800">
                    Hotel Name
                  </option>
                  <option value="date" className="bg-gray-800">
                    Registration Date
                  </option>
                  <option value="city" className="bg-gray-800">
                    City
                  </option>
                  <option value="total_rooms" className="bg-gray-800">
                    Total Rooms
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchHotels}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Hotels Grid */}
          {currentHotels.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-12 text-center border border-white/20">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-white/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Hotels Found
              </h3>
              <p className="text-white/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {currentHotels.map((hotel) => (
                <div
                  key={hotel._id}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-4 ${getStatusColor(
                      hotel.status
                    )}`}
                  >
                    {hotel.status?.toUpperCase()}
                  </div>

                  {/* Hotel Header */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img
                        src={
                          hotel.images?.[0] ||
                          `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop&crop=center`
                        }
                        alt={hotel.hotel_name}
                        className="w-16 h-16 rounded-lg object-cover border-3 border-white/30 group-hover:border-white/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                        {hotel.hotel_name}
                      </h3>
                      <p className="text-white/70 text-sm bg-white/10 px-2 py-1 rounded-lg inline-block">
                        {hotel.hotel_id}
                      </p>
                    </div>
                  </div>

                  {/* Hotel Details */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          City
                        </p>
                        <p className="text-white font-semibold">{hotel.city}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Total Rooms
                        </p>
                        <p className="text-white font-semibold">
                          {hotel.total_rooms} rooms
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        Contact
                      </p>
                      <p className="text-white/90 text-sm">
                        {hotel.contact_number}
                      </p>
                      <p className="text-white/90 text-sm truncate">
                        {hotel.address}
                      </p>
                    </div>

                    {/* Price Range */}
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        Starting Price
                      </p>
                      <p className="text-white font-semibold text-lg">
                        LKR {getLowestPrice(hotel.room_types)?.toLocaleString()}
                        <span className="text-white/70 text-sm font-normal ml-1">
                          per night
                        </span>
                      </p>
                    </div>

                    {/* Room Types */}
                    {hotel.room_types && hotel.room_types.length > 0 && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          Room Types
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {hotel.room_types.slice(0, 3).map((room, index) => (
                            <span
                              key={index}
                              className="bg-purple-500/20 text-purple-200 px-2 py-1 rounded-lg text-xs font-medium"
                            >
                              {room.name}
                            </span>
                          ))}
                          {hotel.room_types.length > 3 && (
                            <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs">
                              +{hotel.room_types.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Amenities */}
                    <div className="flex items-center gap-2">
                      {hotel.parking_available && (
                        <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                          <svg
                            className="w-3 h-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Parking
                        </span>
                      )}
                      <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-lg text-xs font-medium">
                        {hotel.room_types?.length || 0} Room Types
                      </span>
                    </div>
                  </div>

                  {/* Actions - Only View Details Button */}
                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={() => navigate(`/admin/hotel/${hotel.hotel_id}`)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      View Hotel Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white/80 text-sm">
                  Showing {indexOfFirstHotel + 1} to{" "}
                  {Math.min(indexOfLastHotel, sortedHotels.length)} of{" "}
                  {sortedHotels.length} hotels
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + Math.max(1, currentPage - 2);
                    if (page > totalPages) return null;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                          currentPage === page
                            ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
