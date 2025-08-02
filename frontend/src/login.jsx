import axios from 'axios';
import React from 'react';
import {
    Mail,
    Lock,
    Eye,
    ArrowRight,
    EyeOff,
    Globe,
    Sparkles,
    Shield,
    Star,
    Users,
    CheckCircle,
    Heart,
    Zap,
    Crown,
    Award,
    Camera,
    Map,
    Plane
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';



export default function LoginDesign() {

    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    async function handleLogin() {
        try {
            const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/user/login', {
                email: email,
                password: password
            })
            toast.success("Login successful!");
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", email);
            console.log(response.data.role);

            if (response.data.role === "Tourist") {
                navigate("/tourist/dashboard");
            }
            else if (response.data.role === "Guide") {
                navigate("/guide/dashboard");
            }
            else if (response.data.role === "HotelOwner") {
                navigate("/hotelowner/dashboard");
            }
            else if (response.data.role === "Admin") {
                navigate("/admin/dashboard");
            }
            else {
                toast.error("Invalid user role!");
            }



        } catch (error) {
            toast.error("Login failed! Please check your credentials.");
            console.error("Login error:", error);


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
                            Welcome Back,
                            <span className="block bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                Explorer!
                            </span>
                        </h2>

                        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
                            Continue your journey through Sri Lanka's magical destinations.
                            Your next adventure is just a login away.
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

                {/* Right Side - Login Form */}
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
                                    <p className="text-teal-600">Welcome Back!</p>
                                </div>

                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 backdrop-blur-md rounded-full mb-6 border border-teal-400/30">
                                        <Sparkles className="w-4 h-4 mr-2 text-teal-300" />
                                        <span className="text-teal-600 text-sm font-semibold">Secure Login</span>
                                    </div>

                                    <h2 className="text-3xl font-bold text-gray-900 mb-2 hidden lg:block">
                                        Welcome Back
                                    </h2>
                                    <p className="text-gray-600">
                                        Continue your Sri Lankan adventure
                                    </p>
                                </div>

                                {/* Status Message (Demo) */}
                                <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-md border border-green-400/30 rounded-2xl">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-green-700 text-sm font-medium">Password reset link sent to your email!</span>
                                    </div>
                                </div>

                                {/* Login Form */}
                                <div className="space-y-6">
                                    {/* Email Field */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Email Address
                                        </label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-300" />
                                            <input
                                                onChange={(e) => setEmail(e.target.value)}
                                                type="email"
                                                className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="your@email.com"
                                            />
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
                                                onChange={(e) => setPassword(e.target.value)}
                                                type="password"
                                                className="w-full pl-12 pr-14 py-4 bg-white/60 backdrop-blur-md border-2 border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:border-teal-400 focus:ring-4 focus:ring-teal-400/20 transition-all duration-300 outline-none"
                                                placeholder="Enter your password"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors duration-300"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center space-x-3 cursor-pointer group">
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" defaultChecked />
                                                <div className="w-5 h-5 rounded border-2 bg-teal-500 border-teal-500 transition-all duration-300">
                                                    <svg
                                                        className="w-3 h-3 text-white ml-0.5 mt-0.5"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                                                Remember me
                                            </span>
                                        </label>

                                        <a
                                            href="#"
                                            className="text-sm text-teal-600 hover:text-teal-700 transition-colors duration-300 hover:underline"
                                        >
                                            Forgot password?
                                        </a>
                                    </div>

                                    {/* Submit Button */}
                                    <div>
                                        <button
                                            onClick={handleLogin}
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 text-white py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-teal-500/25 transition-all duration-500 flex items-center justify-center space-x-3 group hover:scale-105 active:scale-95 relative overflow-hidden"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                            <span className="z-10">Sign In</span>
                                            <ArrowRight className="w-5 h-5 z-10 group-hover:translate-x-1 transition-transform duration-300" />
                                        </button>
                                    </div>

                                    {/* Register Link */}
                                    <div className="text-center pt-6 border-t border-gray-200">
                                        <p className="text-gray-600 mb-4">
                                            New to TourNexus?
                                        </p>

                                        <Link to="/register" className="flex items-center">
                                            <span>Register Here</span>
                                        </Link>
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />

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
                input:focus {
                    outline: none;
                }

                /* Hover effects */
                .group:hover .group-hover\\:translate-x-1 {
                    transform: translateX(0.25rem);
                }

                .group:hover .group-hover\\:scale-110 {
                    transform: scale(1.1);
                }

                /* Glass morphism effect */
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
                input:focus {
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