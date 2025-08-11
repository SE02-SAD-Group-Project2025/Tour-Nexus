import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function TouristViewHotelDetails() {
    const params = useParams();
    const navigate = useNavigate();
    const hotel_id = params.hotel_id;
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search/booking parameters (could come from URL params or form)
    const [searchParams] = useState({
        checkInDate: '',
        checkOutDate: '',
        rooms: '1',
        guests: '2'
    });

    useEffect(() => {
        const fetchHotelDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/hotel/view_hotels_by_id/${hotel_id}`
                );
                
                console.log(response.data);
                
                // Transform the data to match component expectations
                const transformedHotel = {
                    id: response.data._id,
                    hotel_id: response.data.hotel_id,
                    name: response.data.hotel_name,
                    email: response.data.email,
                    address: response.data.address,
                    description: response.data.description,
                    parkingAvailable: response.data.parking_available,
                    images: response.data.images || [],
                    status: response.data.status,
                    totalRooms: response.data.total_rooms,
                    date: response.data.date,
                    
                    // Transform room_types to roomCategories
                    roomCategories: response.data.room_types?.map((room, index) => ({
                        id: index + 1,
                        categoryName: room.name,
                        roomCount: room.count,
                        pricePerNight: room.price,
                        facilities: room.facilities || [],
                        images: room.images || []
                    })) || []
                };
                
                setHotel(transformedHotel);
                setError(null);
            } catch (error) {
                console.error("Error fetching hotel details:", error);
                setError("Failed to load hotel details");
                toast.error("Something went wrong! Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (hotel_id) {
            fetchHotelDetails();
        }
    }, [hotel_id]);

    // State for selected room type
    const [selectedRoomId, setSelectedRoomId] = useState(null);

    // Update selected room when hotel data loads
    useEffect(() => {
        if (hotel?.roomCategories?.length > 0) {
            const availableRooms = hotel.roomCategories.filter(room => room.roomCount > 0);
            setSelectedRoomId(availableRooms.length > 0 ? availableRooms[0].id : null);
        }
    }, [hotel]);

    // Handle booking with selected room
    const handleBookRoom = (roomData = null) => {
        // Use passed room data or currently selected room
        const selectedRoom = roomData || hotel.roomCategories.find(room => room.id === selectedRoomId);
        
        if (!selectedRoom) {
            toast.error("Please select a room type first");
            return;
        }

        // Navigate to booking page with hotel and room data
        navigate(`/tourist/bookhotel/${hotel_id}`, {
            state: {
                selectedRoom: selectedRoom,
                searchParams: searchParams,
                hotelData: hotel
            }
        });
    };

    // // Quick search form handlers
    // const handleSearchParamChange = (key, value) => {
    //     setSearchParams(prev => ({
    //         ...prev,
    //         [key]: value
    //     }));
    // };

    // Facility icons
    const facilityIcons = {
        'Free WiFi': '📶',
        'Free Parking': '🅿️', 
        'Free Breakfast': '🍳',
        'Restaurant': '🍽️',
        'Fitness Center': '💪',
        'Swimming Pool': '🏊',
        '24/7 Security': '🛡️',
        '24/7 Reception': '🛎️',
        'Room Service': '🛏️',
        'Butler Service': '🤵',
        'Children\'s Area': '🧸',
        'Spa': '💆',
        'Conference Room': '🏢',
        'Laundry Service': '👔',
        'Airport Shuttle': '✈️'
    };

    // Functions
    const goBack = () => {
        window.history.back();
    };

    // Status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return { bg: '#d4f8e8', color: '#0d5f2a', border: '#82d982' };
            case 'rejected': return { bg: '#fed7d7', color: '#9b2c2c', border: '#fc8181' };
            case 'pending': return { bg: '#fef5e7', color: '#975a16', border: '#f6e05e' };
            default: return { bg: '#e2e8f0', color: '#4a5568', border: '#cbd5e0' };
        }
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ 
                    textAlign: 'center',
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }}>
                    <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '20px',
                        animation: 'pulse 2s infinite'
                    }}>🏨</div>
                    <div style={{ 
                        fontSize: '18px', 
                        color: '#666',
                        fontWeight: '500'
                    }}>Loading hotel details...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !hotel) {
        return (
            <div style={{
                fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                minHeight: '100vh',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ 
                    textAlign: 'center',
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                    <div style={{ 
                        fontSize: '18px', 
                        color: '#666', 
                        fontWeight: '500'
                    }}>
                        {error || 'Hotel not found'}
                    </div>
                    <button onClick={goBack} style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        marginTop: '20px'
                    }}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Filter only available room categories
    const availableRoomCategories = hotel.roomCategories.filter(room => room.roomCount > 0);
    const currentRoom = availableRoomCategories.find(room => room.id === selectedRoomId);
    const statusStyle = getStatusColor(hotel.status);

    return (
        <div style={{
            fontFamily: "'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {/* Back Button */}
                <button 
                    onClick={goBack}
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        marginBottom: '30px',
                        fontSize: '14px',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                    }}
                >
                    ← Back to Hotels
                </button>

               
                {/* Hotel Header Card */}
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '25px',
                        flexWrap: 'wrap',
                        gap: '20px'
                    }}>
                        <h1 style={{
                            fontSize: '36px',
                            fontWeight: '700',
                            margin: '0',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            {hotel.name}
                        </h1>
                        
                        {/* Enhanced Status Badge */}
                        <div style={{
                            padding: '12px 20px',
                            borderRadius: '25px',
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.color,
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            fontSize: '12px',
                            border: `2px solid ${statusStyle.border}`,
                            letterSpacing: '0.5px'
                        }}>
                            {hotel.status}
                        </div>
                    </div>

                    {/* Hotel Info Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        marginBottom: '25px',
                        padding: '25px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                        borderRadius: '15px',
                        border: '1px solid #e2e8f0'
                    }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>📧</span>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>EMAIL</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{hotel.email}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>🏠</span>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>TOTAL ROOMS</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{hotel.totalRooms}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '20px' }}>📅</span>
                            <div>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>REGISTERED</div>
                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{new Date(hotel.date).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Address */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '20px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        borderRadius: '15px',
                        border: '1px solid #93c5fd'
                    }}>
                        <span style={{ fontSize: '24px' }}>📍</span>
                        <span style={{ fontSize: '16px', fontWeight: '500', color: '#1e40af' }}>{hotel.address}</span>
                    </div>

                    {/* Parking Status */}
                    <div style={{
                        padding: '20px',
                        background: hotel.parkingAvailable 
                            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)' 
                            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        border: hotel.parkingAvailable 
                            ? '2px solid #16a34a' 
                            : '2px solid #dc2626',
                        borderRadius: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '25px'
                    }}>
                        <span style={{ fontSize: '24px' }}>{hotel.parkingAvailable ? '🅿️' : '🚫'}</span>
                        <span style={{ 
                            fontWeight: '600',
                            color: hotel.parkingAvailable ? '#14532d' : '#7f1d1d',
                            fontSize: '16px'
                        }}>
                            {hotel.parkingAvailable ? 'Free Parking Available' : 'No Parking Available'}
                        </span>
                    </div>
                </div>

                {/* Image Gallery */}
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        marginBottom: '25px',
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        📸 Hotel Gallery
                    </h2>
                    
                    {hotel.images && hotel.images.length > 0 ? (
                        <div>
                            {/* Main Featured Image */}
                            <div style={{
                                width: '100%',
                                height: '400px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 15px 40px rgba(0,0,0,0.15)',
                                marginBottom: '25px',
                                position: 'relative'
                            }}>
                                <img 
                                    src={hotel.images[0]} 
                                    alt="Main Hotel View"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '64px',
                                    color: '#64748b'
                                }}>
                                    🏨
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '20px',
                                    background: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}>
                                    Featured Image
                                </div>
                            </div>

                            {/* Thumbnail Grid */}
                            {hotel.images.length > 1 && (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '15px'
                                }}>
                                    {hotel.images.slice(1).map((image, index) => (
                                        <div key={index + 1} style={{
                                            width: '100%',
                                            height: '150px',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer',
                                            position: 'relative'
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-5px) scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.2)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                                        }}
                                        onClick={() => {
                                            // Swap main image with clicked thumbnail
                                            const newImages = [...hotel.images];
                                            [newImages[0], newImages[index + 1]] = [newImages[index + 1], newImages[0]];
                                            setHotel(prev => ({ ...prev, images: newImages }));
                                        }}
                                        >
                                            <img 
                                                src={image} 
                                                alt={`Hotel View ${index + 2}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                display: 'none',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '32px',
                                                color: '#64748b'
                                            }}>
                                                🏨
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Image Counter */}
                            <div style={{
                                textAlign: 'center',
                                marginTop: '20px',
                                padding: '12px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                                borderRadius: '25px',
                                color: '#64748b',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                📷 {hotel.images.length} Image{hotel.images.length !== 1 ? 's' : ''} Total
                            </div>
                        </div>
                    ) : (
                        <div style={{
                            width: '100%',
                            height: '400px',
                            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '64px',
                            color: '#64748b',
                            border: '2px dashed #cbd5e0'
                        }}>
                            🏨
                        </div>
                    )}
                </div>

                {/* Description */}
                <div style={{
                    background: 'white',
                    padding: '40px',
                    borderRadius: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: '700',
                        marginBottom: '25px',
                        color: '#1e293b',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        📝 About This Hotel
                    </h2>
                    <p style={{
                        color: '#475569',
                        lineHeight: '1.8',
                        fontSize: '16px',
                        margin: 0,
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '15px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {hotel.description}
                    </p>
                </div>

                {/* Rooms Section */}
                {availableRoomCategories.length > 0 && (
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '28px',
                            fontWeight: '700',
                            marginBottom: '30px',
                            color: '#1e293b',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            🛏️ Room Types & Pricing
                        </h2>
                        
                        {/* Room Tabs */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '40px',
                            borderBottom: '3px solid #f1f5f9',
                            flexWrap: 'wrap',
                            padding: '0 5px'
                        }}>
                            {availableRoomCategories.map(room => (
                                <button
                                    key={room.id}
                                    onClick={() => setSelectedRoomId(room.id)}
                                    style={{
                                        padding: '16px 24px',
                                        border: 'none',
                                        background: selectedRoomId === room.id 
                                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                                            : 'transparent',
                                        cursor: 'pointer',
                                        fontSize: '16px',
                                        fontWeight: '600',
                                        color: selectedRoomId === room.id ? 'white' : '#64748b',
                                        borderRadius: '25px 25px 0 0',
                                        transition: 'all 0.3s ease',
                                        borderBottom: selectedRoomId === room.id ? '4px solid #667eea' : '4px solid transparent',
                                        boxShadow: selectedRoomId === room.id ? '0 -4px 15px rgba(102, 126, 234, 0.3)' : 'none'
                                    }}
                                    onMouseOver={(e) => {
                                        if (selectedRoomId !== room.id) {
                                            e.target.style.background = 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)';
                                            e.target.style.color = '#334155';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (selectedRoomId !== room.id) {
                                            e.target.style.background = 'transparent';
                                            e.target.style.color = '#64748b';
                                        }
                                    }}
                                >
                                    {room.categoryName}
                                </button>
                            ))}
                        </div>

                        {/* Room Content */}
                        {currentRoom && (
                            <div style={{
                                padding: '30px',
                                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                borderRadius: '20px',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '25px',
                                    flexWrap: 'wrap',
                                    gap: '20px'
                                }}>
                                    <h3 style={{
                                        margin: '0',
                                        fontSize: '24px',
                                        color: '#1e293b',
                                        fontWeight: '700'
                                    }}>
                                        {currentRoom.categoryName}
                                    </h3>
                                    
                                    {/* Book This Room Button */}
                                    <button
                                        onClick={() => handleBookRoom(currentRoom)}
                                        style={{
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 24px',
                                            borderRadius: '25px',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.6)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                                        }}
                                    >
                                        📅 Book This Room
                                    </button>
                                </div>

                                {/* Room Info Cards */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '25px',
                                    marginBottom: '35px'
                                }}>
                                    <div style={{
                                        background: 'white',
                                        padding: '25px',
                                        borderRadius: '15px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                        border: '1px solid #e2e8f0',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                    }}
                                    >
                                        <div style={{
                                            fontSize: '32px',
                                            marginBottom: '12px'
                                        }}>🏠</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '600'
                                        }}>
                                            Total Rooms
                                        </div>
                                        <div style={{
                                            fontSize: '28px',
                                            fontWeight: '700',
                                            color: '#1e293b'
                                        }}>
                                            {currentRoom.roomCount}
                                        </div>
                                    </div>
                                    
                                    <div style={{
                                        background: 'white',
                                        padding: '25px',
                                        borderRadius: '15px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                        border: '1px solid #e2e8f0',
                                        transition: 'transform 0.3s ease',
                                        cursor: 'pointer'
                                    }}
                                    onMouseOver={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
                                    }}
                                    >
                                        <div style={{
                                            fontSize: '32px',
                                            marginBottom: '12px'
                                        }}>💰</div>
                                        <div style={{
                                            fontSize: '14px',
                                            color: '#64748b',
                                            marginBottom: '8px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '1px',
                                            fontWeight: '600'
                                        }}>
                                            Price per Night
                                        </div>
                                        <div style={{
                                            fontSize: '28px',
                                            fontWeight: '700',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text'
                                        }}>
                                            LKR {currentRoom.pricePerNight.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* Facilities */}
                                {currentRoom.facilities && currentRoom.facilities.length > 0 && (
                                    <div style={{marginBottom: '35px'}}>
                                        <h3 style={{
                                            marginBottom: '20px',
                                            color: '#1e293b',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            ✨ Room Facilities
                                        </h3>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                            gap: '15px'
                                        }}>
                                            {currentRoom.facilities.map((facility, index) => (
                                                <div key={index} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '15px',
                                                    padding: '18px',
                                                    background: 'white',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e2e8f0',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                                                    transition: 'all 0.3s ease',
                                                    cursor: 'pointer'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(5px)';
                                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.15)';
                                                    e.currentTarget.style.borderColor = '#667eea';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                                                    e.currentTarget.style.borderColor = '#e2e8f0';
                                                }}
                                                >
                                                    <span style={{
                                                        fontSize: '24px',
                                                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                                    }}>
                                                        {facilityIcons[facility] || '✓'}
                                                    </span>
                                                    <span style={{
                                                        fontWeight: '500',
                                                        color: '#374151'
                                                    }}>{facility}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Room Images */}
                                {currentRoom.images && currentRoom.images.length > 0 && (
                                    <div>
                                        <h3 style={{
                                            marginBottom: '20px',
                                            color: '#1e293b',
                                            fontSize: '20px',
                                            fontWeight: '700',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px'
                                        }}>
                                            📷 Room Images
                                        </h3>
                                        
                                        {/* Main Featured Room Image */}
                                        <div style={{
                                            width: '100%',
                                            height: '300px',
                                            borderRadius: '15px',
                                            overflow: 'hidden',
                                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                                            marginBottom: '20px',
                                            position: 'relative'
                                        }}>
                                            <img 
                                                src={currentRoom.images[0]} 
                                                alt="Main Room View"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                display: 'none',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#64748b',
                                                fontSize: '48px'
                                            }}>
                                                🛏️
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                bottom: '15px',
                                                left: '15px',
                                                background: 'rgba(0,0,0,0.7)',
                                                color: 'white',
                                                padding: '6px 12px',
                                                borderRadius: '15px',
                                                fontSize: '12px',
                                                fontWeight: '500'
                                            }}>
                                                {currentRoom.categoryName} - Main View
                                            </div>
                                        </div>

                                        {/* Room Image Thumbnails */}
                                        {currentRoom.images.length > 1 && (
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                                                gap: '15px',
                                                marginBottom: '15px'
                                            }}>
                                                {currentRoom.images.slice(1).map((image, index) => (
                                                    <div key={index + 1} style={{
                                                        width: '100%',
                                                        height: '120px',
                                                        borderRadius: '10px',
                                                        overflow: 'hidden',
                                                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                        transition: 'all 0.3s ease',
                                                        cursor: 'pointer',
                                                        position: 'relative'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)';
                                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                                    }}
                                                    onClick={() => {
                                                        // Swap main room image with clicked thumbnail
                                                        const newImages = [...currentRoom.images];
                                                        [newImages[0], newImages[index + 1]] = [newImages[index + 1], newImages[0]];
                                                        
                                                        // Update the room in the hotel data
                                                        setHotel(prev => ({
                                                            ...prev,
                                                            roomCategories: prev.roomCategories.map(room => 
                                                                room.id === currentRoom.id 
                                                                    ? { ...room, images: newImages }
                                                                    : room
                                                            )
                                                        }));
                                                    }}
                                                    >
                                                        <img 
                                                            src={image} 
                                                            alt={`${currentRoom.categoryName} View ${index + 2}`}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                transition: 'transform 0.3s ease'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.style.display = 'none';
                                                                e.target.nextSibling.style.display = 'flex';
                                                            }}
                                                        />
                                                        <div style={{
                                                            width: '100%',
                                                            height: '100%',
                                                            background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                            display: 'none',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#64748b',
                                                            fontSize: '24px'
                                                        }}>
                                                            🛏️
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}