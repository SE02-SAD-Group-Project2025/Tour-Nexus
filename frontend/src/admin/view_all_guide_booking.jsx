import { useState, useEffect } from "react";

export default function ViewAllGuideBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [sortBy, setSortBy] = useState("created_at");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(12);
  const [totalBookings, setTotalBookings] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Mock navigate function for demonstration
  const navigate = (path) => {
    alert(`Navigating to: ${path}`);
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: bookingsPerPage,
      });

      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      if (dateRange.start) {
        queryParams.append("startDate", dateRange.start);
      }

      if (dateRange.end) {
        queryParams.append("endDate", dateRange.end);
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/guidebookings/all?${queryParams}`,
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

      const result = await response.json();

      if (result.success) {
        setBookings(result.data || []);
        setTotalBookings(result.pagination?.totalBookings || 0);
        setTotalPages(result.pagination?.totalPages || 0);
      } else {
        // Handle case where no bookings are found
        if (
          result.message === "No bookings found" ||
          result.message.includes("not found")
        ) {
          setBookings([]);
          setTotalBookings(0);
          setTotalPages(0);
        } else {
          throw new Error(result.message || "Failed to fetch bookings");
        }
      }

      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch bookings: ${err.message}`);
      setLoading(false);
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, filterStatus, dateRange]);

  // Filter and search logic (client-side for displayed data)
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.guide_booking_id
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guide_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.guide_info?.full_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Sort logic
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case "created_at":
        return new Date(b.date) - new Date(a.date);
      case "check_in_date":
        return new Date(a.check_in_date) - new Date(b.check_in_date);
      case "guide_name":
        return (a.guide_info?.full_name || "").localeCompare(
          b.guide_info?.full_name || ""
        );
      case "total_amount":
        return (
          parseFloat(b.total_amount || 0) - parseFloat(a.total_amount || 0)
        );
      default:
        return 0;
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-gradient-to-r from-emerald-500 to-green-500";
      case "requested":
        return "bg-gradient-to-r from-amber-500 to-orange-500";
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "completed":
        return "bg-gradient-to-r from-blue-500 to-indigo-500";
      case "rejected":
        return "bg-gradient-to-r from-gray-500 to-slate-500";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  //   const calculateDays = (checkIn, checkOut) => {
  //     const diffTime = new Date(checkOut) - new Date(checkIn);
  //     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  //   };

  // Get stats for display
  const stats = {
    total: totalBookings,
    requested: bookings.filter((b) => b.booking_status === "requested").length,
    confirmed: bookings.filter((b) => b.booking_status === "confirmed").length,
    completed: bookings.filter((b) => b.booking_status === "completed").length,
    cancelled: bookings.filter((b) => b.booking_status === "cancelled").length,
  };

  if (loading) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Loading Guide Bookings...
          </h2>
          <p className="mt-2 text-white/80">
            Please wait while we fetch the booking data
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
            'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
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
            Error Loading Bookings
          </h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={fetchBookings}
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
          'url("https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
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
                  Guide Bookings
                </h1>
                <p className="text-white/80 mt-2">
                  Manage and monitor all guide reservations
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
              {
                label: "Total Bookings",
                value: stats.total,
                color: "from-blue-500 to-indigo-600",
                icon: "🎯",
              },
              {
                label: "Requested",
                value: stats.requested,
                color: "from-amber-500 to-orange-600",
                icon: "⏳",
              },
              {
                label: "Confirmed",
                value: stats.confirmed,
                color: "from-emerald-500 to-green-600",
                icon: "✅",
              },
              {
                label: "Completed",
                value: stats.completed,
                color: "from-blue-500 to-indigo-600",
                icon: "🏁",
              },
              {
                label: "Cancelled",
                value: stats.cancelled,
                color: "from-red-500 to-pink-600",
                icon: "❌",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-xs lg:text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl lg:text-3xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`text-2xl lg:text-3xl bg-gradient-to-r ${stat.color} w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-white shadow-lg`}
                  >
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Controls Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Search Bookings
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by booking ID, email..."
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
                  <option value="requested" className="bg-gray-800">
                    Requested
                  </option>
                  <option value="confirmed" className="bg-gray-800">
                    Confirmed
                  </option>
                  <option value="completed" className="bg-gray-800">
                    Completed
                  </option>
                  <option value="cancelled" className="bg-gray-800">
                    Cancelled
                  </option>
                  {/* <option value="rejected" className="bg-gray-800">
                    Rejected
                  </option> */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, start: e.target.value }))
                  }
                  className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange((prev) => ({ ...prev, end: e.target.value }))
                  }
                  className="w-full py-3 px-4 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
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
                  <option value="created_at" className="bg-gray-800">
                    Booking Date
                  </option>
                  <option value="check_in_date" className="bg-gray-800">
                    Tour Start Date
                  </option>
                  <option value="guide_name" className="bg-gray-800">
                    Guide Name
                  </option>
                  <option value="total_amount" className="bg-gray-800">
                    Total Amount
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchBookings}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Bookings Grid */}
          {sortedBookings.length === 0 ? (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No Guide Bookings Found
              </h3>
              <p className="text-white/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {sortedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-4 ${getStatusColor(
                      booking.booking_status
                    )}`}
                  >
                    {booking.booking_status?.toUpperCase()}
                  </div>

                  {/* Guide Header */}
                  <div className="flex items-center mb-4">
                    <div className="relative">
                      <img
                        src={
                          booking.guide_info?.profile_image ||
                          `https://ui-avatars.com/api/?name=${
                            booking.guide_info?.full_name || "Guide"
                          }&background=667eea&color=fff&size=60`
                        }
                        alt={booking.guide_info?.full_name || "Guide"}
                        className="w-16 h-16 rounded-full object-cover border-3 border-white/30 group-hover:border-white/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                        {booking.guide_info?.full_name ||
                          "Guide Name Not Available"}
                      </h3>
                      <p className="text-white/70 text-sm bg-white/10 px-2 py-1 rounded-lg inline-block">
                        {booking.guide_booking_id}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Tour Start
                        </p>
                        <p className="text-white font-semibold">
                          {formatDate(booking.check_in_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Tour End
                        </p>
                        <p className="text-white font-semibold">
                          {formatDate(booking.check_out_date)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Duration
                        </p>
                        <p className="text-white font-semibold">
                          {booking.days_count} days
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Guests
                        </p>
                        <p className="text-white font-semibold">
                          {booking.no_of_guests_count} guests
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        Tourist Email
                      </p>
                      <p className="text-white/90 text-sm">{booking.email}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Nationality
                        </p>
                        <p className="text-white font-semibold">
                          {booking.nationality}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Emergency Contact
                        </p>
                        <p className="text-white font-semibold text-sm">
                          {booking.emergency_contact}
                        </p>
                      </div>
                    </div>

                    {/* Total Amount */}
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                        Total Amount
                      </p>
                      <p className="text-white font-bold text-xl">
                        LKR{" "}
                        {parseFloat(booking.total_amount || 0).toLocaleString()}
                      </p>
                      <p className="text-white/70 text-xs">
                        LKR{" "}
                        {parseFloat(
                          booking.price_per_day || 0
                        ).toLocaleString()}{" "}
                        per day
                      </p>
                    </div>

                    {/* Special Requests */}
                    {booking.special_request && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          Special Requests
                        </p>
                        <p className="text-white/90 text-sm bg-white/5 p-2 rounded-lg">
                          {booking.special_request}
                        </p>
                      </div>
                    )}

                    {/* Tourist Info */}
                    {booking.tourist_info && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          Tourist Information
                        </p>
                        <div className="bg-white/5 p-2 rounded-lg">
                          <p className="text-white/90 text-sm font-medium">
                            {booking.tourist_info.fullname}
                          </p>
                          <p className="text-white/70 text-xs">
                            {booking.tourist_info.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Booking Date */}
                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-1">
                        Booked On
                      </p>
                      <p className="text-white/90 text-sm">
                        {formatDate(booking.date)}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Only View Details Button */}
                  <div className="pt-4 border-t border-white/20">
                    {/* <button
                      onClick={() =>
                        navigate(
                          `/admin/guide-booking/${booking.guide_booking_id}`
                        )
                      }
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM9 9a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      View Booking Details
                    </button> */}
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
                  Showing {(currentPage - 1) * bookingsPerPage + 1} to{" "}
                  {Math.min(currentPage * bookingsPerPage, totalBookings)} of{" "}
                  {totalBookings} bookings
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
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
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
