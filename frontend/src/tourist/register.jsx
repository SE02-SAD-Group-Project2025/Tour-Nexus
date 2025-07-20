import axios from 'axios';
import React, { useState } from 'react';
import { Globe, User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, Sparkles, Shield, Star, Users, CheckCircle, Heart, Camera, Map, Plane, Award, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';

export default function RegisterTouristDesign() {
    const navigate = useNavigate();

    // State management for all form fields
    const [fullname, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);



    async function handleRegister() {
        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/register', {
                fullname,
                email,
                phone,
                role,
                password,
            });

            toast.success("Registration Successfull");
            navigate("/login");

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error("Registration error:", error);
        }
    }

    // Trust indicators
    const trustIndicators = [
        { icon: Shield, text: "Secure & Protected", color: "text-green-500" },
        { icon: Users, text: "50K+ Happy Travelers", color: "text-blue-500" },
        { icon: Star, text: "4.9/5 Rating", color: "text-yellow-500" },
        { icon: Award, text: "Award Winning", color: "text-purple-500" }
    ];

    // Feature highlights for inspiration
    const features = [
        { icon: Plane, label: "Amazing Destinations" },
        { icon: Camera, label: "Capture Memories" },
        { icon: Map, label: "Expert Guidance" },
        { icon: Heart, label: "Unforgettable Experiences" }
    ];

    return (
        <div className="min-h-screen overflow-hidden relative bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50">
            {/* Enhanced Background with Geometric Patterns */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-emerald-500/10 to-sky-500/10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated orbs */}
                <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse" />
                <div className="absolute bottom-32 right-32 w-24 h-24 bg-gradient-to-r from-sky-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse" />

                {/* Floating particles */}
                {[...Array(15)].map((_, i) => (
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
            <div className="relative z-10 min-h-screen flex">
                {/* Left Side - Branding & Features */}
                <div className="hidden lg:flex lg:w-1/2 flex-col justify-center p-12 xl:p-20">
                    {/* Logo and Brand */}
                    <div className="mb-12">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-3xl flex items-center justify-center shadow-2xl">
                                <Globe className="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                    TourNexus
                                </h1>
                                <p className="text-teal-600 font-medium">Discover Paradise</p>
                            </div>
                        </div>

                        <h2 className="text-5xl xl:text-6xl font-black text-gray-900 mb-6 leading-tight">
                            Start Your Journey,
                            <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Explorer!
                            </span>
                        </h2>

                        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                            Join thousands of travelers discovering Sri Lanka's magical destinations.
                            Your adventure begins with a simple registration.
                        </p>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-2 gap-6 mb-12">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 group hover:scale-105 hover:translate-x-2 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 bg-teal-50 backdrop-blur-md rounded-2xl flex items-center justify-center group-hover:bg-teal-100 transition-all duration-300 border border-teal-200">
                                        <feature.icon className="w-6 h-6 text-teal-600" />
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors duration-300">
                                        {feature.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Trust indicators */}
                        <div className="grid grid-cols-2 gap-4">
                            {trustIndicators.map((indicator, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-2 bg-white/80 backdrop-blur-md rounded-xl p-3 border border-gray-200 shadow-sm hover:scale-105 transition-transform duration-300"
                                >
                                    <indicator.icon className={`w-5 h-5 ${indicator.color}`} />
                                    <span className="text-gray-700 text-sm font-medium">{indicator.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
                    <div className="w-full max-w-md">
                        {/* Form Container */}
                        <div className="bg-white/80 backdrop-blur-2xl rounded-3xl p-8 xl:p-10 shadow-2xl border border-white/50 relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100/50 to-emerald-100/50 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-sky-100/50 to-purple-100/50 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                {/* Mobile Logo */}
                                <div className="lg:hidden text-center mb-8">
                                    <div className="w-20 h-20 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                        <Globe className="w-10 h-10 text-white" />
                                    </div>
                                    <h1 className="text-3xl font-black text-gray-900 mb-2">TourNexus</h1>
                                    <p className="text-teal-600">Join Us Today!</p>
                                </div>

                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 backdrop-blur-md rounded-full mb-6 border border-teal-400/30">
                                        <Sparkles className="w-4 h-4 mr-2 text-teal-300" />
                                        <span className="text-teal-600 text-sm font-semibold">Create Account</span>
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-2 hidden lg:block">
                                        Join TourNexus
                                    </h2>
                                    <p className="text-gray-600">
                                        Begin your Sri Lankan adventure
                                    </p>
                                </div>



                                {/* Registration Form */}
                                <div className="space-y-6">
                                    {/* Full Name Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                type="text"
                                                value={fullname}
                                                onChange={(e) => setFullName(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="Enter your full name"
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="your@email.com"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Phone Number
                                        </label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="+94 71 123 4567"
                                            />
                                        </div>
                                    </div>

                                    {/* User Type Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            I want to join as
                                        </label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300 z-10" />
                                            <select
                                                value={role}
                                                onChange={(e) => setRole(e.target.value)}
                                                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none appearance-none"
                                            >
                                                <option value="">Select your role</option>
                                                <option value="Tourist">Tourist</option>
                                                <option value="Guide">Guide</option>
                                                <option value="HotelOwner">Hotel Owner</option>
                                                <option value="VehicleRental">Vehicle Rental</option>
                                            </select>
                                            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Password
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="Create a secure password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors duration-300"
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Confirm Password
                                        </label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="Confirm your password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors duration-300"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div>
                                        <button
                                            onClick={handleRegister}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 flex items-center justify-center space-x-3 group hover:scale-105 active:scale-95 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <span className="z-10">Sign In</span>
                                            <ArrowRight className="w-5 h-5 z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    {/* Login Link */}
                                    <div className="text-center pt-6 border-t border-gray-200">
                                        <p className="text-gray-600 mb-4">
                                            Already have an account?
                                        </p>
                                        <Link
                                            to="/login"
                                            className="inline-flex items-center text-teal-600 hover:text-teal-700 font-semibold transition-colors duration-300 hover:underline group"
                                        >
                                            <span>Sign in here</span>
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Styles */}
            <style>{`
                @keyframes float-up {
                    0% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.3;
                    }
                    50% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100px) translateX(25px);
                        opacity: 0;
                    }
                }

                .floating-particle {
                    animation: float-up 8s infinite linear;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }

                ::-webkit-scrollbar-thumb {
                    background: linear-gradient(to bottom, #14b8a6, #10b981);
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: linear-gradient(to bottom, #0d9488, #059669);
                }

                /* Smooth transitions */
                * {
                    transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
                    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Focus styles */
                input:focus, select:focus {
                    outline: none;
                }

                /* Hover effects */
                .group:hover .group-hover\\:translate-x-1 {
                    transform: translateX(0.25rem);
                }

                .group:hover .group-hover\\:scale-110 {
                    transform: scale(1.1);
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

                /* Button hover states */
                button:hover {
                    transform: translateY(-1px);
                }

                button:active {
                    transform: translateY(0px);
                }

                /* Input focus states */
                input:focus, select:focus {
                    box-shadow: 0 0 0 4px rgba(20, 184, 166, 0.1);
                }

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
            `}</style>
        </div>
    );
}