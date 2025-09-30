import { useState, useEffect } from "react";
import {
  Navigation,
  Activity,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Star,
  ChevronDown,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Phone,
  Mail,
  Eye,
  Filter,
  RefreshCw,
  Check,
  X,
  User,
  Globe,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

function EnhancedGuideTours() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const userEmail = localStorage.getItem("email");

  // Fetch guide's bookings from API
  const fetchGuideBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // First get guide ID by email
      const guideResponse = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/guide/view_guides_by_email/${userEmail}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!guideResponse.data.success || guideResponse.data.data.length === 0) {
        setError("Guide profile not found");
        return;
      }

      const guideId = guideResponse.data.data[0].guide_id;

      // Fetch bookings for this guide
      const bookingsResponse = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/guidebookings/guide/${guideId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (bookingsResponse.data.success) {
        setBookings(bookingsResponse.data.data);
        setFilteredBookings(bookingsResponse.data.data);
        toast.success(`Loaded ${bookingsResponse.data.data.length} booking(s)`);
      } else {
        setError(bookingsResponse.data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      let errorMessage = "Failed to fetch bookings";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Update booking status (accept/reject)
  const updateBookingStatus = async (
    bookingId,
    status,
    rejectionReason = ""
  ) => {
    try {
      const payload = {
        booking_status: status,
        ...(status === "cancelled" &&
          rejectionReason && { rejection_reason: rejectionReason }),
      };

      const response = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/guidebookings/booking/${bookingId}/status`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(
          `Booking ${
            status === "confirmed" ? "accepted" : "rejected"
          } successfully`
        );
        fetchGuideBookings(); // Refresh the list
        setShowBookingDetails(false);
      } else {
        toast.error(response.data.message || "Failed to update booking");
      }
    } catch (error) {
      console.error("Error updating booking:", error);
      toast.error(
        error.response?.data?.message || "Failed to update booking status"
      );
    }
  };

  // Filter bookings based on status, date, and search
  useEffect(() => {
    let filtered = [...bookings];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.booking_status === statusFilter
      );
    }

    // Filter by date
    const currentDate = new Date();
    if (dateFilter === "upcoming") {
      filtered = filtered.filter(
        (booking) => new Date(booking.check_in_date) >= currentDate
      );
    } else if (dateFilter === "past") {
      filtered = filtered.filter(
        (booking) => new Date(booking.check_out_date) < currentDate
      );
    } else if (dateFilter === "current") {
      filtered = filtered.filter(
        (booking) =>
          new Date(booking.check_in_date) <= currentDate &&
          new Date(booking.check_out_date) >= currentDate
      );
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.guide_booking_id
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.tourist_info?.fullname
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.nationality.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBookings(filtered);
  }, [bookings, statusFilter, dateFilter, searchTerm]);

  useEffect(() => {
    if (userEmail) {
      fetchGuideBookings();
    }
  }, [userEmail]);

  // Handle accept booking
  const handleAcceptBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to accept this booking?")) {
      updateBookingStatus(bookingId, "confirmed");
    }
  };

  // Handle reject booking
  const handleRejectBooking = (bookingId) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    if (reason !== null) {
      // User didn't cancel
      updateBookingStatus(bookingId, "cancelled", reason);
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const statusConfig = {
      requested: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: Clock,
      },
      confirmed: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: CheckCircle,
      },
      cancelled: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: XCircle,
      },
      completed: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: Star,
      },
    };

    const config = statusConfig[status] || statusConfig.requested;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config.color}`}
      >
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = {
      total: bookings.length,
      requested: bookings.filter((b) => b.booking_status === "requested")
        .length,
      confirmed: bookings.filter((b) => b.booking_status === "confirmed")
        .length,
      cancelled: bookings.filter((b) => b.booking_status === "cancelled")
        .length,
      completed: bookings.filter((b) => b.booking_status === "completed")
        .length,
      totalRevenue: bookings
        .filter((b) => ["confirmed", "completed"].includes(b.booking_status))
        .reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0),
    };
    return stats;
  };

  const stats = calculateStats();

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${parseFloat(amount || 0).toFixed(2)}`;
  };

  // Loading component
  const LoadingState = () => (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <span className="ml-3 text-gray-600">Loading bookings...</span>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="text-center py-12">
      <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unable to Load Bookings
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={fetchGuideBookings}
        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );

  // Booking detail modal
  const BookingDetailModal = ({ booking, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Booking Details
              </h2>
              <p className="text-sm text-gray-600">
                #{booking.guide_booking_id}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Actions */}
          <div className="flex justify-between items-center">
            {getStatusBadge(booking.booking_status)}
            {booking.booking_status === "requested" && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleAcceptBooking(booking.guide_booking_id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Accept
                </button>
                <button
                  onClick={() => handleRejectBooking(booking.guide_booking_id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* Tourist Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Tourist Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-gray-900">
                  {booking.tourist_info?.fullname || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Phone
                </label>
                <p className="text-gray-900">
                  {booking.tourist_info?.phone || "N/A"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email
                </label>
                <p className="text-gray-900">{booking.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nationality
                </label>
                <p className="text-gray-900">{booking.nationality}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Booking Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Check-in Date
                </label>
                <p className="text-gray-900">
                  {formatDate(booking.check_in_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Check-out Date
                </label>
                <p className="text-gray-900">
                  {formatDate(booking.check_out_date)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Duration
                </label>
                <p className="text-gray-900">{booking.days_count} days</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Number of Guests
                </label>
                <p className="text-gray-900">
                  {booking.no_of_guests_count} guests
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Daily Rate
                </label>
                <p className="text-gray-900">
                  {formatCurrency(booking.price_per_day)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Total Amount
                </label>
                <p className="text-gray-900 font-semibold">
                  {formatCurrency(booking.total_amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              Emergency Contact
            </h3>
            <p className="text-gray-900">{booking.emergency_contact}</p>
          </div>

          {/* Special Requests */}
          {booking.special_requests && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">
                Special Requests
              </h3>
              <p className="text-gray-900">{booking.special_requests}</p>
            </div>
          )}

          {/* Rejection Reason */}
          {booking.booking_status === "cancelled" &&
            booking.rejection_reason && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-900 mb-3">
                  Rejection Reason
                </h3>
                <p className="text-red-800">{booking.rejection_reason}</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tour Bookings</h1>
            <p className="text-gray-600">
              Manage your tour booking requests and confirmed tours
            </p>
          </div>
          <button
            onClick={fetchGuideBookings}
            disabled={isLoading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-700">Total Bookings</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.requested}
            </div>
            <div className="text-sm text-yellow-700">Pending</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </div>
            <div className="text-sm text-green-700">Confirmed</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.completed}
            </div>
            <div className="text-sm text-purple-700">Completed</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-red-700">Cancelled</div>
          </div>
          <div className="bg-emerald-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="text-sm text-emerald-700">Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by booking ID, tourist name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="requested">Pending Requests</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Filter
            </label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming Tours</option>
              <option value="current">Current Tours</option>
              <option value="past">Past Tours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bg-white rounded-xl shadow-sm">
        {isLoading && <LoadingState />}
        {error && !isLoading && <ErrorState />}

        {!isLoading && !error && (
          <div className="overflow-hidden">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Navigation className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-600">
                  {statusFilter !== "all" || dateFilter !== "all" || searchTerm
                    ? "Try adjusting your filters"
                    : "Your tour bookings will appear here"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.guide_booking_id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            #{booking.guide_booking_id}
                          </h3>
                          {getStatusBadge(booking.booking_status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span>
                              {booking.tourist_info?.fullname ||
                                "Unknown Tourist"}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Globe className="w-4 h-4 mr-2" />
                            <span>{booking.nationality}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            <span>{booking.no_of_guests_count} guests</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                              {formatDate(booking.check_in_date)} -{" "}
                              {formatDate(booking.check_out_date)}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="w-4 h-4 mr-2" />
                            <span>{booking.days_count} days</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="font-semibold">
                              {formatCurrency(booking.total_amount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowBookingDetails(true);
                            }}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors flex items-center text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </button>

                          {booking.booking_status === "requested" && (
                            <>
                              <button
                                onClick={() =>
                                  handleAcceptBooking(booking.guide_booking_id)
                                }
                                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectBooking(booking.guide_booking_id)
                                }
                                className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center text-sm"
                              >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                              </button>
                            </>
                          )}

                          {booking.booking_status === "confirmed" && (
                            <button
                              onClick={() =>
                                window.open(`mailto:${booking.email}`, "_blank")
                              }
                              className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              Contact Tourist
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {showBookingDetails && selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => {
            setShowBookingDetails(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}

export default EnhancedGuideTours;
