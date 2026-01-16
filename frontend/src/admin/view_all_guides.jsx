import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewAllGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("full_name");
  const [currentPage, setCurrentPage] = useState(1);
  const [guidesPerPage] = useState(12);

  const navigate = useNavigate(); // Import useNavigate from react-router-dom
  // Mock navigate function for demonstration

  // Fetch guides from API
  const fetchGuides = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/guide/view_all_guides`,
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
      setGuides(data);
      setLoading(false);
    } catch (err) {
      setError(`Failed to fetch guides: ${err.message}`);
      setLoading(false);
      console.error("Error fetching guides:", err);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  // Filter and search logic
  const filteredGuides = guides.filter((guide) => {
    const matchesSearch =
      guide.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.guide_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.area_cover?.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter =
      filterStatus === "all" || guide.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Sort logic
  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch (sortBy) {
      case "full_name":
        return a.full_name?.localeCompare(b.full_name) || 0;
      case "date":
        return new Date(b.date) - new Date(a.date);
      case "experience":
        return (b.years_of_experience || 0) - (a.years_of_experience || 0);
      case "daily_rate":
        return (a.daily_rate || 0) - (b.daily_rate || 0);
      default:
        return 0;
    }
  });

  // Pagination logic
  const indexOfLastGuide = currentPage * guidesPerPage;
  const indexOfFirstGuide = indexOfLastGuide - guidesPerPage;
  const currentGuides = sortedGuides.slice(indexOfFirstGuide, indexOfLastGuide);
  const totalPages = Math.ceil(sortedGuides.length / guidesPerPage);

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

  // Get stats for display
  const stats = {
    total: guides.length,
    approved: guides.filter((g) => g.status === "approved").length,
    pending: guides.filter((g) => g.status === "pending").length,
    rejected: guides.filter((g) => g.status === "rejected").length,
  };

  if (loading) {
    return (
      <div
        className="min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-white/30 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-white rounded-full animate-spin"></div>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-white">
            Loading Guides...
          </h2>
          <p className="mt-2 text-white/80">
            Please wait while we fetch the guide data
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
            'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
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
            Error Loading Guides
          </h2>
          <p className="text-white/80 mb-6">{error}</p>
          <button
            onClick={fetchGuides}
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
          'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
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
                  View All Guides
                </h1>
                <p className="text-white/80 mt-2">
                  Browse and discover all registered tour guides
                </p>
              </div>
              <button
                // onClick={() => navigate("/admin/dashboard")}
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
                label: "Total Guides",
                value: stats.total,
                color: "from-blue-500 to-indigo-600",
                icon: "👥",
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
                  Search Guides
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name, email, ID..."
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
                  <option value="full_name" className="bg-gray-800">
                    Name
                  </option>
                  <option value="date" className="bg-gray-800">
                    Join Date
                  </option>
                  <option value="experience" className="bg-gray-800">
                    Experience
                  </option>
                  <option value="daily_rate" className="bg-gray-800">
                    Daily Rate
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchGuides}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Refresh Data
                </button>
              </div>
            </div>
          </div>

          {/* Guides Grid */}
          {currentGuides.length === 0 ? (
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
                No Guides Found
              </h3>
              <p className="text-white/70">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
              {currentGuides.map((guide) => (
                <div
                  key={guide._id}
                  className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  {/* Status Badge */}
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white mb-4 ${getStatusColor(
                      guide.status
                    )}`}
                  >
                    {guide.status?.toUpperCase()}
                  </div>

                  {/* Guide Header */}
                  <div className="flex items-center mb-6">
                    <div className="relative">
                      <img
                        src={
                          guide.profile_image ||
                          `https://ui-avatars.com/api/?name=${guide.full_name}&background=667eea&color=fff&size=60`
                        }
                        alt={guide.full_name}
                        className="w-16 h-16 rounded-full object-cover border-3 border-white/30 group-hover:border-white/50 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors duration-300">
                        {guide.full_name}
                      </h3>
                      <p className="text-white/70 text-sm bg-white/10 px-2 py-1 rounded-lg inline-block">
                        {guide.guide_id}
                      </p>
                    </div>
                  </div>

                  {/* Guide Details */}
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Experience
                        </p>
                        <p className="text-white font-semibold">
                          {guide.years_of_experience} years
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider">
                          Daily Rate
                        </p>
                        <p className="text-white font-semibold">
                          LKR {guide.daily_rate?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                        Contact
                      </p>
                      <p className="text-white/90 text-sm">{guide.email}</p>
                      <p className="text-white/90 text-sm">
                        {guide.contact_number}
                      </p>
                    </div>

                    {/* Languages */}
                    {guide.languages && guide.languages.length > 0 && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          Languages
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {guide.languages.slice(0, 3).map((lang, index) => (
                            <span
                              key={index}
                              className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded-lg text-xs font-medium"
                            >
                              {lang}
                            </span>
                          ))}
                          {guide.languages.length > 3 && (
                            <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs">
                              +{guide.languages.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Specialities */}
                    {guide.specialities && guide.specialities.length > 0 && (
                      <div>
                        <p className="text-white/60 text-xs uppercase tracking-wider mb-2">
                          Specialities
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {guide.specialities.slice(0, 2).map((spec, index) => (
                            <span
                              key={index}
                              className="bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded-lg text-xs font-medium"
                            >
                              {spec}
                            </span>
                          ))}
                          {guide.specialities.length > 2 && (
                            <span className="bg-white/10 text-white/70 px-2 py-1 rounded-lg text-xs">
                              +{guide.specialities.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions - Only View Details Button */}
                  <div className="pt-4 border-t border-white/20">
                    <button
                      onClick={() => navigate(`/admin/guide/${guide.guide_id}`)}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 text-sm flex items-center justify-center gap-2"
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
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      View Full Profile
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
                  Showing {indexOfFirstGuide + 1} to{" "}
                  {Math.min(indexOfLastGuide, sortedGuides.length)} of{" "}
                  {sortedGuides.length} guides
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
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
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
