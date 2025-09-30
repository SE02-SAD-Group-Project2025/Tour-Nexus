import axios from 'axios';  
import { useState } from 'react';
import React from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    Save, 
    Trash2, 
    AlertTriangle, 
    CheckCircle, 
    Globe, 
    Shield, 
    Camera, 
    ArrowLeft,
    Settings,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function TouristPersonalDetails() {
    // Simple state management - no location dependency
    const [email, setEmail] = useState('');
    const [fullname, setFullname] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    function deleteTourist(email){
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("Please login to delete account");
            return;
        }
        axios.delete(import.meta.env.VITE_BACKEND_URL + '/api/user/' + email, {
            headers: {
                Authorization: "Bearer " + token,
            },
        })
        .then(()=>{
            toast.success("Account deleted successfully");
            
        })
        .catch((error) => {
            console.error("Error deleting account:", error);
            toast.error("Error deleting account");
        })
        
    }

    async function handleProfile() {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Please login to update details");
            return;
        }

        // Basic validation
        if (!email || !fullname) {
            toast.error("Please fill in email and full name");
            return;
        }

        // Password validation (only if changing password)
        if (newPassword || confirmPassword) {
            if (!password) {
                toast.error("Please enter current password");
                return;
            }
            if (newPassword !== confirmPassword) {
                toast.error("New passwords do not match");
                return;
            }
            if (newPassword.length < 6) {
                toast.error("New password must be at least 6 characters");
                return;
            }
        }

        const User = {
            email: email,
            fullname: fullname,
            // Only include password if changing it
            ...(newPassword && { password: newPassword, currentPassword: password })
        };

        try {
            const res = await axios.put(
                import.meta.env.VITE_BACKEND_URL + '/api/user/' + email,
                User,
                {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );
            console.log(res);
            toast.success("Profile updated successfully");
            
            // Clear password fields after update
            setEmail('');
            setFullname('');
            setPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
        } catch (error) {
            console.log(error);
            toast.error("Error updating profile");
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 relative overflow-hidden">
            {/* Enhanced Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-sky-500/10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-sky-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />
                
                {/* Floating particles */}
                {[...Array(10)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-white/30 rounded-full animate-pulse"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            animationDuration: `${Math.random() * 8 + 4}s`
                        }}
                    />
                ))}
            </div>
            
            {/* Main Content */}
            <div className="relative z-10 min-h-screen p-6">
                {/* Header */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <Link 
                            to="/tourist/dashboard"
                            className="flex items-center space-x-2 text-teal-600 hover:text-teal-700 transition-colors duration-300 group"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                            <span className="font-medium">Back to Dashboard</span>
                        </Link>
                        
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                    TourNexus
                                </h1>
                                <p className="text-sm text-teal-600 font-medium">Personal Settings</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 backdrop-blur-md rounded-full mb-4 border border-teal-400/30">
                            <Settings className="w-4 h-4 mr-2 text-teal-300" />
                            <span className="text-teal-600 text-sm font-semibold">Account Management</span>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Personal Details</h2>
                        <p className="text-gray-600">Manage your account information and preferences</p>
                    </div>
                </div>

                {/* Main Container */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-emerald-100/50 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-sky-100/50 to-purple-100/50 rounded-full blur-2xl"></div>

                        <div className="relative z-10 p-8">
                            {/* Navigation Tabs */}
                            <div className="flex space-x-1 mb-8 bg-gray-100/80 rounded-2xl p-1">
                                <button 
                                    onClick={() => {
                                        document.getElementById('deleteSection').classList.add('hidden');
                                        document.getElementById('updateSection').classList.remove('hidden');
                                    }}
                                    className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg"
                                >
                                    <Settings className="w-5 h-5 inline mr-2" />
                                    Update Profile
                                </button>
                                 <button 
                                    onClick={() => {
                                        document.getElementById('updateSection').classList.add('hidden');
                                        document.getElementById('deleteSection').classList.remove('hidden');
                                    }}
                                    className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 text-gray-600 hover:text-red-600"
                                >
                                    <Trash2 className="w-5 h-5 inline mr-2" />
                                    Delete Account
                                </button>
                            </div>

                            {/* Update Profile Section */}
                            <div id="updateSection" className="space-y-8">
                                {/* Profile Header */}
                                <div className="text-center mb-8">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-full flex items-center justify-center shadow-xl">
                                            <User className="w-12 h-12 text-white" />
                                        </div>
                                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-teal-100 hover:scale-110 transition-transform duration-300">
                                            <Camera className="w-4 h-4 text-teal-600" />
                                        </button>
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-900">Update Your Information</h3>
                                    <p className="text-gray-600">Modify your personal details and security settings</p>
                                </div>

                                {/* Personal Information */}
                                <div className="bg-gradient-to-br from-blue-50/50 to-teal-50/50 rounded-2xl p-6 border border-blue-100">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <User className="w-5 h-5 mr-2 text-teal-600" />
                                        Personal Information
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Full Name
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                                <input
                                                    value={fullname}
                                                    onChange={(e) => setFullname(e.target.value)}
                                                    type="text"
                                                    name="fullName"
                                                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                                <input
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    type="email"
                                                    name="email"
                                                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="bg-gradient-to-br from-orange-50/50 to-red-50/50 rounded-2xl p-6 border border-orange-100">
                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                                        <Lock className="w-5 h-5 mr-2 text-orange-600" />
                                        Change Password
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Current Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Current Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                                                <input
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    type="password"
                                                    name="currentPassword"
                                                    className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all duration-300 outline-none"
                                                    placeholder="Current password"
                                                />
                                            </div>
                                        </div>

                                        {/* New Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                New Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                                                <input
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    type="password"
                                                    name="newPassword"
                                                    className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all duration-300 outline-none"
                                                    placeholder="New password"
                                                />
                                            </div>
                                        </div>

                                        {/* Confirm Password */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Confirm Password
                                            </label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                                                <input
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    type="password"
                                                    name="confirmPassword"
                                                    className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all duration-300 outline-none"
                                                    placeholder="Confirm password"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-center pt-6">
                                    <button 
                                        onClick={handleProfile}
                                        className="bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 flex items-center space-x-3 group hover:scale-105 active:scale-95"
                                    >
                                        <Save className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                                        <span>Save All Changes</span>
                                    </button>
                                </div>
                            </div>  

                            {/* Delete Account Section (Hidden by default) */}
                            <div id="deleteSection" className="space-y-6 hidden">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                                        <AlertTriangle className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="mt-4 text-xl font-bold text-gray-900">Danger Zone</h3>
                                    <p className="text-gray-600">Permanently delete your account</p>
                                </div>

                                <div className="bg-red-50/80 backdrop-blur-md border-2 border-red-200 rounded-2xl p-6">
                                    <div className="flex items-start space-x-4">
                                        <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                            <h4 className="text-lg font-bold text-red-900 mb-2">Delete Account</h4>
                                            <p className="text-red-800 mb-4">
                                                Once you delete your account, there is no going back. Please be certain.
                                                This action will:
                                            </p>
                                            <ul className="list-disc list-inside text-red-700 text-sm space-y-1 mb-6">
                                                <li>Permanently delete your profile and account data</li>
                                                <li>Cancel all active bookings and reservations</li>
                                                <li>Remove access to your travel history</li>
                                                <li>Delete all saved preferences and settings</li>
                                            </ul>
                                            <button onClick={deleteTourist} className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-red-500/25 transition-all duration-300 flex items-center space-x-2 group hover:scale-105 active:scale-95">
                                                <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                                <span>Delete My Account</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal (Hidden - for design reference) */}
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 hidden">
                <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                    <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                    
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Account</h3>
                        <p className="text-gray-600 mb-6">
                            Are you absolutely sure you want to delete your account? This action cannot be undone.
                        </p>
                        
                        <div className="flex space-x-3">
                            <button className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300">
                                Cancel
                            </button>
                            <button  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300">
                                Delete Forever
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                /* Smooth animations */
                .animate-pulse {
                    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: .7;
                    }
                }

                /* Glass effect */
                .backdrop-blur-2xl {
                    backdrop-filter: blur(40px);
                }

                .backdrop-blur-md {
                    backdrop-filter: blur(12px);
                }

                /* Gradient text */
                .bg-clip-text {
                    -webkit-background-clip: text;
                    background-clip: text;
                }

                /* Transitions */
                * {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Focus styles */
                input:focus {
                    outline: none;
                }

                /* Button hover states */
                button:hover {
                    transform: translateY(-1px);
                }

                button:active {
                    transform: translateY(0px);
                }
            `}</style>
        </div>
    );
}