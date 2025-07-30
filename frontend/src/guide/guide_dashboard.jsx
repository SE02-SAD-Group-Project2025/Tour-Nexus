import React from 'react';
import { 
    Globe, Bell, User, Settings, LogOut, Search, Calendar, MapPin, 
    Users, Award, Clock, Star, ArrowRight, Menu, X, ChevronDown,
    DollarSign, TrendingUp, Activity, CheckCircle, XCircle, 
    MessageCircle, Eye, Edit, Plus, Filter, BarChart3, Briefcase,
    Languages, Camera, FileText, Phone, Mail, AlertCircle,
    Navigation, Sparkles, Shield, Heart, BookOpen, Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Animated Counter Component
const AnimatedCounter = ({ value, suffix = '', prefix = '' }) => {
    const displayValue = typeof value === 'string' ? value : (value || 0);
    return <span>{prefix}{displayValue}{suffix}</span>;
};

// Enhanced Stat Card Component
// eslint-disable-next-line no-unused-vars
const StatCard = ({ title, value, change, icon: Icon, gradient }) => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300 group">
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
            <AnimatedCounter value={value} />
        </h3>
        <p className="text-gray-600 text-sm mb-2">{title}</p>
        {change && (
            <p className="text-xs text-green-600 font-medium">{change}</p>
        )}
    </div>
);

// Action Card Component
// eslint-disable-next-line no-unused-vars  
const ActionCard = ({ title, description, icon: Icon, gradient, onClick, badge }) => (
    <button
        onClick={onClick}
        className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 group relative text-left w-full"
    >
        {badge && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {badge}
            </div>
        )}
        <div className={`w-16 h-16 bg-gradient-to-r ${gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-gray-600 group-hover:text-emerald-600 transition-colors duration-300">
            <span className="text-sm font-medium">Manage</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
    </button>
);

// Tour Card Component
const TourCard = ({ tour }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700';
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Completed': return 'bg-blue-100 text-blue-700';
            case 'Cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Confirmed': return CheckCircle;
            case 'Pending': return Clock;
            case 'Completed': return Award;
            case 'Cancelled': return XCircle;
            default: return AlertCircle;
        }
    };

    const StatusIcon = getStatusIcon(tour.status);

    return (
        <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start space-x-4">
                <img
                    src={tour.tourist_image || `https://ui-avatars.com/api/?name=${tour.tourist_name}&background=10b981&color=fff`}
                    alt={tour.tourist_name}
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{tour.title}</h3>
                        <span className="text-emerald-600 font-semibold">{tour.amount}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{tour.tourist_name} • {tour.tourist_country}</p>
                    <p className="text-gray-600 text-sm mb-1">{tour.location} • {tour.group_size} people</p>
                    <p className="text-gray-500 text-xs mb-2">{tour.date}</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tour.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {tour.status}
                    </span>
                </div>
            </div>
        </div>
    );
};

// Tour Request Card Component
const TourRequestCard = ({ request, onAccept, onReject }) => (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start space-x-4">
            <img
                src={request.tourist_image || `https://ui-avatars.com/api/?name=${request.tourist_name}&background=10b981&color=fff`}
                alt={request.tourist_name}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{request.tourist_name}</h3>
                    <span className="text-emerald-600 font-semibold">{request.budget}</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{request.tourist_country} • {request.duration} • {request.group_size} people</p>
                <p className="text-gray-700 text-sm mb-3">{request.message}</p>
                <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                        {request.interests?.map((interest, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                                {interest}
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => onReject(request.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-lg hover:bg-red-200 transition-colors duration-200"
                        >
                            Decline
                        </button>
                        <button
                            onClick={() => onAccept(request.id)}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm rounded-lg hover:bg-emerald-200 transition-colors duration-200"
                        >
                            Accept
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Review Card Component
const ReviewCard = ({ review }) => (
    <div className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-start space-x-4">
            <img
                src={review.tourist_image || `https://ui-avatars.com/api/?name=${review.tourist_name}&background=10b981&color=fff`}
                alt={review.tourist_name}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{review.tourist_name}</h3>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                }`}
                            />
                        ))}
                    </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{review.comment}</p>
                <p className="text-gray-500 text-xs">{review.tour_date}</p>
            </div>
        </div>
    </div>
);

// Main Guide Dashboard Component
export default function GuideDashboard({ 
    user = {},
    stats = {},
    upcomingTours = [], 
    tourRequests = [], 
    recentReviews = [], 
    notifications = [],
    guide = {},
    onAcceptRequest,
    onRejectRequest,
    onProfileToggle,
    onNotificationToggle,
    onLogout,
    profileDropdownOpen = false,
    notificationDropdownOpen = false
}) {
    // Extract data with fallbacks
    const dashboardStats = [
        { 
            title: 'Active Tours', 
            value: stats.activeTours || 0, 
            icon: Briefcase, 
            gradient: 'from-teal-500 to-emerald-500', 
            change: stats.activeTourChange 
        },
        { 
            title: 'Monthly Earnings', 
            value: stats.monthlyEarnings || '$0', 
            icon: DollarSign, 
            gradient: 'from-emerald-500 to-sky-500', 
            change: stats.earningsChange 
        },
        { 
            title: 'Average Rating', 
            value: stats.averageRating || '0.0', 
            icon: Star, 
            gradient: 'from-sky-500 to-purple-500', 
            change: stats.ratingChange 
        },
        { 
            title: 'Total Tours', 
            value: stats.totalTours || 0, 
            icon: Navigation, 
            gradient: 'from-purple-500 to-pink-500', 
            change: stats.totalToursChange 
        }
    ];

    const quickActions = [
        { 
            title: 'Start as Guide', 
            icon: Award, 
            gradient: 'from-teal-500 to-emerald-500', 
            description: 'Begin your guiding journey',
            onClick: () => alert('Navigate to Start Guide Process')
        },
        { 
            title: 'Tour Requests', 
            icon: Users, 
            gradient: 'from-emerald-500 to-sky-500', 
            description: 'Review new bookings', 
            badge: tourRequests.length > 0 ? tourRequests.length.toString() : null,
            onClick: () => alert('Navigate to Tour Requests')
        },
        { 
            title: 'Update Profile', 
            icon: User, 
            gradient: 'from-sky-500 to-purple-500', 
            description: 'Edit your information',
            onClick: () => alert('Navigate to Profile Update')
        },
        { 
            title: 'Live Chat', 
            icon: MessageCircle, 
            gradient: 'from-purple-500 to-pink-500', 
            description: 'Chat with tourists',
            onClick: () => alert('Navigate to Live Chat')
        }
    ];

    const guideProfile = {
        name: user?.name || 'Guide',
        experience_years: guide?.experience_years || 0,
        languages: guide?.languages || [],
        specializations: guide?.specializations || [],
        rating: guide?.rating || 0,
        total_reviews: guide?.total_reviews || 0,
        total_tours: guide?.total_tours || 0,
        bio: guide?.bio || ''
    };

    const handleNavigation = (path) => {
        console.log(`Navigating to: ${path}`);
        // Replace with your navigation logic
    };

    const handleAcceptRequest = (requestId) => {
        console.log(`Accepting request: ${requestId}`);
        if (onAcceptRequest) {
            onAcceptRequest(requestId);
        }
    };

    const handleRejectRequest = (requestId) => {
        console.log(`Rejecting request: ${requestId}`);
        if (onRejectRequest) {
            onRejectRequest(requestId);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200/30 to-sky-200/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-200/40 to-pink-200/40 rounded-full blur-2xl bottom-20 right-10 animate-pulse delay-700"></div>
            </div>

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center space-x-4">
                            <button onClick={() => handleNavigation('/')} className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-sky-500 rounded-xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                    TourNexus
                                </span>
                            </button>
                        </div>

                        {/* Center - Guide Status */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center px-4 py-2 bg-emerald-100 rounded-xl">
                                <Award className="w-5 h-5 mr-2 text-emerald-600" />
                                <span className="text-emerald-700 font-medium">Tour Guide</span>
                            </div>
                            <div className="flex items-center px-4 py-2 bg-yellow-100 rounded-xl">
                                <Star className="w-5 h-5 mr-2 text-yellow-600" />
                                <span className="text-yellow-700 font-medium">{guideProfile.rating} Rating</span>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={onNotificationToggle}
                                    className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                                >
                                    <Bell className="w-6 h-6" />
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                                    )}
                                </button>
                                
                                {notificationDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                                        <div className="p-4 border-b border-gray-100">
                                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length > 0 ? (
                                                notifications.map((notification) => (
                                                    <div key={notification.id} className={`p-4 hover:bg-gray-50 border-b border-gray-50 ${!notification.read ? 'bg-emerald-50' : ''}`}>
                                                        <p className="text-sm text-gray-900">{notification.message}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-8 text-center text-gray-500">
                                                    <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                    <p>No notifications</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={onProfileToggle}
                                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                                >
                                    <img
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Guide'}&background=10b981&color=fff`}
                                        alt={user?.name || 'Guide'}
                                        className="w-8 h-8 rounded-lg object-cover"
                                    />
                                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'Guide'}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50">
                                        <div className="p-2">
                                            <button 
                                                onClick={() => handleNavigation('/profile')} 
                                                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                                            >
                                                <User className="w-4 h-4 mr-3" />
                                                Profile
                                            </button>
                                            <button 
                                                onClick={() => handleNavigation('/settings')} 
                                                className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                                            >
                                                <Settings className="w-4 h-4 mr-3" />
                                                Settings
                                            </button>
                                            <button
                                                onClick={onLogout}
                                                className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                                            >
                                                <LogOut className="w-4 h-4 mr-3" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="pt-16 p-6 relative">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-emerald-500 via-sky-500 to-purple-500 rounded-3xl p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Guide'}! 🌟</h1>
                            <p className="text-white/90 mb-6">Ready to share Sri Lanka's wonders with new travelers?</p>
                            <div className="flex flex-wrap gap-4">
                                {/* <button 
                                    onClick={() => handleNavigation('/tour-requests')} 
                                    className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center"
                                >
                                    <Users className="w-5 h-5 mr-2" />
                                    View Requests ({tourRequests.length})
                                </button> */}
                                <button 
                                    // onClick={() => handleNavigation('/guide/addguide')} 
                                    className="bg-white text-emerald-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center"
                                >
                                    <User className="w-5 h-5 mr-2" />
                                    <Link to="/guide/addguide" className="text-emerald-600">
                                    Start As Guide
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {dashboardStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Guide Management - Updated Quick Actions */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Guide Management</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {quickActions.map((action, index) => (
                            <ActionCard key={index} {...action} />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Upcoming Tours */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Upcoming Tours</h2>
                            <button 
                                onClick={() => handleNavigation('/tours')} 
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {upcomingTours.length > 0 ? (
                                upcomingTours.map((tour) => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h4 className="text-lg font-semibold text-gray-500 mb-2">No Upcoming Tours</h4>
                                    <p className="text-gray-400">Your scheduled tours will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tour Requests */}
                    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">New Tour Requests</h2>
                            <button 
                                onClick={() => handleNavigation('/tour-requests')} 
                                className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {tourRequests.length > 0 ? (
                                tourRequests.map((request) => (
                                    <TourRequestCard 
                                        key={request.id} 
                                        request={request}
                                        onAccept={handleAcceptRequest}
                                        onReject={handleRejectRequest}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                    <h4 className="text-lg font-semibold text-gray-500 mb-2">No Pending Requests</h4>
                                    <p className="text-gray-400">New tour requests will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Reviews</h2>
                        <button 
                            onClick={() => handleNavigation('/reviews')} 
                            className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                        >
                            View All
                            <ArrowRight className="w-4 h-4 ml-1" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recentReviews.length > 0 ? (
                            recentReviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-12">
                                <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h4 className="text-lg font-semibold text-gray-500 mb-2">No Reviews Yet</h4>
                                <p className="text-gray-400">Customer reviews will appear here after tours</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style jsx>{`
                .backdrop-blur-md {
                    backdrop-filter: blur(8px);
                }
                .backdrop-blur-xl {
                    backdrop-filter: blur(16px);
                }
            `}</style>
        </div>
    );
}