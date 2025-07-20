import React from 'react';
import { MapPin, Users, Car, Calendar, Star, ArrowRight, Play, Globe, Shield, Heart, Phone, Mail, Instagram, Facebook, Twitter, Youtube, Sparkles, Award, Clock, Users2, Mountain, Waves, TreePine, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';



export default function TourismDesign() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 overflow-x-hidden">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-96 h-96 bg-gradient-to-r from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl top-20 left-20 animate-pulse" />
                <div className="absolute w-64 h-64 bg-gradient-to-r from-sky-200/40 to-purple-200/40 rounded-full blur-2xl bottom-20 right-20 animate-pulse" />
            </div>

            {/* Ultra Modern Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-2xl border-b border-white/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Globe className="w-7 h-7 text-white" />
                                </div>
                                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl opacity-30 blur"></div>
                            </div>
                            <div>
                                <span className="text-2xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                    TourNexus
                                </span>
                                <div className="text-xs text-gray-500 font-medium">Discover Paradise</div>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            {['Destinations', 'Experiences', 'Hotels', 'Guides'].map((item) => (
                                <a
                                    key={item}
                                    href={`#${item.toLowerCase()}`}
                                    className="relative text-gray-700 hover:text-teal-600 transition-all duration-300 font-medium group py-2"
                                >
                                    {item}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                                </a>
                            ))}
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="text-gray-700 hover:text-teal-600 transition-all duration-300 font-medium px-4 py-2 rounded-full hover:bg-teal-50">
                                <Link to ="/login" className="ml-2">
                                Log in
                                </Link>
                            </button>
                            <div className="relative group">
                                <button className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 border border-white/20">
                                    Join Now 
                                </button>
                            {/* <div className="absolute top-full right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 border border-white/20">
                                {[
                                    { type: 'Tourist', icon: Users, color: 'from-teal-500 to-emerald-500', to: '/tourist-register' },
                                    { type: 'Hotel Owner', icon: MapPin, color: 'from-emerald-500 to-sky-500', to: '/hotelowner-register' },
                                    { type: 'Tour Guider', icon: Award, color: 'from-sky-500 to-purple-500', to: '/guide-register' },
                                    { type: 'Vehicle Rental', icon: Car, color: 'from-purple-500 to-pink-500', to: '/vehicle-register' }
                                ].map((option) => (
                                    <Link
                                    key={option.type}
                                    to={option.to}
                                    className="flex items-center px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-teal-50 hover:to-emerald-50 rounded-xl transition-all duration-200 group/item"
                                    >
                                    <div className={`w-8 h-8 bg-gradient-to-r ${option.color} rounded-lg flex items-center justify-center mr-3 group-hover/item:scale-110 transition-transform duration-200`}>
                                        <option.icon className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-medium">{option.type}</span>
                                    <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all duration-200" />
                                    </Link>
                                ))}
                            </div> */}
                             </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Ultra Dynamic Hero Section */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
                        alt="Sri Lanka landscape"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                </div>

                {/* Floating Particles */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${2 + Math.random() * 3}s`
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
                    <div className="mb-1 pt-10">
                        <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
                            <Sparkles className="w-5 h-5 mr-2 text-teal-300" />
                            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
                        <span className="block">Discover</span>
                        <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                            Ceylon's
                        </span>
                        <span className="block">Paradise</span>
                    </h1>

                    <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed">
                        Experience the wonder of Sri Lanka through our revolutionary platform. From ancient temples to pristine beaches,
                        let AI craft your perfect adventure while local experts guide your journey.
                    </p>
                </div>

                {/* Slide Indicators */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {[...Array(4)].map((_, index) => (
                        <button
                            key={index}
                            className={`transition-all duration-500 rounded-full ${
                                index === 0
                                ? 'w-12 h-3 bg-gradient-to-r from-teal-400 to-emerald-400'
                                : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                            }`}
                        />
                    ))}
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 right-8 animate-bounce">
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { number: "50K+", label: "Happy Travelers", icon: Users2 },
                            { number: "1,200+", label: "Partner Hotels", icon: MapPin },
                            { number: "500+", label: "Expert Guides", icon: Award },
                            { number: "98%", label: "Satisfaction Rate", icon: Star }
                        ].map((stat, index) => (
                            <div key={index} className="text-center group cursor-pointer">
                                <div className="relative mb-4">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                                        <stat.icon className="w-10 h-10 text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                                </div>
                                <div className="text-4xl font-black text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="services" className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-sky-50"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-6 py-3 bg-teal-100 rounded-full mb-6">
                            <Sparkles className="w-5 h-5 mr-2 text-teal-600" />
                            <span className="text-teal-700 font-semibold">Complete Travel Solutions</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Everything You Need
                            <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                In One Platform
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From AI-powered trip planning to seamless bookings, we've reimagined how you explore Sri Lanka
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: MapPin,
                                title: "Luxury Hotels",
                                description: "Curated accommodations from boutique villas to 5-star resorts",
                                color: "from-teal-500 to-emerald-500",
                                bgColor: "from-teal-50 to-emerald-50",
                                features: ["Instant Booking", "Best Price Guarantee", "24/7 Support"]
                            },
                            {
                                icon: Users,
                                title: "Expert Guides",
                                description: "Certified local experts sharing untold stories and hidden gems",
                                color: "from-emerald-500 to-sky-500",
                                bgColor: "from-emerald-50 to-sky-50",
                                features: ["Verified Guides", "Multiple Languages", "Custom Tours"]
                            },
                            {
                                icon: Car,
                                title: "Premium Vehicles",
                                description: "From luxury cars to authentic tuk-tuks, travel in comfort",
                                color: "from-sky-500 to-purple-500",
                                bgColor: "from-sky-50 to-purple-50",
                                features: ["GPS Tracking", "Insurance Included", "24/7 Roadside"]
                            },
                            {
                                icon: Calendar,
                                title: "AI Trip Planner",
                                description: "Intelligent itineraries tailored to your preferences and budget",
                                color: "from-purple-500 to-pink-500",
                                bgColor: "from-purple-50 to-pink-50",
                                features: ["Smart Recommendations", "Budget Optimization", "Real-time Updates"]
                            }
                        ].map((service, index) => (
                            <div
                                key={index}
                                className={`group relative bg-gradient-to-br ${service.bgColor} rounded-3xl p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-4 transition-all duration-700 overflow-hidden border border-white/50`}
                            >
                                {/* Background Pattern */}
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                                    <div className={`w-full h-full bg-gradient-to-br ${service.color} rounded-full blur-2xl`}></div>
                                </div>

                                <div className={`w-20 h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                    <service.icon className="w-10 h-10 text-white" />
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-teal-700 transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                                <ul className="space-y-2 mb-6">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-700">
                                            <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full mr-3"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full bg-gradient-to-r ${service.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300`}>
                                    Explore More
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Destinations Gallery */}
            <section id="destinations" className="py-32 bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                    </div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-6 py-3 bg-teal-500/20 backdrop-blur-md rounded-full mb-6 border border-teal-400/30">
                            <Mountain className="w-5 h-5 mr-2 text-teal-300" />
                            <span className="text-teal-300 font-semibold">Incredible Destinations</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                            Paradise
                            <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent">
                                Awaits You
                            </span>
                        </h2>
                        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                            From ancient wonders to pristine wilderness, discover Sri Lanka's most breathtaking locations
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                name: "Sigiriya",
                                image: "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                description: "Ancient rock fortress rising 200m above jungle",
                                category: "Historical",
                                icon: Mountain
                            },
                            {
                                name: "Galle Fort",
                                image: "https://images.unsplash.com/photo-1509982724584-2ce0d4366d8b?q=80&w=2130&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                description: "Dutch colonial architecture meets ocean views",
                                category: "Coastal",
                                icon: Waves
                            },
                            {
                                name: "Ella",
                                image: "https://cdn.pixabay.com/photo/2020/10/15/19/00/nine-arch-bridge-5657721_1280.jpg",
                                description: "Misty mountains and emerald tea plantations",
                                category: "Mountain",
                                icon: TreePine
                            },
                            {
                                name: "Kandy",
                                image: "https://images.unsplash.com/photo-1665849050430-5e8c16bacf7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                description: "Sacred city with the Temple of the Tooth",
                                category: "Cultural",
                                icon: Sun
                            },
                            {
                                name: "Yala National Park",
                                image: "https://images.unsplash.com/photo-1695173987873-6f157a2d6ad1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                description: "Leopards, elephants in pristine wilderness",
                                category: "Wildlife",
                                icon: TreePine
                            },
                            {
                                name: "Mirissa",
                                image: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                                description: "Whale watching and pristine golden beaches",
                                category: "Beach",
                                icon: Waves
                            }
                        ].map((destination, index) => (
                            <div
                                key={index}
                                className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-700 h-96 cursor-pointer"
                            >
                                <img
                                    src={destination.image}
                                    alt={destination.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/20 group-hover:to-emerald-500/20 transition-all duration-500"></div>

                                {/* Category Badge */}
                                <div className="absolute top-6 left-6">
                                    <div className="flex items-center px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                                        <destination.icon className="w-4 h-4 mr-2 text-teal-300" />
                                        <span className="text-white text-sm font-medium">{destination.category}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-6 left-6 right-6 text-white">
                                    <h3 className="text-3xl font-bold mb-3 group-hover:text-teal-300 transition-colors duration-300">
                                        {destination.name}
                                    </h3>
                                    <p className="text-gray-300 mb-4 leading-relaxed">{destination.description}</p>
                                    <button className="group/btn flex items-center px-6 py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30">
                                        <span className="font-semibold mr-2">Explore</span>
                                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center px-6 py-3 bg-emerald-100 rounded-full mb-6">
                            <Heart className="w-5 h-5 mr-2 text-emerald-600" />
                            <span className="text-emerald-700 font-semibold">Traveler Stories</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Real Stories,
                            <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                                Real Magic
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover why thousands of travelers choose us for their Sri Lankan adventures
                        </p>
                    </div>

                    {/* Featured Testimonial */}
                    <div className="relative mb-16">
                        <div className="bg-white rounded-3xl p-12 shadow-2xl border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full blur-3xl opacity-30 -translate-y-32 translate-x-32"></div>

                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="flex items-center mb-6">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-6 h-6 text-yellow-400 fill-current mr-1" />
                                        ))}
                                    </div>
                                    <blockquote className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
                                        "Absolutely magical! The AI trip planner created the perfect itinerary. Every moment was unforgettable, from the ancient temples to pristine beaches."
                                    </blockquote>
                                    <div className="flex items-center">
                                        <img
                                            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
                                            alt="Sarah Johnson"
                                            className="w-16 h-16 rounded-full object-cover mr-6 border-4 border-white shadow-lg"
                                        />
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900">Sarah Johnson</h4>
                                            <p className="text-gray-600">Travel Blogger</p>
                                            <p className="text-teal-600 font-medium">Australia</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
                                        <img
                                            src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                            alt="Happy travelers"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Navigation */}
                        <div className="flex justify-center mt-8 space-x-3">
                            {[...Array(4)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`transition-all duration-300 rounded-full ${
                                        index === 0
                                        ? 'w-12 h-3 bg-gradient-to-r from-teal-400 to-emerald-400'
                                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Trust Indicators */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { metric: "4.9/5", label: "Average Rating", icon: Star },
                            { metric: "50K+", label: "Happy Travelers", icon: Users2 },
                            { metric: "24/7", label: "Support Available", icon: Clock },
                            { metric: "100%", label: "Satisfaction Rate", icon: Shield }
                        ].map((item, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-3xl font-black text-gray-900 mb-2">{item.metric}</div>
                                <div className="text-gray-600 font-medium">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-sky-600"></div>
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl animate-pulse"></div>
                </div>

                <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-8">
                            <Sparkles className="w-6 h-6 mr-3 text-white" />
                            <span className="text-white font-semibold text-lg">Limited Time Offer</span>
                        </div>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight">
                        Your Adventure
                        <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                            Starts Here
                        </span>
                    </h2>

                    <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
                        Join over 50,000 travelers who've discovered the magic of Sri Lanka.
                        Get 20% off your first booking and exclusive access to hidden gems.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                        <button className="group relative bg-white text-teal-600 px-12 py-6 rounded-full text-xl font-bold hover:bg-gray-50 transform hover:scale-105 transition-all duration-500 shadow-2xl overflow-hidden">
                            <span className="relative z-10 flex items-center justify-center">
                                <Users className="mr-3 w-6 h-6" />
                                <Link to="/tourist-register" className="text-teal-600 hover:text-teal-800">
                                Start as Tourist
                                </Link>
                            </span>
                        </button>
                        <button className="group bg-white/20 backdrop-blur-md text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-white/30 transition-all duration-500 border-2 border-white/30 flex items-center justify-center">
                            <Shield className="mr-3 w-6 h-6" />
                            Become a Guide
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
                        <div className="flex items-center text-white">
                            <Shield className="w-5 h-5 mr-2" />
                            <span className="font-medium">SSL Secured</span>
                        </div>
                        <div className="flex items-center text-white">
                            <Star className="w-5 h-5 mr-2" />
                            <span className="font-medium">5-Star Rated</span>
                        </div>
                        <div className="flex items-center text-white">
                            <Clock className="w-5 h-5 mr-2" />
                            <span className="font-medium">24/7 Support</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Footer */}
            <footer className="bg-gray-900 text-white py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                        {/* Brand Section */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <span className="text-3xl font-black bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                                        TourNexus
                                    </span>
                                    <div className="text-sm text-gray-400">Discover Paradise</div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Your gateway to authentic Sri Lankan experiences. We connect travelers with local experts,
                                creating unforgettable journeys through the pearl of the Indian Ocean.
                            </p>
                            <div className="flex space-x-4">
                                {[
                                    { icon: Facebook, href: "#" },
                                    { icon: Instagram, href: "#" },
                                    { icon: Twitter, href: "#" },
                                    { icon: Youtube, href: "#" }
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-12 h-12 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-500 hover:to-emerald-500 rounded-xl flex items-center justify-center transition-all duration-300 group"
                                    >
                                        <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Services</h3>
                            <ul className="space-y-4">
                                {['Hotel Booking', 'Tour Guides', 'Vehicle Rental', 'Trip Planning', 'Airport Transfer'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center group">
                                            <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Support</h3>
                            <ul className="space-y-4">
                                {['Help Center', 'Contact Us', 'Emergency Line', 'Travel Insurance', 'Cancellation'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center group">
                                            <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
                            <div className="space-y-4">
                                <div className="flex items-center text-gray-400">
                                    <Phone className="w-5 h-5 mr-3 text-teal-400" />
                                    <span>+94 76 100 7188</span>
                                </div>
                                <div className="flex items-center text-gray-400">
                                    <Mail className="w-5 h-5 mr-3 text-teal-400" />
                                    <span>tournexus@gmail.com</span>
                                </div>
                                <div className="flex items-start text-gray-400">
                                    <MapPin className="w-5 h-5 mr-3 text-teal-400 mt-1" />
                                    <span>No.11 Galle Road,<br />Colombo 03, Sri Lanka</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm mb-4 md:mb-0">
                            © 2024 TourNexus. All rights reserved. Made with ❤️ for travelers.
                        </p>
                        <div className="flex flex-wrap gap-6">
                            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item) => (
                                <a key={item} href="#" className="text-gray-400 hover:text-teal-400 text-sm transition-colors duration-300">
                                    {item}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>

            {/* Custom Styles */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(60px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }

                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }
                .delay-700 { animation-delay: 0.7s; }
                .delay-800 { animation-delay: 0.8s; }

                /* Smooth scrolling */
                html {
                    scroll-behavior: smooth;
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
            `}</style>
        </div>
    );
}