import { useState } from 'react';
import { Link } from 'react-router-dom';

import { 
    Globe, Bell, User, Settings, LogOut, Search, Calendar, MapPin, 
    Hotel, DollarSign, TrendingUp, Activity, CheckCircle, XCircle, 
    MessageCircle, Eye, Edit, Plus, Filter, BarChart3, Bed,
    Users, Star, Clock, ArrowRight, Menu, X, ChevronDown,
    Key, Wrench, ClipboardList, PieChart, Phone, Mail, AlertCircle,
    Home, Wifi, Car, Coffee, Utensils, Waves, Dumbbell, Shield,
    Building, Image, Save, Trash2, FileText, Camera
} from 'lucide-react';

// Hotel Management Component
function HotelOwnerMultipleHotels({ 
    user, 
    hotels, 
    onSidebarToggle,
    onProfileToggle,
    onNotificationToggle,
    onLogout,
    onAddHotel,
    onEditHotel,
    onDeleteHotel,
    onSelectHotel,
    // selectedHotelId,
    sidebarOpen = false,
    profileDropdownOpen = false,
    notificationDropdownOpen = false
}) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [newHotel, setNewHotel] = useState({
        name: '',
        location: '',
        description: '',
        address: '',
        phone: '',
        email: '',
        total_rooms: '',
        amenities: [],
        images: []
    });

    // Default hotels if not provided from backend
    const defaultHotels = hotels || [
        {
            id: 1,
            name: 'Ocean View Hotel',
            location: 'Colombo, Sri Lanka',
            description: 'Luxury beachfront hotel with stunning ocean views',
            address: '123 Marine Drive, Colombo 03',
            phone: '+94 11 234 5678',
            email: 'info@oceanview.lk',
            total_rooms: 38,
            occupancy_rate: 78,
            rating: 4.6,
            monthly_revenue: 12450,
            amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'],
            status: 'Active'
        },
        {
            id: 2,
            name: 'Mountain Resort',
            location: 'Kandy, Sri Lanka',
            description: 'Peaceful mountain retreat with traditional charm',
            address: '456 Hill Country Road, Kandy',
            phone: '+94 81 567 8901',
            email: 'info@mountainresort.lk',
            total_rooms: 25,
            occupancy_rate: 65,
            rating: 4.4,
            monthly_revenue: 8900,
            amenities: ['WiFi', 'Restaurant', 'Garden', 'Parking', 'Spa'],
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'],
            status: 'Active'
        }
    ];

    const amenityOptions = [
        'WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking', 
        'Room Service', 'Laundry', 'Business Center', 'Conference Room',
        'Garden', 'Beach Access', 'Airport Shuttle', 'Pet Friendly'
    ];

    const sidebarItems = [
        { name: 'Dashboard', icon: Activity, href: '/hotel-dashboard' },
        { name: 'My Hotels', icon: Building, href: '/hotel-management/hotels', current: true },
        { name: 'Bookings', icon: Calendar, href: '/hotel-management/bookings' },
        { name: 'Reports', icon: BarChart3, href: '/hotel-management/reports' },
        { name: 'Messages', icon: MessageCircle, href: '/hotel-management/messages' },
        { name: 'Settings', icon: Settings, href: '/hotel-management/settings' },
        { name: 'Profile', icon: User, href: '/profile' }
    ];

    const notifications = [
        { id: 1, message: 'New booking for Ocean View Hotel', time: '15 minutes ago', read: false },
        { id: 2, message: 'Mountain Resort received a 5-star review', time: '1 hour ago', read: false },
        { id: 3, message: 'Monthly report ready for download', time: '2 hours ago', read: true }
    ];

    const handleNavigation = (href) => {
        console.log(`Navigating to: ${href}`);
    };

    // const handleAddHotel = () => {
    //     setShowAddForm(true);
    //     setEditingHotel(null);
    //     setNewHotel({
    //         name: '',
    //         location: '',
    //         description: '',
    //         address: '',
    //         phone: '',
    //         email: '',
    //         total_rooms: '',
    //         amenities: [],
    //         images: []
    //     });
    // };

    const handleEditHotel = (hotel) => {
        setEditingHotel(hotel);
        setNewHotel(hotel);
        setShowAddForm(true);
    };

    const handleSaveHotel = () => {
        if (editingHotel) {
            console.log('Updating hotel:', newHotel);
            if (onEditHotel) onEditHotel(newHotel);
        } else {
            console.log('Adding new hotel:', newHotel);
            if (onAddHotel) onAddHotel(newHotel);
        }
        setShowAddForm(false);
        setEditingHotel(null);
    };

    const handleDeleteHotel = (hotelId) => {
        if (confirm('Are you sure you want to delete this hotel?')) {
            console.log('Deleting hotel:', hotelId);
            if (onDeleteHotel) onDeleteHotel(hotelId);
        }
    };

    const handleAmenityToggle = (amenity) => {
        const updatedAmenities = newHotel.amenities.includes(amenity)
            ? newHotel.amenities.filter(a => a !== amenity)
            : [...newHotel.amenities, amenity];
        
        setNewHotel({ ...newHotel, amenities: updatedAmenities });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700';
            case 'Inactive': return 'bg-red-100 text-red-700';
            case 'Maintenance': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Set page title */}
            {typeof document !== 'undefined' && (document.title = "My Hotels - TourNexus")}

            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-96 h-96 bg-gradient-to-r from-blue-200/30 to-indigo-200/30 rounded-full blur-3xl top-20 left-10 animate-pulse"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-200/40 to-violet-200/40 rounded-full blur-2xl bottom-20 right-10 animate-pulse delay-700"></div>
            </div>

            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-2xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Left side */}
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onSidebarToggle}
                                className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            >
                                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                            
                            <button onClick={() => handleNavigation('/')} className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    TourNexus
                                </span>
                            </button>
                        </div>

                        {/* Center - Hotel Count */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center px-4 py-2 bg-blue-100 rounded-xl">
                                <Building className="w-5 h-5 mr-2 text-blue-600" />
                                <span className="text-blue-700 font-medium">{defaultHotels.length} Hotels</span>
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
                                            {notifications.map((notification) => (
                                                <div key={notification.id} className={`p-4 hover:bg-gray-50 border-b border-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}>
                                                    <p className="text-sm text-gray-900">{notification.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))}
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
                                        src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'Hotel Owner'}&background=3b82f6&color=fff`}
                                        alt={user?.name || 'Hotel Owner'}
                                        className="w-8 h-8 rounded-lg object-cover"
                                    />
                                    <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name || 'Hotel Owner'}</span>
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

            <div className="flex pt-16">
                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white/80 backdrop-blur-md shadow-2xl transform transition-transform duration-300 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 md:static md:inset-0`}>
                    <div className="flex flex-col h-full pt-4">
                        <div className="flex-1 px-4 space-y-2">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.href)}
                                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                        item.current
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                                            : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <item.icon className={`w-5 h-5 mr-3 ${
                                            item.current ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
                                        }`} />
                                        {item.name}
                                    </div>
                                    {item.current && <ArrowRight className="w-4 h-4 ml-auto" />}
                                </button>
                            ))}
                        </div>

                        {/* Owner Summary */}
                        <div className="p-4 border-t border-gray-200">
                            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
                                <div className="flex items-center mb-2">
                                    <Building className="w-5 h-5 mr-2" />
                                    <span className="font-semibold">Hotel Portfolio</span>
                                </div>
                                <p className="text-xs text-blue-100">{defaultHotels.length} Properties</p>
                                <p className="text-xs text-blue-100">Multiple Locations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 md:ml-0 p-6 relative">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Hotels</h1>
                                <p className="text-gray-600">Manage your hotel properties and portfolio</p>
                            </div>
                            <button 
                                // onClick={handleAddHotel}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                <Link to="/addhotel" className="text-emerald-600">
                                Add New Hotel
                                </Link>
                            </button>
                        </div>
                    </div>

                    {/* Hotels Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
                        {defaultHotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                {/* Hotel Image */}
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={hotel.images[0]}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {/* Hotel Info */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(hotel.status)}`}>
                                            {hotel.status}
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{hotel.location}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Bed className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{hotel.total_rooms} rooms</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Star className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{hotel.rating} rating</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4">{hotel.description}</p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="bg-green-50 rounded-lg p-3 text-center">
                                            <p className="text-green-600 font-semibold">{hotel.occupancy_rate}%</p>
                                            <p className="text-green-600 text-xs">Occupancy</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <p className="text-blue-600 font-semibold">${hotel.monthly_revenue}</p>
                                            <p className="text-blue-600 text-xs">Monthly</p>
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1">
                                            {hotel.amenities.slice(0, 4).map((amenity, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {hotel.amenities.length > 4 && (
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                    +{hotel.amenities.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onSelectHotel && onSelectHotel(hotel.id)}
                                            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center"
                                        >
                                            <Activity className="w-4 h-4 mr-2" />
                                            Manage
                                        </button>
                                        <button
                                            onClick={() => handleEditHotel(hotel)}
                                            className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteHotel(hotel.id)}
                                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors duration-200"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add/Edit Hotel Modal */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                                    </h3>
                                </div>
                                
                                <div className="p-6 space-y-4">
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
                                            <input
                                                type="text"
                                                value={newHotel.name}
                                                onChange={(e) => setNewHotel({...newHotel, name: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Enter hotel name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                                            <input
                                                type="text"
                                                value={newHotel.location}
                                                onChange={(e) => setNewHotel({...newHotel, location: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="City, Country"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                        <textarea
                                            value={newHotel.description}
                                            onChange={(e) => setNewHotel({...newHotel, description: e.target.value})}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe your hotel"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                        <input
                                            type="text"
                                            value={newHotel.address}
                                            onChange={(e) => setNewHotel({...newHotel, address: e.target.value})}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Full address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                            <input
                                                type="tel"
                                                value={newHotel.phone}
                                                onChange={(e) => setNewHotel({...newHotel, phone: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="+94 11 xxx xxxx"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                            <input
                                                type="email"
                                                value={newHotel.email}
                                                onChange={(e) => setNewHotel({...newHotel, email: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="info@hotel.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Total Rooms</label>
                                            <input
                                                type="number"
                                                value={newHotel.total_rooms}
                                                onChange={(e) => setNewHotel({...newHotel, total_rooms: e.target.value})}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="50"
                                            />
                                        </div>
                                    </div>

                                    {/* Amenities */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                            {amenityOptions.map((amenity) => (
                                                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newHotel.amenities.includes(amenity)}
                                                        onChange={() => handleAmenityToggle(amenity)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{amenity}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-200 flex space-x-4">
                                    <button
                                        onClick={() => setShowAddForm(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveHotel}
                                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                                    >
                                        <Save className="w-5 h-5 mr-2" />
                                        {editingHotel ? 'Update Hotel' : 'Add Hotel'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={onSidebarToggle}
                ></div>
            )}
        </div>
    );
}

// Container Component that manages state
function HotelOwnerMultipleHotelsContainer() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);

    // Mock user data - replace with your actual data
    const mockUser = {
        name: "Alex Johnson",
        avatar: null
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleProfileToggle = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
        // Close other dropdowns
        setNotificationDropdownOpen(false);
    };

    const handleNotificationToggle = () => {
        setNotificationDropdownOpen(!notificationDropdownOpen);
        // Close other dropdowns
        setProfileDropdownOpen(false);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        alert("Logout clicked!");
    };

    const handleAddHotel = (hotelData) => {
        console.log("Adding new hotel:", hotelData);
        alert(`New hotel "${hotelData.name}" added successfully!`);
        // Here you would make an API call to your Node.js backend
        // Example: await fetch('/api/hotels', { method: 'POST', body: JSON.stringify(hotelData) })
    };

    const handleEditHotel = (hotelData) => {
        console.log("Updating hotel:", hotelData);
        alert(`Hotel "${hotelData.name}" updated successfully!`);
        // Here you would make an API call to your Node.js backend
        // Example: await fetch(`/api/hotels/${hotelData.id}`, { method: 'PUT', body: JSON.stringify(hotelData) })
    };

    const handleDeleteHotel = (hotelId) => {
        console.log("Deleting hotel:", hotelId);
        alert(`Hotel deleted successfully!`);
        // Here you would make an API call to your Node.js backend
        // Example: await fetch(`/api/hotels/${hotelId}`, { method: 'DELETE' })
    };

    const handleSelectHotel = (hotelId) => {
        console.log("Managing hotel:", hotelId);
        alert(`Redirecting to hotel ${hotelId} management dashboard!`);
        // Here you would navigate to the specific hotel's dashboard
        // Example: navigate(`/hotel-management/hotels/${hotelId}/dashboard`)
    };

    return (
        <HotelOwnerMultipleHotels
            user={mockUser}
            onSidebarToggle={handleSidebarToggle}
            onProfileToggle={handleProfileToggle}
            onNotificationToggle={handleNotificationToggle}
            onLogout={handleLogout}
            onAddHotel={handleAddHotel}
            onEditHotel={handleEditHotel}
            onDeleteHotel={handleDeleteHotel}
            onSelectHotel={handleSelectHotel}
            sidebarOpen={sidebarOpen}
            profileDropdownOpen={profileDropdownOpen}
            notificationDropdownOpen={notificationDropdownOpen}
        />
    );
}

export default HotelOwnerMultipleHotelsContainer;