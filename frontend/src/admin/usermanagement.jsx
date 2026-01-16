import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  UserCheck,
  UserX,
  ArrowLeft,
  Shield,
  Sparkles,
  Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserManagement = ({ onBack }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // API Functions - EXACTLY AS YOUR ORIGINAL
  const fetchAllUsers = async () => {
    try {
      // Change the port to match your backend server port
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/view-all-users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  };

  const toggleUserBlockStatus = async (email, isBlocked) => {
    try {
      // Change the port to match your backend server port
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Add authorization header if needed
            // 'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ isblocked: !isBlocked }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  };

  // Fetch users on component mount - EXACTLY AS YOUR ORIGINAL
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await fetchAllUsers();
      setUsers(userData);
    } catch (err) {
      setError("Failed to load users. Please check your API endpoint.");
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (email, currentBlockStatus) => {
    try {
      await toggleUserBlockStatus(email, currentBlockStatus);
      // Reload users to reflect changes
      await loadUsers();
    } catch (err) {
      setError("Failed to update user status");
      console.error("Toggle block error:", err);
    }
  };

  // Filter users based on search and filters - EXACTLY AS YOUR ORIGINAL
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "" ||
      (selectedStatus === "active" && !user.isblocked) ||
      (selectedStatus === "blocked" && user.isblocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Tourist":
        return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
      case "Guide":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "Hotel Owner":
      case "HotelOwner":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "Vehicle":
      case "Vehicle Rental":
        return "bg-gradient-to-r from-orange-500 to-red-500 text-white";
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500 text-white";
    }
  };

  const getStatusColor = (isBlocked) => {
    return isBlocked
      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/25"
      : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25";
  };

  const getStatusText = (isBlocked) => {
    return isBlocked ? "Blocked" : "Active";
  };

  // Get unique roles for filter dropdown - EXACTLY AS YOUR ORIGINAL
  const uniqueRoles = [...new Set(users.map((user) => user.role))];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 animate-pulse"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-6"></div>
              <Sparkles className="w-8 h-8 text-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Loading users...
            </h2>
            <p className="text-white/70">
              Please wait while we fetch the data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Error Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-rose-900 to-pink-900">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{error}</h2>
            <button
              onClick={loadUsers}
              className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-rose-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background with Parallax Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m0 0h100v100h-100z' fill='none'/%3E%3Cpath d='m0 0 100 100m0-100-100 100' stroke='%23334155' stroke-width='0.5' opacity='0.3'/%3E%3C/svg%3E")`,
          }}
        ></div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>

        {/* Subtle particle effect */}
        <div
          className="absolute inset-0 animate-pulse opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header with Glass Effect */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    // onClick={onBack}
                    onClick={() => navigate("/admin/dashboard")}
                    className="bg-white/20 backdrop-blur border border-white/30 rounded-xl px-4 py-2 hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 text-white hover:scale-105 transform"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                      User Management
                    </h1>
                    <p className="text-white/70 mt-1 text-lg">
                      Manage all platform users
                    </p>
                  </div>
                </div>
                <div className="hidden md:flex items-center space-x-2">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <Activity className="w-8 h-8 text-green-400 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {users.length}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg group-hover:shadow-green-500/25 transition-all duration-300">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {users.filter((user) => !user.isblocked).length}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  style={{
                    width: `${
                      users.length > 0
                        ? (users.filter((user) => !user.isblocked).length /
                            users.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg group-hover:shadow-red-500/25 transition-all duration-300">
                  <UserX className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">
                    Blocked Users
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {users.filter((user) => user.isblocked).length}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-500 rounded-full"
                  style={{
                    width: `${
                      users.length > 0
                        ? (users.filter((user) => user.isblocked).length /
                            users.length) *
                          100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                  <Filter className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-white/70">
                    User Roles
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {uniqueRoles.length}
                  </p>
                </div>
              </div>
              <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Enhanced Filters and Search */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50 group-focus-within:text-white transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/30 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/30 transition-all duration-300"
                >
                  <option value="" className="bg-gray-800 text-white">
                    All Roles
                  </option>
                  <option value="Tourist" className="bg-gray-800 text-white">
                    Tourist
                  </option>
                  <option value="Guide" className="bg-gray-800 text-white">
                    Guide
                  </option>
                  <option value="HotelOwner" className="bg-gray-800 text-white">
                    Hotel Owner
                  </option>
                  <option
                    value="Vehicle"
                    className="bg-gray-800 text-white"
                  >
                    Vehicle Rental
                  </option>
                </select>
              </div>
              <div className="sm:w-32">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/30 transition-all duration-300"
                >
                  <option value="" className="bg-gray-800 text-white">
                    All Status
                  </option>
                  <option value="active" className="bg-gray-800 text-white">
                    Active
                  </option>
                  <option value="blocked" className="bg-gray-800 text-white">
                    Blocked
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Enhanced Users Table */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/20">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                All Users ({filteredUsers.length})
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-white/5 transition-all duration-200 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-blue-500/25 transition-all duration-300">
                            <span className="text-white font-bold text-lg">
                              {user.fullname.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">
                              {user.fullname}
                            </div>
                            <div className="text-sm text-white/60">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">
                          {user.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${getRoleColor(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            user.isblocked
                          )}`}
                        >
                          {getStatusText(user.isblocked)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            handleToggleBlock(user.email, user.isblocked)
                          }
                          className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 shadow-lg ${
                            user.isblocked
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 shadow-green-500/25"
                              : "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-red-500/25"
                          }`}
                        >
                          {user.isblocked ? (
                            <>
                              <UserCheck className="w-4 h-4 mr-2" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <UserX className="w-4 h-4 mr-2" />
                              Block
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredUsers.length === 0 && (
              <div className="px-6 py-12 text-center">
                <div className="text-white/70 text-lg">
                  No users found matching your criteria.
                </div>
                <p className="text-white/50 mt-2">
                  Try adjusting your search or filters.
                </p>
              </div>
            )}
            <div className="px-6 py-4 bg-white/5 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {filteredUsers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {users.length}
                  </span>{" "}
                  users
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs text-white/60">
                    Real-time updates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
