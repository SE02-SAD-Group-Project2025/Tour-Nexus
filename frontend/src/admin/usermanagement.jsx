import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, UserCheck, UserX, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = ({ onBack }) => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    // API Functions
    const fetchAllUsers = async () => {
        try {
            // Change the port to match your backend server port
            const response = await fetch('http://localhost:3000/api/user/view-all-users', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    };

    const toggleUserBlockStatus = async (email, isBlocked) => {
        try {
            // Change the port to match your backend server port
            const response = await fetch(`http://localhost:3000/api/user/update/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // Add authorization header if needed
                    // 'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isblocked: !isBlocked })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating user status:', error);
            throw error;
        }
    };

    // Fetch users on component mount
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
            setError('Failed to load users. Please check your API endpoint.');
            console.error('Load users error:', err);
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
            setError('Failed to update user status');
            console.error('Toggle block error:', err);
        }
    };

    // Filter users based on search and filters
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === '' || user.role === selectedRole;
        const matchesStatus = selectedStatus === '' || 
                             (selectedStatus === 'active' && !user.isblocked) ||
                             (selectedStatus === 'blocked' && user.isblocked);
        
        return matchesSearch && matchesRole && matchesStatus;
    });

    const getRoleColor = (role) => {
        switch (role) {
            case 'Tourist':
                return 'bg-blue-100 text-blue-800';
            case 'Guide':
                return 'bg-green-100 text-green-800';
            case 'Hotel Owner':
                return 'bg-purple-100 text-purple-800';
            case 'Vehicle Rental':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (isBlocked) => {
        return isBlocked 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800';
    };

    const getStatusText = (isBlocked) => {
        return isBlocked ? 'Blocked' : 'Active';
    };

    // Get unique roles for filter dropdown
    const uniqueRoles = [...new Set(users.map(user => user.role))];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-lg text-gray-600">Loading users...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="text-lg text-red-600 mb-4">{error}</div>
                        <button 
                            onClick={loadUsers}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                // onClick={onBack}
                                onClick={() => navigate('/admin/dashboard')}
                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span>Back</span>
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                                <p className="text-gray-600 mt-1">Manage all platform users</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Users</p>
                                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <UserCheck className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Active Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(user => !user.isblocked).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <UserX className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Blocked Users</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {users.filter(user => user.isblocked).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Filter className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">User Roles</p>
                                <p className="text-2xl font-bold text-gray-900">{uniqueRoles.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="sm:w-48">
                            <select 
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Roles</option>
                                <option value="Tourist">Tourist</option>
                                <option value="Guide">Guide</option>
                                <option value="Hotel Owner">Hotel Owner</option>
                                <option value="Vehicle Rental">Vehicle Rental</option>
                            </select>
                        </div>
                        <div className="sm:w-32">
                            <select 
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="blocked">Blocked</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">
                            All Users ({filteredUsers.length})
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                                    <span className="text-white font-medium text-sm">
                                                        {user.fullname.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {user.fullname}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.isblocked)}`}>
                                                {getStatusText(user.isblocked)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button 
                                                onClick={() => handleToggleBlock(user.email, user.isblocked)}
                                                className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${
                                                    user.isblocked 
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                } transition-colors duration-200`}
                                            >
                                                {user.isblocked ? (
                                                    <>
                                                        <UserCheck className="w-4 h-4 mr-1" />
                                                        Unblock
                                                    </>
                                                ) : (
                                                    <>
                                                        <UserX className="w-4 h-4 mr-1" />
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
                        <div className="px-6 py-8 text-center">
                            <div className="text-gray-500">No users found matching your criteria.</div>
                        </div>
                    )}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700">
                                Showing {filteredUsers.length} of {users.length} users
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
