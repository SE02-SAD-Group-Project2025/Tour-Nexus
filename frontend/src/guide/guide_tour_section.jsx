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
    const numericAmount = Number.parseFloat(amount || 0);
    return `LKR ${numericAmount.toLocaleString("en-LK")}`;
  };

  // Loading component
  const LoadingState = () => (
    <div className="booking-state">
      <div className="booking-state__spinner"></div>
      <span className="booking-state__text">Loading bookings...</span>
    </div>
  );

  // Error component
  const ErrorState = () => (
    <div className="booking-state booking-state--error">
      <AlertCircle className="booking-state__icon" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Unable to Load Bookings
      </h3>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={fetchGuideBookings}
        className="booking-btn booking-btn--primary"
      >
        Try Again
      </button>
    </div>
  );

  // Booking detail modal
  const BookingDetailModal = ({ booking, onClose }) => (
    <div className="booking-modal-overlay">
      <div className="booking-modal">
        <div className="booking-modal__header">
          <div>
            <div className="booking-modal__eyebrow">Booking details</div>
            <h2 className="booking-modal__title">
              Reference #{booking.guide_booking_id}
            </h2>
            <div className="booking-modal__meta">
              {getStatusBadge(booking.booking_status)}
              <span className="booking-modal__chip">
                Guests: {booking.no_of_guests_count}
              </span>
              <span className="booking-modal__chip">
                {formatDate(booking.check_in_date)} -{" "}
                {formatDate(booking.check_out_date)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="booking-modal__close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="booking-modal__body">
          <section className="booking-modal__section">
            <h3 className="booking-modal__section-title">
              <User className="w-4 h-4" />
              Tourist information
            </h3>
            <div className="booking-modal__grid">
              <div>
                <label>Name</label>
                <p>{booking.tourist_info?.fullname || "N/A"}</p>
              </div>
              <div>
                <label>Phone</label>
                <p>{booking.tourist_info?.phone || "N/A"}</p>
              </div>
              <div>
                <label>Email</label>
                <p>{booking.email}</p>
              </div>
              <div>
                <label>Nationality</label>
                <p>{booking.nationality}</p>
              </div>
            </div>
          </section>

          <section className="booking-modal__section">
            <h3 className="booking-modal__section-title">
              <Calendar className="w-4 h-4" />
              Booking details
            </h3>
            <div className="booking-modal__grid">
              <div>
                <label>Check-in date</label>
                <p>{formatDate(booking.check_in_date)}</p>
              </div>
              <div>
                <label>Check-out date</label>
                <p>{formatDate(booking.check_out_date)}</p>
              </div>
              <div>
                <label>Duration</label>
                <p>{booking.days_count} days</p>
              </div>
              <div>
                <label>Guests</label>
                <p>{booking.no_of_guests_count} guests</p>
              </div>
              <div>
                <label>Daily rate</label>
                <p>{formatCurrency(booking.price_per_day)}</p>
              </div>
              <div>
                <label>Total amount</label>
                <p className="booking-modal__total">
                  {formatCurrency(booking.total_amount)}
                </p>
              </div>
            </div>
          </section>

          <section className="booking-modal__section booking-modal__section--inline">
            <div>
              <h3 className="booking-modal__section-title">
                <Phone className="w-4 h-4" />
                Emergency contact
              </h3>
              <p>{booking.emergency_contact}</p>
            </div>
            {booking.special_requests && (
              <div>
                <h3 className="booking-modal__section-title">
                  Special requests
                </h3>
                <p>{booking.special_requests}</p>
              </div>
            )}
          </section>

          {booking.booking_status === "cancelled" &&
            booking.rejection_reason && (
              <section className="booking-modal__section booking-modal__section--alert">
                <h3 className="booking-modal__section-title">
                  Rejection reason
                </h3>
                <p>{booking.rejection_reason}</p>
              </section>
            )}
        </div>

        <div className="booking-modal__footer">
          <button className="booking-btn booking-btn--ghost" onClick={onClose}>
            Close
          </button>
          {booking.booking_status === "requested" && (
            <div className="booking-modal__actions">
              <button
                onClick={() => handleAcceptBooking(booking.guide_booking_id)}
                className="booking-btn booking-btn--success"
              >
                <Check className="w-4 h-4 mr-1" />
                Accept booking
              </button>
              <button
                onClick={() => handleRejectBooking(booking.guide_booking_id)}
                className="booking-btn booking-btn--danger"
              >
                <X className="w-4 h-4 mr-1" />
                Reject booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="guide-bookings space-y-6">
      {/* Header with Stats */}
      <div className="booking-panel booking-panel--header">
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
            className="booking-btn booking-btn--primary disabled:opacity-50 flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="booking-stat booking-stat--total">
            <div className="booking-stat__value">{stats.total}</div>
            <div className="booking-stat__label">Total Bookings</div>
          </div>
          <div className="booking-stat booking-stat--pending">
            <div className="booking-stat__value">{stats.requested}</div>
            <div className="booking-stat__label">Pending</div>
          </div>
          <div className="booking-stat booking-stat--confirmed">
            <div className="booking-stat__value">{stats.confirmed}</div>
            <div className="booking-stat__label">Confirmed</div>
          </div>
          <div className="booking-stat booking-stat--completed">
            <div className="booking-stat__value">{stats.completed}</div>
            <div className="booking-stat__label">Completed</div>
          </div>
          <div className="booking-stat booking-stat--cancelled">
            <div className="booking-stat__value">{stats.cancelled}</div>
            <div className="booking-stat__label">Cancelled</div>
          </div>
          <div className="booking-stat booking-stat--revenue">
            <div className="booking-stat__value">
              {formatCurrency(stats.totalRevenue)}
            </div>
            <div className="booking-stat__label">Revenue</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="booking-panel booking-panel--filters">
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
              className="booking-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="booking-select"
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
              className="booking-select"
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
      <div className="booking-panel booking-panel--list">
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
                    className="booking-row"
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
                            className="booking-btn booking-btn--ghost flex items-center text-sm"
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
                                className="booking-btn booking-btn--success flex items-center text-sm"
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleRejectBooking(booking.guide_booking_id)
                                }
                                className="booking-btn booking-btn--danger flex items-center text-sm"
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
                              className="booking-btn booking-btn--info flex items-center text-sm"
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

      <style jsx>{`
        :root {
          --panel: rgba(255, 255, 255, 0.92);
          --panel-border: rgba(15, 23, 42, 0.08);
          --ink: #1f2937;
          --muted: #5b6472;
          --brand: #0f766e;
          --accent: #d97706;
          --danger: #b42318;
          --shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          --shadow-soft: 0 8px 20px rgba(15, 23, 42, 0.08);
          --ring: 0 0 0 4px rgba(15, 118, 110, 0.15);
        }

        .guide-bookings {
          color: var(--ink);
        }

        .booking-panel {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 18px;
          box-shadow: var(--shadow-soft);
          padding: 24px;
        }

        .booking-panel--list {
          padding: 0;
          overflow: hidden;
        }

        .booking-stat {
          border: 1px solid var(--panel-border);
          border-radius: 14px;
          padding: 14px;
          background: #fff;
        }

        .booking-stat__value {
          font-size: 22px;
          font-weight: 700;
          color: var(--brand);
        }

        .booking-stat__label {
          font-size: 12px;
          color: var(--muted);
          margin-top: 6px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .booking-stat--pending .booking-stat__value {
          color: #b45309;
        }

        .booking-stat--confirmed .booking-stat__value {
          color: #15803d;
        }

        .booking-stat--completed .booking-stat__value {
          color: #7c3aed;
        }

        .booking-stat--cancelled .booking-stat__value {
          color: var(--danger);
        }

        .booking-stat--revenue .booking-stat__value {
          color: var(--accent);
        }

        .booking-input,
        .booking-select {
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid var(--panel-border);
          background: #fff;
          color: var(--ink);
        }

        .booking-input:focus,
        .booking-select:focus {
          outline: none;
          box-shadow: var(--ring);
          border-color: rgba(15, 118, 110, 0.4);
        }

        .booking-btn {
          border-radius: 10px;
          padding: 10px 14px;
          font-weight: 600;
          border: 1px solid transparent;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .booking-btn:hover {
          transform: translateY(-1px);
          box-shadow: var(--shadow-soft);
        }

        .booking-btn--primary {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
        }

        .booking-btn--ghost {
          background: #fff;
          color: var(--muted);
          border-color: var(--panel-border);
        }

        .booking-btn--success {
          background: #16a34a;
          color: #fff;
        }

        .booking-btn--danger {
          background: #dc2626;
          color: #fff;
        }

        .booking-btn--info {
          background: #2563eb;
          color: #fff;
        }

        .booking-row {
          padding: 22px 24px;
          transition: background 0.2s ease;
        }

        .booking-row:hover {
          background: rgba(15, 118, 110, 0.05);
        }

        .booking-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          text-align: center;
          gap: 10px;
        }

        .booking-state__spinner {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid rgba(15, 118, 110, 0.2);
          border-top-color: var(--brand);
          animation: spin 0.9s linear infinite;
        }

        .booking-state__text {
          color: var(--muted);
        }

        .booking-state__icon {
          width: 42px;
          height: 42px;
          color: var(--danger);
        }

        .booking-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 1000;
          backdrop-filter: blur(6px);
        }

        .booking-modal {
          width: min(900px, 100%);
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 22px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .booking-modal__header {
          padding: 24px 26px 18px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          border-bottom: 1px solid var(--panel-border);
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.12),
            rgba(217, 119, 6, 0.08)
          );
        }

        .booking-modal__eyebrow {
          font-size: 12px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--muted);
          font-weight: 700;
          margin-bottom: 6px;
        }

        .booking-modal__title {
          font-size: 22px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 12px;
        }

        .booking-modal__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .booking-modal__chip {
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: var(--muted);
          font-size: 12px;
          font-weight: 600;
        }

        .booking-modal__close {
          border: none;
          background: #fff;
          border-radius: 10px;
          padding: 8px;
          color: var(--muted);
          cursor: pointer;
          box-shadow: var(--shadow-soft);
        }

        .booking-modal__body {
          padding: 22px 26px;
          display: grid;
          gap: 18px;
        }

        .booking-modal__section {
          background: #fff;
          border-radius: 16px;
          border: 1px solid var(--panel-border);
          padding: 16px 18px;
        }

        .booking-modal__section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 700;
          color: var(--ink);
          margin-bottom: 12px;
        }

        .booking-modal__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
        }

        .booking-modal__grid label {
          display: block;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--muted);
          margin-bottom: 6px;
          font-weight: 600;
        }

        .booking-modal__grid p {
          color: var(--ink);
          font-weight: 600;
        }

        .booking-modal__total {
          color: var(--brand);
          font-weight: 700;
        }

        .booking-modal__section--inline {
          display: grid;
          gap: 16px;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .booking-modal__section--alert {
          border-color: rgba(244, 63, 94, 0.2);
          background: rgba(244, 63, 94, 0.08);
          color: var(--danger);
        }

        .booking-modal__footer {
          padding: 18px 26px 24px;
          border-top: 1px solid var(--panel-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          background: #fff;
        }

        .booking-modal__actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (max-width: 700px) {
          .booking-modal__header {
            flex-direction: column;
            align-items: flex-start;
          }

          .booking-modal__footer {
            flex-direction: column-reverse;
            align-items: stretch;
          }

          .booking-modal__actions {
            width: 100%;
          }

          .booking-modal__actions .booking-btn {
            flex: 1 1 auto;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default EnhancedGuideTours;
