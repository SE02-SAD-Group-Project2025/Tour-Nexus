import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

export default function RequestedGuideDetails() {
    const params = useParams();
    const guide_id = params.guide_id;
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_URL}/api/guide/view_guides_by_id/${guide_id}`
                );
                
                console.log(response.data);
                
                // Transform the data to match component expectations based on your schema
                const transformedGuide = {
                    id: response.data._id,
                    guide_id: response.data.guide_id,
                    name: response.data.full_name,
                    email: response.data.email,
                    phone: response.data.contact_number,
                    age: response.data.age,
                    gender: response.data.gender,
                    bio: response.data.bio,
                    experience: response.data.years_of_experience,
                    licenseNo: response.data.guide_license_no,
                    languages: response.data.languages || [],
                    specialities: response.data.specialities || [],
                    areaCover: response.data.area_cover || [],
                    profileImage: response.data.profile_image,
                    status: response.data.status,
                    dailyRate: response.data.daily_rate,
                    hourlyRate: response.data.hourly_rate,
                    date: response.data.date
                };
                
                setGuide(transformedGuide);
                setError(null);
            } catch (error) {
                console.error("Error fetching guide details:", error);
                setError("Failed to load guide details");
                toast.error("Something went wrong! Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (guide_id) {
            fetchGuideDetails();
        }
    }, [guide_id]);

    // Language and specialization icons
    const languageIcons = {
        'English': '🇺🇸',
        'Sinhala': '🇱🇰',
        'Tamil': '🇱🇰',
        'German': '🇩🇪',
        'French': '🇫🇷',
        'Spanish': '🇪🇸',
        'Italian': '🇮🇹',
        'Japanese': '🇯🇵',
        'Chinese': '🇨🇳',
        'Russian': '🇷🇺'
    };

    const specializationIcons = {
        'Cultural Tours': '🏛️',
        'Adventure Tours': '🏔️',
        'Wildlife Tours': '🦁',
        'Historical Tours': '📜',
        'Nature Tours': '🌿',
        'Beach Tours': '🏖️',
        'Food Tours': '🍛',
        'Photography Tours': '📸',
        'Spiritual Tours': '🙏',
        'City Tours': '🏙️'
    };

    // Functions
    const goBack = () => {
        window.history.back();
    };

    const approveGuide = async () => {
        if (confirm(`Approve ${guide.name}?`)) {
            try {
                const token = localStorage.getItem('token');
                
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/guide/approve_guide/${guide.guide_id}`,
                    { status: 'approved' },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success(`${guide.name} approved successfully!`);
                setGuide(prev => ({ ...prev, status: 'approved' }));
            } catch (error) {
                console.error("Error approving guide:", error);
                if (error.response?.status === 403) {
                    toast.error("You don't have permission to approve guides. Admin access required.");
                } else {
                    toast.error("Failed to approve guide");
                }
            }
        }
    };

    const rejectGuide = async () => {
        const reason = prompt(`Reason for rejecting ${guide.name}:`);
        if (reason) {
            try {
                const token = localStorage.getItem('token');
                
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_URL}/api/guide/reject_guide/${guide.guide_id}`,
                    { status: 'rejected', rejectionReason: reason },
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                toast.success(`${guide.name} rejected. Reason: ${reason}`);
                setGuide(prev => ({ ...prev, status: 'rejected' }));
            } catch (error) {
                console.error("Error rejecting guide:", error);
                if (error.response?.status === 403) {
                    toast.error("You don't have permission to reject guides. Admin access required.");
                } else {
                    toast.error("Failed to reject guide");
                }
            }
        }
    };

    // Status color helper
    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return '#28a745';
            case 'rejected': return '#dc3545';
            case 'pending': return '#ffc107';
            default: return '#6c757d';
        }
    };

    // Loading state
    if (loading) {
        return (
            <div style={{
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
                    <div style={{ fontSize: '18px', color: '#666' }}>Loading guide details...</div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !guide) {
        return (
            <div style={{
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#f8f9fa',
                minHeight: '100vh',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                        {error || 'Guide not found'}
                    </div>
                    <button onClick={goBack} style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f8f9fa',
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
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginBottom: '30px',
                        fontSize: '14px'
                    }}
                >
                    ← Back to Guides
                </button>

                {/* Guide Header */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: '1px solid #ddd'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '20px'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: 'bold',
                            margin: '0'
                        }}>
                            {guide.name}
                        </h1>
                        
                        {/* Status Badge */}
                        <div style={{
                            padding: '8px 16px',
                            borderRadius: '20px',
                            backgroundColor: getStatusColor(guide.status),
                            color: 'white',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            fontSize: '12px'
                        }}>
                            {guide.status}
                        </div>
                    </div>

                    {/* Guide Basic Info */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '15px',
                        marginBottom: '20px',
                        padding: '15px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div>
                            <strong>Guide ID:</strong> {guide.guide_id}
                        </div>
                        <div>
                            <strong>Email:</strong> {guide.email}
                        </div>
                        <div>
                            <strong>Phone:</strong> {guide.phone}
                        </div>
                        <div>
                            <strong>Age:</strong> {guide.age} years
                        </div>
                        <div>
                            <strong>Gender:</strong> {guide.gender}
                        </div>
                        <div>
                            <strong>Experience:</strong> {guide.experience} years
                        </div>
                        <div>
                            <strong>License No:</strong> {guide.licenseNo}
                        </div>
                        <div>
                            <strong>Registration Date:</strong> {new Date(guide.date).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Approval Buttons - Only show if status is pending */}
                    {guide.status === 'pending' && (
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center'
                        }}>
                            <button 
                                onClick={approveGuide}
                                style={{
                                    background: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px 30px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Approve Guide
                            </button>
                            <button 
                                onClick={rejectGuide}
                                style={{
                                    background: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    padding: '15px 30px',
                                    borderRadius: '6px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer'
                                }}
                            >
                                Reject Guide
                            </button>
                        </div>
                    )}
                </div>

                {/* Profile Image */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: '1px solid #ddd'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#333',
                        margin: '0 0 20px 0'
                    }}>
                        Profile Photo
                    </h2>
                    
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        {guide.profileImage ? (
                            <div style={{
                                width: '300px',
                                height: '300px',
                                borderRadius: '50%',
                                overflow: 'hidden',
                                border: '3px solid #ddd'
                            }}>
                                <img 
                                    src={guide.profileImage} 
                                    alt={guide.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    background: '#f0f0f0',
                                    display: 'none',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '64px',
                                    color: '#999'
                                }}>
                                    👤
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                width: '300px',
                                height: '300px',
                                background: '#f0f0f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '64px',
                                color: '#999'
                            }}>
                                👤
                            </div>
                        )}
                    </div>
                </div>

                {/* Bio */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: '1px solid #ddd'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#333',
                        margin: '0 0 20px 0'
                    }}>
                        About This Guide
                    </h2>
                    <p style={{
                        color: '#666',
                        lineHeight: '1.8',
                        fontSize: '16px',
                        margin: 0
                    }}>
                        {guide.bio}
                    </p>
                </div>

                {/* Rates */}
                <div style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '10px',
                    marginBottom: '30px',
                    border: '1px solid #ddd'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#333',
                        margin: '0 0 20px 0'
                    }}>
                        Pricing
                    </h2>
                    
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px'
                    }}>
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Daily Rate
                            </div>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#28a745'
                            }}>
                                LKR {guide.dailyRate.toLocaleString()}
                            </div>
                        </div>
                        
                        <div style={{
                            background: '#f8f9fa',
                            padding: '20px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{
                                fontSize: '14px',
                                color: '#666',
                                marginBottom: '8px',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                Hourly Rate
                            </div>
                            <div style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                color: '#007bff'
                            }}>
                                LKR {guide.hourlyRate.toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Languages */}
                {guide.languages && guide.languages.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        marginBottom: '30px',
                        border: '1px solid #ddd'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#333',
                            margin: '0 0 20px 0'
                        }}>
                            Languages
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            {guide.languages.map((language, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <span style={{fontSize: '20px'}}>
                                        {languageIcons[language] || '🗣️'}
                                    </span>
                                    <span>{language}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Specialities */}
                {guide.specialities && guide.specialities.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        marginBottom: '30px',
                        border: '1px solid #ddd'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#333',
                            margin: '0 0 20px 0'
                        }}>
                            Specialities
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            {guide.specialities.map((specialty, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <span style={{fontSize: '20px'}}>
                                        {specializationIcons[specialty] || '⭐'}
                                    </span>
                                    <span>{specialty}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Area Coverage */}
                {guide.areaCover && guide.areaCover.length > 0 && (
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        border: '1px solid #ddd'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            color: '#333',
                            margin: '0 0 20px 0'
                        }}>
                            Area Coverage
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: '15px'
                        }}>
                            {guide.areaCover.map((area, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '15px',
                                    background: '#f8f9fa',
                                    borderRadius: '6px',
                                    border: '1px solid #e9ecef'
                                }}>
                                    <span style={{fontSize: '20px'}}>📍</span>
                                    <span>{area}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}