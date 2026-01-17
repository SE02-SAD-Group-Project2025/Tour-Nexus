import React, { useState, useEffect } from "react";
import {
  MapPin,
  Users,
  Car,
  Calendar,
  Star,
  ArrowRight,
  Play,
  Globe,
  Shield,
  Heart,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Sparkles,
  Award,
  Clock,
  Users2,
  Mountain,
  Waves,
  TreePine,
  Sun,
  ChevronUp,
  Plane,
  Camera,
  Compass,
  Quote,
  TrendingUp,
  Zap,
  Target,
  Gift,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function TourismDesign() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 300);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50 overflow-x-hidden">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-gray-200/20">
        <div
          className="h-full bg-gradient-to-r from-teal-500 via-emerald-500 to-sky-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Enhanced Cursor Follower */}
      <div
        className="fixed w-96 h-96 rounded-full pointer-events-none z-0 transition-all duration-[2000ms] ease-out"
        style={{
          background:
            "radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)",
          transform: `translate(${mousePosition.x - 192}px, ${
            mousePosition.y - 192
          }px)`,
        }}
      />

      {/* Enhanced Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-teal-200/30 to-emerald-200/30 rounded-full blur-3xl top-20 left-20 animate-float"
          style={{ transform: `translateY(${scrollProgress * 0.5}px)` }}
        />
        <div
          className="absolute w-64 h-64 bg-gradient-to-r from-sky-200/40 to-purple-200/40 rounded-full blur-2xl bottom-20 right-20 animate-float-delayed"
          style={{ transform: `translateY(-${scrollProgress * 0.3}px)` }}
        />
        <div className="absolute w-72 h-72 bg-gradient-to-r from-pink-200/30 to-orange-200/30 rounded-full blur-3xl top-1/2 left-1/3 animate-float-slow" />
      </div>

      {/* Ultra Modern Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl shadow-2xl border-b border-white/20 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-3 group">
              <div className="relative">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 sm:w-7 h-5 sm:h-7 text-white animate-spin-slow" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl opacity-30 blur group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-black bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent animate-gradient">
                  TourNexus
                </span>
                <div className="hidden sm:block text-xs text-gray-500 font-medium animate-fade-in">
                  Discover Paradise
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              {["Destinations", "Experiences", "Hotels", "Guides"].map(
                (item, index) => (
                  <a
                    key={item}
                    href={"/login"}
                    className="relative text-gray-700 hover:text-teal-600 transition-all duration-300 font-medium group py-2 animate-fade-in-down"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-semibold text-sm sm:text-base hover:shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300 animate-pulse-slow whitespace-nowrap">
                <Link to="/login" className="flex items-center">
                  Log In
                </Link>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative min-h-screen pt-16 sm:pt-20 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 via-transparent to-emerald-500/20 animate-gradient-shift"></div>

        <div className="absolute inset-0 animate-ken-burns">
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
            alt="Sri Lanka landscape"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float-random"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${10 + Math.random() * 20}s`,
              }}
            >
              <div className="w-2 h-2 bg-white/20 rounded-full blur-sm"></div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-0">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 sm:mb-8 leading-tight">
            <span
              className="block animate-fade-in-up opacity-0"
              style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
            >
              Discover
            </span>
            <span
              className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent animate-fade-in-up opacity-0 animate-gradient"
              style={{ animationDelay: "400ms", animationFillMode: "forwards" }}
            >
              Ceylon's
            </span>
            <span
              className="block animate-fade-in-up opacity-0"
              style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
            >
              Paradise
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 text-gray-200 max-w-4xl mx-auto leading-relaxed animate-fade-in-up opacity-0"
            style={{ animationDelay: "800ms", animationFillMode: "forwards" }}
          >
            Experience the wonder of Sri Lanka through our revolutionary
            platform. From ancient temples to pristine beaches, let AI craft
            your perfect adventure while local experts guide your journey.
          </p>

          {/* Enhanced CTA Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}>
                        <button className="group relative bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-12 py-6 rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-500 overflow-hidden">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10 flex items-center justify-center">
                                <Play className="mr-3 w-6 h-6" />
                                Start Your Journey
                            </span>
                        </button>
                        <button className="group bg-white/20 backdrop-blur-md text-white px-12 py-6 rounded-full text-xl font-bold hover:bg-white/30 transition-all duration-500 border-2 border-white/30 flex items-center justify-center">
                            <Camera className="mr-3 w-6 h-6" />
                            Watch Preview
                        </button>
                    </div> */}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 right-4 sm:right-8 animate-bounce">
          <div
            className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center hover:border-white/50 transition-colors duration-300 cursor-pointer group"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 group-hover:h-4 transition-all duration-300"></div>
          </div>
          <ChevronUp className="w-6 h-6 text-white/40 mt-2 animate-pulse rotate-180" />
        </div>
      </section>

      {/* New Featured Destinations Gallery Section */}
      <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-20 right-20 w-64 h-64 sm:w-72 sm:h-72 bg-emerald-500/30 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-500/20 backdrop-blur-md rounded-full mb-4 sm:mb-6 border border-teal-400/30 hover:bg-teal-500/30 transition-all duration-300 cursor-pointer">
              <Camera className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-teal-300 animate-pulse" />
              <span className="text-sm sm:text-base text-teal-300 font-semibold">
                Featured Destinations
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Immersive
              <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent animate-gradient">
                Visual Journey
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              Explore Sri Lanka's most breathtaking destinations through
              stunning imagery and immersive experiences
            </p>
          </div>

          {/* Enhanced Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                src: "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=600&h=800&fit=crop",
                title: "Sigiriya Rock Fortress",
                description: "Ancient palace ruins on a massive rock formation",
                category: "Historical",
              },
              {
                src: "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0",
                title: "Mirissa Beach Paradise",
                description: "Pristine golden beaches and crystal waters",
                category: "Beach",
              },
              {
                src: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&h=800&fit=crop",
                title: "Temple of the Tooth",
                description: "Sacred Buddhist temple in ancient Kandy",
                category: "Cultural",
              },
              {
                src: "https://images.unsplash.com/photo-1509982724584-2ce0d4366d8b?w=600&h=800&fit=crop",
                title: "Galle Dutch Fort",
                description: "Colonial architecture meets ocean views",
                category: "Colonial",
              },
              {
                src: "https://images.unsplash.com/photo-1579989197427-2569307ae3ab?q=80&w=1094&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Scenic Train Journey",
                description: "Famous Ella to Kandy railway route",
                category: "Adventure",
              },
              {
                src: "https://images.unsplash.com/photo-1651681379673-78b421f98d1d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                title: "Ancient Anuradhapura",
                description: "Sacred ancient city and ruins",
                category: "Heritage",
              },
            ].map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-700 h-64 sm:h-80 md:h-96 cursor-pointer animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <img
                  src={destination.src}
                  alt={destination.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/20 group-hover:to-emerald-500/20 transition-all duration-500"></div>

                {/* Category Badge */}
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-30">
                  <div className="px-3 sm:px-4 py-1 sm:py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {destination.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-30">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-3 group-hover:text-teal-300 transition-colors duration-300">
                      {destination.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                      {destination.description}
                    </p>
                    <button className="group/btn flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30 opacity-0 group-hover:opacity-100 text-sm sm:text-base">
                      <span className="font-semibold mr-2">Explore</span>
                      <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Statistics Section */}
      <section className="py-16 sm:py-20 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-100 rounded-full mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-emerald-600 animate-bounce-slow" />
              <span className="text-sm sm:text-base text-emerald-700 font-semibold">
                Proven Excellence
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Numbers That
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent animate-gradient">
                Speak Volumes
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                number: "50K+",
                label: "Happy Travelers",
                icon: Users2,
                color: "from-teal-400 to-emerald-500",
                description: "Satisfied customers worldwide",
              },
              {
                number: "1,200+",
                label: "Partner Hotels",
                icon: MapPin,
                color: "from-emerald-400 to-sky-500",
                description: "Premium accommodations",
              },
              {
                number: "500+",
                label: "Expert Guides",
                icon: Award,
                color: "from-sky-400 to-purple-500",
                description: "Certified local experts",
              },
              {
                number: "98%",
                label: "Satisfaction Rate",
                icon: Star,
                color: "from-purple-400 to-pink-500",
                description: "Outstanding reviews",
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer animate-fade-in-up opacity-0 p-4 sm:p-6 rounded-2xl hover:bg-white/50 transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="relative mb-4 sm:mb-6">
                  <div
                    className={`w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 mx-auto bg-gradient-to-br ${stat.color} rounded-2xl sm:rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg sm:shadow-xl group-hover:shadow-2xl`}
                  >
                    <stat.icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-white group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl sm:rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500 scale-150`}
                  ></div>
                </div>
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-2 group-hover:text-teal-600 transition-colors duration-300">
                  <span className="inline-block group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </span>
                </div>
                <div className="text-sm sm:text-base md:text-lg font-bold text-gray-700 mb-1 sm:mb-2 group-hover:text-gray-900 transition-colors duration-300">
                  {stat.label}
                </div>
                <div className="hidden sm:block text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {stat.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Services Section with 3D Cards */}
      <section
        id="services"
        className="py-16 sm:py-24 md:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-emerald-50 to-sky-50"></div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-teal-200/30 rounded-full blur-3xl animate-morph"></div>
          <div className="absolute bottom-10 right-10 w-56 sm:w-96 h-56 sm:h-96 bg-emerald-200/30 rounded-full blur-3xl animate-morph-delayed"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-100 rounded-full mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-teal-600 animate-sparkle" />
              <span className="text-sm sm:text-base text-teal-700 font-semibold">
                Complete Travel Solutions
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Everything You Need
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent animate-gradient">
                In One Platform
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              From AI-powered trip planning to seamless bookings, we've
              reimagined how you explore Sri Lanka
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: MapPin,
                title: "Luxury Hotels",
                description:
                  "Curated accommodations from boutique villas to 5-star resorts",
                color: "from-teal-500 to-emerald-500",
                bgColor: "from-teal-50 to-emerald-50",
                shadowColor: "shadow-teal-500/20",
                features: [
                  "Instant Booking",
                  "Best Price Guarantee",
                  "24/7 Support",
                ],
              },
              {
                icon: Users,
                title: "Expert Guides",
                description:
                  "Certified local experts sharing untold stories and hidden gems",
                color: "from-emerald-500 to-sky-500",
                bgColor: "from-emerald-50 to-sky-50",
                shadowColor: "shadow-emerald-500/20",
                features: [
                  "Verified Guides",
                  "Multiple Languages",
                  "Custom Tours",
                ],
              },
              {
                icon: Car,
                title: "Premium Vehicles",
                description:
                  "From luxury cars to authentic tuk-tuks, travel in comfort",
                color: "from-sky-500 to-purple-500",
                bgColor: "from-sky-50 to-purple-50",
                shadowColor: "shadow-sky-500/20",
                features: [
                  "GPS Tracking",
                  "Insurance Included",
                  "24/7 Roadside",
                ],
              },
              {
                icon: Calendar,
                title: "AI Trip Planner",
                description:
                  "Intelligent itineraries tailored to your preferences and budget",
                color: "from-purple-500 to-pink-500",
                bgColor: "from-purple-50 to-pink-50",
                shadowColor: "shadow-purple-500/20",
                features: [
                  "Smart Recommendations",
                  "Budget Optimization",
                  "Real-time Updates",
                ],
              },
            ].map((service, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br ${service.bgColor} rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-xl hover:shadow-2xl ${service.shadowColor} transform hover:-translate-y-4 transition-all duration-700 overflow-hidden border border-white/50 animate-fade-in-up opacity-0 hover:rotate-1`}
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                  <div
                    className={`w-full h-full bg-gradient-to-br ${service.color} rounded-full blur-2xl animate-pulse-slow`}
                  ></div>
                </div>

                <div
                  className={`w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br ${service.color} rounded-xl sm:rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg relative z-10`}
                >
                  <service.icon className="w-8 sm:w-10 h-8 sm:h-10 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 group-hover:text-teal-700 transition-colors duration-300 relative z-10">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed relative z-10">
                  {service.description}
                </p>

                <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 relative z-10">
                  {service.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center text-xs sm:text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-300"
                    >
                      <div
                        className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-2 sm:mr-3 group-hover:scale-150 transition-transform duration-300`}
                      ></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full bg-gradient-to-r ${service.color} text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:shadow-lg transform hover:scale-105 transition-all duration-300 relative z-10 overflow-hidden group`}
                >
                  <span className="relative z-10">Explore More</span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Destinations Gallery */}
      <section
        id="destinations"
        className="py-16 sm:py-24 md:py-32 bg-gray-900 relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div
              className="absolute bottom-20 right-20 w-56 sm:w-96 h-56 sm:h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-teal-500/20 backdrop-blur-md rounded-full mb-4 sm:mb-6 border border-teal-400/30 hover:bg-teal-500/30 transition-all duration-300 cursor-pointer">
              <Mountain className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-teal-300 animate-bounce-slow" />
              <span className="text-sm sm:text-base text-teal-300 font-semibold">
                Popular Destinations
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
              Paradise
              <span className="block bg-gradient-to-r from-teal-300 via-emerald-300 to-sky-300 bg-clip-text text-transparent animate-gradient">
                Awaits You
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-2">
              From ancient wonders to pristine wilderness, discover Sri Lanka's
              most breathtaking locations
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {[
              {
                name: "Sigiriya",
                image:
                  "https://images.unsplash.com/photo-1612862862126-865765df2ded?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
                description: "Ancient rock fortress rising 200m above jungle",
                category: "Historical",
                icon: Mountain,
                rating: 4.9,
                duration: "3-4 hours",
                price: "$45",
              },
              {
                name: "Galle Fort",
                image:
                  "https://images.unsplash.com/photo-1509982724584-2ce0d4366d8b?q=80&w=2130&auto=format&fit=crop&ixlib=rb-4.1.0",
                description: "Dutch colonial architecture meets ocean views",
                category: "Coastal",
                icon: Waves,
                rating: 4.8,
                duration: "2-3 hours",
                price: "$30",
              },
              {
                name: "Ella",
                image:
                  "https://images.unsplash.com/photo-1579989197427-2569307ae3ab?q=80&w=1094&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                description: "Misty mountains and emerald tea plantations",
                category: "Mountain",
                icon: TreePine,
                rating: 4.9,
                duration: "Full day",
                price: "$85",
              },
              {
                name: "Kandy",
                image:
                  "https://images.unsplash.com/photo-1665849050430-5e8c16bacf7e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0",
                description: "Sacred city with the Temple of the Tooth",
                category: "Cultural",
                icon: Sun,
                rating: 4.7,
                duration: "4-5 hours",
                price: "$55",
              },
              {
                name: "Yala National Park",
                image:
                  "https://images.unsplash.com/photo-1695173987873-6f157a2d6ad1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0",
                description: "Leopards, elephants in pristine wilderness",
                category: "Wildlife",
                icon: TreePine,
                rating: 5.0,
                duration: "Half day",
                price: "$95",
              },
              {
                name: "Mirissa",
                image:
                  "https://images.unsplash.com/photo-1522310193626-604c5ef8be43?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.1.0",
                description: "Whale watching and pristine golden beaches",
                category: "Beach",
                icon: Waves,
                rating: 4.8,
                duration: "Full day",
                price: "$75",
              },
            ].map((destination, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-2xl hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-700 h-72 sm:h-96 md:h-[450px] cursor-pointer animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500 z-10"></div>
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/20 group-hover:to-emerald-500/20 transition-all duration-500 z-20"></div>

                {/* Enhanced Badges */}
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-30 animate-slide-down">
                  <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20 group-hover:bg-white/20 transition-all duration-300">
                    <destination.icon className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2 text-teal-300 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {destination.category}
                    </span>
                  </div>
                </div>

                <div
                  className="absolute top-3 sm:top-6 right-3 sm:right-6 z-30 animate-slide-down"
                  style={{ animationDelay: "200ms" }}
                >
                  <div className="flex items-center px-2 sm:px-3 py-1 sm:py-1.5 bg-yellow-500/90 backdrop-blur-md rounded-full">
                    <Star className="w-3 sm:w-4 h-3 sm:h-4 mr-1 text-white fill-current" />
                    <span className="text-white text-xs sm:text-sm font-bold">
                      {destination.rating}
                    </span>
                  </div>
                </div>

                {/* Price Badge */}
                <div
                  className="absolute top-14 sm:top-20 right-3 sm:right-6 z-30 animate-slide-down"
                  style={{ animationDelay: "400ms" }}
                >
                  <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-500/90 backdrop-blur-md rounded-full">
                    <span className="text-white text-xs sm:text-sm font-bold">
                      {destination.price}
                    </span>
                  </div>
                </div>

                {/* Enhanced Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white z-30">
                  <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 group-hover:text-teal-300 transition-colors duration-300">
                      {destination.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden sm:block">
                      {destination.description}
                    </p>
                    <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="flex items-center text-xs sm:text-sm">
                        <Clock className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                        <span>{destination.duration}</span>
                      </div>
                      <button className="group/btn flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30">
                        <span className="font-semibold mr-1 sm:mr-2 text-sm sm:text-base">
                          Explore
                        </span>
                        <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-teal-500/20 to-transparent"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced View All Button */}
          <div className="text-center animate-fade-in-up">
            <button className="group inline-flex items-center px-6 sm:px-12 py-3 sm:py-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full font-semibold sm:font-bold text-sm sm:text-xl hover:shadow-lg hover:shadow-teal-500/25 transform hover:scale-105 transition-all duration-300">
              <Compass className="w-4 sm:w-6 h-4 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-45 transition-transform duration-300" />
              View All Destinations
              <ArrowRight className="w-4 sm:w-6 h-4 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* New Special Offers Section */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        {/* <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20 animate-fade-in-up">
                        <div className="inline-flex items-center px-6 py-3 bg-purple-100 rounded-full mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
                            <Gift className="w-5 h-5 mr-2 text-purple-600 animate-pulse" />
                            <span className="text-purple-700 font-semibold">Limited Time Offers</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
                            Exclusive
                            <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
                                Travel Deals
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Discover incredible savings on our most popular Sri Lankan experiences
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Cultural Triangle Explorer",
                                originalPrice: "$299",
                                salePrice: "$199",
                                discount: "33% OFF",
                                duration: "5 Days",
                                image: "https://images.unsplash.com/photo-1578894381163-e72c17f2d45f?w=600&h=400&fit=crop",
                                highlights: ["Sigiriya Rock", "Anuradhapura", "Polonnaruwa", "Expert Guide"]
                            },
                            {
                                title: "Beach Paradise Package",
                                originalPrice: "$249",
                                salePrice: "$179",
                                discount: "28% OFF",
                                duration: "4 Days",
                                image: "https://images.unsplash.com/photo-1588501088292-f9542e6f5013?w=600&h=400&fit=crop",
                                highlights: ["Mirissa Beach", "Whale Watching", "Galle Fort", "Luxury Resort"]
                            },
                            {
                                title: "Hill Country Adventure",
                                originalPrice: "$349",
                                salePrice: "$249",
                                discount: "29% OFF",
                                duration: "6 Days",
                                image: "https://images.unsplash.com/photo-1569163139394-de4faf3954c8?w=600&h=400&fit=crop",
                                highlights: ["Ella", "Nuwara Eliya", "Tea Plantations", "Train Journey"]
                            }
                        ].map((offer, index) => (
                            <div
                                key={index}
                                className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up opacity-0"
                                style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <div className="px-4 py-2 bg-red-500 text-white rounded-full font-bold text-sm animate-pulse">
                                            {offer.discount}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4">
                                        <div className="px-3 py-1.5 bg-black/60 text-white rounded-full text-sm">
                                            {offer.duration}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-purple-600 transition-colors duration-300">
                                        {offer.title}
                                    </h3>

                                    <div className="flex items-center mb-4">
                                        <span className="text-3xl font-black text-purple-600">{offer.salePrice}</span>
                                        <span className="text-lg text-gray-400 line-through ml-3">{offer.originalPrice}</span>
                                    </div>

                                    <ul className="space-y-2 mb-6">
                                        {offer.highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                                                {highlight}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div> */}
      </section>

      {/* Enhanced Visual Testimonials Section */}
      <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-emerald-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 sm:w-96 h-64 sm:h-96 bg-pink-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-48 sm:w-72 h-48 sm:h-72 bg-purple-200/30 rounded-full blur-3xl animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16 md:mb-20 animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-emerald-100 rounded-full mb-4 sm:mb-6 hover:scale-105 transition-transform duration-300 cursor-pointer">
              <Heart className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-emerald-600 animate-pulse" />
              <span className="text-sm sm:text-base text-emerald-700 font-semibold">
                Traveler Stories
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-4 sm:mb-6 leading-tight">
              Real Stories,
              <span className="block bg-gradient-to-r from-teal-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent animate-gradient">
                Real Magic
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2">
              Discover why thousands of travelers choose us for their Sri Lankan
              adventures
            </p>
          </div>

          {/* Enhanced Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-12 md:mb-16">
            {[
              {
                name: "Sarah Johnson",
                location: "Australia",
                image:
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
                quote:
                  "The AI trip planner created the perfect itinerary. Every moment was unforgettable! The local guides were incredible.",
                rating: 5,
                tripImage:
                  "https://images.unsplash.com/photo-1654561773591-57b9413c45c0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                experience: "Beach Paradise Package",
              },
              {
                name: "Michael Chen",
                location: "Singapore",
                image:
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                quote:
                  "Local guides showed us hidden gems we'd never find on our own. Truly authentic and magical experience!",
                rating: 5,
                tripImage:
                  "https://images.unsplash.com/photo-1612862862126-865765df2ded?w=600&h=400&fit=crop",
                experience: "Cultural Triangle Explorer",
              },
              {
                name: "Emma Watson",
                location: "UK",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
                quote:
                  "From booking to experiencing, everything was seamless. Best vacation ever! Sri Lanka is absolutely stunning.",
                rating: 5,
                tripImage:
                  "https://images.unsplash.com/photo-1731126658364-ac14223d311d?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                experience: "Hill Country Adventure",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up opacity-0"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: "forwards",
                }}
              >
                {/* Background Trip Image */}
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden relative">
                  <img
                    src={testimonial.tripImage}
                    alt="Trip"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 text-white">
                    <div className="text-xs sm:text-sm font-medium bg-black/40 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full">
                      {testimonial.experience}
                    </div>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="relative -mt-6 sm:-mt-12 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="flex items-end justify-between mb-3 sm:mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 sm:w-24 h-14 sm:h-24 rounded-lg sm:rounded-2xl object-cover border-3 sm:border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="flex items-center mb-1 sm:mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 sm:w-5 h-3 sm:h-5 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300"
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-teal-600 transition-colors duration-300">
                    {testimonial.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-600 font-medium flex items-center mb-3 sm:mb-4">
                    <MapPin className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
                    {testimonial.location}
                  </p>

                  <div className="relative">
                    <Quote className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-5 sm:w-8 h-5 sm:h-8 text-teal-200" />
                    <p className="text-xs sm:text-sm text-gray-700 italic pl-4 sm:pl-6 leading-relaxed line-clamp-3 sm:line-clamp-none">
                      {testimonial.quote}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                metric: "4.9/5",
                label: "Average Rating",
                icon: Star,
                suffix: "",
                description: "From 10,000+ reviews",
              },
              {
                metric: "50",
                label: "Happy Travelers",
                icon: Users2,
                suffix: "K+",
                description: "Worldwide customers",
              },
              {
                metric: "24/7",
                label: "Support Available",
                icon: Clock,
                suffix: "",
                description: "Round-the-clock help",
              },
              {
                metric: "100",
                label: "Satisfaction Rate",
                icon: Shield,
                suffix: "%",
                description: "Money-back guarantee",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer animate-fade-in-up opacity-0 p-4 sm:p-6"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <div className="w-14 sm:w-20 h-14 sm:h-20 mx-auto mb-2 sm:mb-4 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl sm:rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <item.icon className="w-6 sm:w-10 h-6 sm:h-10 text-white group-hover:rotate-12 transition-transform duration-300" />
                </div>
                <div className="text-2xl sm:text-4xl font-black text-gray-900 mb-1 sm:mb-2 group-hover:text-teal-600 transition-colors duration-300">
                  <span className="inline-block group-hover:scale-110 transition-transform duration-300">
                    {item.metric}
                    {item.suffix}
                  </span>
                </div>
                <div className="text-sm sm:text-lg font-bold text-gray-700 mb-0.5 sm:mb-1 group-hover:text-gray-900 transition-colors duration-300">
                  {item.label}
                </div>
                <div className="hidden sm:block text-xs sm:text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 sm:py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-sky-600"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-48 sm:w-96 h-48 sm:h-96 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div
            className="absolute bottom-20 right-20 w-40 sm:w-64 h-40 sm:h-64 bg-white/10 rounded-full blur-2xl animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[800px] h-96 sm:h-[800px] bg-white/5 rounded-full blur-3xl animate-pulse-slow"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Enhanced Floating Icons */}
          {[Camera, Plane, Compass, MapPin, Gift, Zap].map((Icon, index) => (
            <div
              key={index}
              className="absolute text-white/10 animate-float-icon hidden sm:block"
              style={{
                left: `${20 + index * 15}%`,
                top: `${20 + index * 12}%`,
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <Icon className="w-12 sm:w-16 h-12 sm:h-16" />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8 animate-fade-in-down">
            <div className="inline-flex items-center px-4 sm:px-8 py-2 sm:py-4 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-6 sm:mb-8 hover:bg-white/30 transition-all duration-300 cursor-pointer">
              <Sparkles className="w-4 sm:w-6 h-4 sm:h-6 mr-2 sm:mr-3 text-white animate-sparkle" />
              <span className="text-white font-semibold text-xs sm:text-base md:text-lg">
                Limited Time Offer - 20% OFF First Booking
              </span>
              <Sparkles
                className="w-4 sm:w-6 h-4 sm:h-6 ml-2 sm:ml-3 text-white animate-sparkle"
                style={{ animationDelay: "0.5s" }}
              />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-tight animate-fade-in-up">
            Your Adventure
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent animate-gradient">
              Starts Here
            </span>
          </h2>

          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in-up px-2"
            style={{ animationDelay: "200ms" }}
          >
            Join over 50,000 travelers who've discovered the magic of Sri Lanka.
            Get 20% off your first booking and exclusive access to hidden gems.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-16 animate-fade-in-up"
            style={{ animationDelay: "400ms" }}
          >
            <button className="group relative bg-white text-teal-600 px-6 sm:px-12 py-3 sm:py-6 rounded-full text-base sm:text-lg md:text-xl font-semibold sm:font-bold hover:bg-gray-50 transform hover:scale-105 transition-all duration-500 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <span className="relative z-10 flex items-center justify-center group-hover:text-white transition-colors duration-500">
                <Users className="mr-2 sm:mr-3 w-4 sm:w-6 h-4 sm:h-6" />
                <Link
                  to="/register"
                  className="group-hover:text-white transition-colors duration-500"
                >
                  Start as Tourist
                </Link>
              </span>
            </button>
            <button className="group bg-white/20 backdrop-blur-md text-white px-6 sm:px-12 py-3 sm:py-6 rounded-full text-base sm:text-lg md:text-xl font-semibold sm:font-bold hover:bg-white/30 transition-all duration-500 border-2 border-white/30 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
              <Shield className="mr-2 sm:mr-3 w-4 sm:w-6 h-4 sm:h-6 relative z-10" />
              <Link to="/register">
                <span className="relative z-10">Become a Guide</span>
              </Link>
            </button>
          </div>

          {/* Enhanced Trust Badges */}
          <div
            className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 opacity-80 animate-fade-in-up"
            style={{ animationDelay: "600ms" }}
          >
            {[
              { icon: Shield, text: "SSL Secured" },
              { icon: Star, text: "5-Star Rated" },
              { icon: Clock, text: "24/7 Support" },
              { icon: Award, text: "Certified Guides" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer text-xs sm:text-base"
              >
                <item.icon
                  className="w-4 sm:w-5 h-4 sm:h-5 mr-1 sm:mr-2 animate-pulse"
                  style={{ animationDelay: `${index * 200}ms` }}
                />
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-gray-900 text-white py-12 sm:py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 animate-gradient"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 md:gap-12 mb-8 sm:mb-12 md:mb-16">
            {/* Enhanced Brand Section */}
            <div className="sm:col-span-2 animate-fade-in-up">
              <div className="flex items-center space-x-3 mb-6 sm:mb-8">
                <div className="w-10 sm:w-14 h-10 sm:h-14 bg-gradient-to-br from-teal-400 via-emerald-500 to-sky-500 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <Globe className="w-5 sm:w-8 h-5 sm:h-8 text-white animate-spin-slow" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
                    TourNexus
                  </span>
                  <div className="text-xs sm:text-sm text-gray-400">
                    Discover Paradise
                  </div>
                </div>
              </div>
              <p className="text-gray-400 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
                Your gateway to authentic Sri Lankan experiences. We connect
                travelers with local experts, creating unforgettable journeys
                through the pearl of the Indian Ocean.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                {[
                  { icon: Facebook, href: "#", color: "hover:bg-blue-600" },
                  { icon: Instagram, href: "#", color: "hover:bg-pink-600" },
                  { icon: Twitter, href: "#", color: "hover:bg-blue-400" },
                  { icon: Youtube, href: "#", color: "hover:bg-red-600" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`w-10 sm:w-12 h-10 sm:h-12 bg-gray-800 ${social.color} rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 group hover:scale-110 hover:rotate-6`}
                  >
                    <social.icon className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-hover:text-white transition-colors duration-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Enhanced Footer Links */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-white">
                Services
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {[
                  "Hotel Booking",
                  "Tour Guides",
                  "Vehicle Rental",
                  "Trip Planning",
                  "Airport Transfer",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center group text-sm sm:text-base"
                    >
                      <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "200ms" }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-white">
                Support
              </h3>
              <ul className="space-y-2 sm:space-y-4">
                {[
                  "Help Center",
                  "Contact Us",
                  "Emergency Line",
                  "Travel Insurance",
                  "Cancellation",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-teal-400 transition-colors duration-300 flex items-center group text-sm sm:text-base"
                    >
                      <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 mr-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="animate-fade-in-up"
              style={{ animationDelay: "300ms" }}
            >
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-4 sm:mb-6 text-white">
                Get in Touch
              </h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-300 cursor-pointer group">
                  <Phone className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs sm:text-sm">+94 76 100 7188</span>
                </div>
                <div className="flex items-center text-gray-400 hover:text-teal-400 transition-colors duration-300 cursor-pointer group">
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-xs sm:text-sm">
                    tournexus@gmail.com
                  </span>
                </div>
                <div className="flex items-start text-gray-400 group">
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5 mr-2 sm:mr-3 text-teal-400 mt-1 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    No.11 Galle Road,
                    <br />
                    Colombo 03, Sri Lanka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Section */}
          <div className="border-t border-gray-800 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6 animate-fade-in-up">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 TourNexus. All rights reserved. Made with ❤️ for travelers.
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 justify-center">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Sitemap",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-400 hover:text-teal-400 text-xs sm:text-sm transition-colors duration-300 hover:underline"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 sm:bottom-8 right-4 sm:right-8 z-40 w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-full shadow-lg hover:shadow-xl transform transition-all duration-500 flex items-center justify-center group ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <ChevronUp className="w-5 sm:w-6 h-5 sm:h-6 relative z-10 group-hover:translate-y-[-2px] transition-transform duration-300" />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 animate-ping opacity-30"></div>
      </button>

      {/* Enhanced Custom Styles */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }

        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-25px) translateX(10px);
          }
          66% {
            transform: translateY(-15px) translateX(-10px);
          }
        }

        @keyframes float-random {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.3;
          }
          25% {
            transform: translateY(-100px) translateX(50px) scale(1.2);
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50px) translateX(-30px) scale(0.8);
            opacity: 0.5;
          }
          75% {
            transform: translateY(-150px) translateX(-50px) scale(1.1);
            opacity: 0.7;
          }
        }

        @keyframes float-icon {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
          }
          50% {
            transform: translateY(-50px) rotate(180deg);
            opacity: 0.3;
          }
        }

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes gradient-shift {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes sparkle {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.8);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes morph {
          0%,
          100% {
            border-radius: 50%;
            transform: translateX(0) rotate(0deg);
          }
          33% {
            border-radius: 40% 60% 60% 40%;
            transform: translateX(30px) rotate(120deg);
          }
          66% {
            border-radius: 60% 40% 40% 60%;
            transform: translateX(-30px) rotate(240deg);
          }
        }

        @keyframes morph-delayed {
          0%,
          100% {
            border-radius: 50%;
            transform: translateY(0) rotate(0deg);
          }
          33% {
            border-radius: 60% 40% 40% 60%;
            transform: translateY(-30px) rotate(-120deg);
          }
          66% {
            border-radius: 40% 60% 60% 40%;
            transform: translateY(30px) rotate(-240deg);
          }
        }

        @keyframes slide-down {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }

        .animate-float-random {
          animation: float-random 20s ease-in-out infinite;
        }

        .animate-float-icon {
          animation: float-icon 15s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-gradient-shift {
          animation: gradient-shift 20s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .animate-ken-burns {
          animation: ken-burns 20s ease-out infinite alternate;
        }

        .animate-sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animate-morph {
          animation: morph 20s ease-in-out infinite;
        }

        .animate-morph-delayed {
          animation: morph-delayed 20s ease-in-out infinite;
          animation-delay: 5s;
        }

        .animate-slide-down {
          animation: slide-down 0.5s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* Enhanced Smooth scrolling */
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 80px;
        }

        /* Premium scrollbar design */
        ::-webkit-scrollbar {
          width: 12px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #f1f5f9, #e0f2fe);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #14b8a6, #10b981);
          border-radius: 6px;
          border: 2px solid #f1f5f9;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #0d9488, #059669);
          border-color: #e0f2fe;
        }

        /* Smooth transitions for all interactive elements */
        * {
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Prevent layout shift during animations */
        .opacity-0 {
          opacity: 0;
        }

        /* Enhanced cursor interaction */
        a,
        button {
          cursor: pointer;
        }

        /* Performance optimization for animations */
        .animate-float,
        .animate-float-delayed,
        .animate-float-slow,
        .animate-float-random,
        .animate-float-icon {
          will-change: transform;
        }

        /* Parallax optimization */
        [style*="transform"] {
          will-change: transform;
        }

        /* Mobile responsive enhancements */
        @media (max-width: 768px) {
          .animate-ken-burns {
            animation-duration: 30s;
          }

          .w-96 {
            width: 16rem;
          }

          .h-96 {
            height: 16rem;
          }
        }

        /* Accessibility improvements */
        @media (prefers-reduced-motion: reduce) {
          .animate-float,
          .animate-float-delayed,
          .animate-float-slow,
          .animate-float-random,
          .animate-float-icon,
          .animate-gradient,
          .animate-gradient-shift,
          .animate-spin-slow,
          .animate-ken-burns,
          .animate-sparkle,
          .animate-pulse-slow,
          .animate-morph,
          .animate-morph-delayed {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus states for accessibility */
        button:focus,
        a:focus {
          outline: 2px solid #14b8a6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
