import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import GuideBookingForm from './guider_booking_form';

export default function TouristViewGuideDetails() {
  const params = useParams();
  const guide_id = params.guide_id;
  const { state } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    
    
    const fetchGuideDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/guide/view_guides_by_id/${guide_id}`
        );

        const transformedGuide = {
          id: response.data._id,
          guide_id: response.data.guide_id,
          email: response.data.email,
          full_name: response.data.full_name,
          age: response.data.age,
          gender: response.data.gender,
          years_of_experience: response.data.years_of_experience,
          guide_license_no: response.data.guide_license_no,
          contact_number: response.data.contact_number,
          bio: response.data.bio,
          profile_image: response.data.profile_image,
          languages: response.data.languages || [],
          specialities: response.data.specialities || [],
          area_cover: response.data.area_cover || [],
          daily_rate: response.data.daily_rate,
          hourly_rate: response.data.hourly_rate,
          status: response.data.status,
          date: response.data.date,
          rating: response.data.rating || 4.8, // Assuming rating is added to guideSchema
          total_reviews: response.data.total_reviews || 127, // Assuming total_reviews is added
        };

        setGuide(transformedGuide);
        setError(null);
      } catch (error) {
        console.error('Error fetching guide details:', error);
        setError('Failed to load guide details');
        toast.error('Something went wrong! Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (guide_id) {
      fetchGuideDetails();
    }
  }, [guide_id]);

  const languageIcons = {
    English: '🇺🇸',
    Sinhala: '🇱🇰',
    Tamil: '🇱🇰',
    German: '🇩🇪',
    French: '🇫🇷',
    Spanish: '🇪🇸',
    Italian: '🇮🇹',
    Japanese: '🇯🇵',
    Chinese: '🇨🇳',
    Russian: '🇷🇺',
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
    'City Tours': '🏙️',
  };

  const goBack = () => {
    navigate(-1);
  };

  const handleBookGuide = () => {
    setShowBookingForm(true);
  };

  const handleBookingSubmit = (bookingData) => {
    // Optional: Handle any additional logic after booking submission
    setShowBookingForm(false);
  };

  const handleBookingCancel = () => {
    setShowBookingForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#28a745';
      case 'rejected':
        return '#dc3545';
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>👥</div>
          <div style={{ fontSize: '18px', color: '#666' }}>Loading guide details...</div>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>❌</div>
          <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>{error || 'Guide not found'}</div>
          <button onClick={goBack} style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  if (showBookingForm) {
    return (
      <GuideBookingForm
        guide={guide}
        selectedDates={{
          checkInDate: state?.searchCriteria?.checkInDate || searchParams.get('checkInDate') || '',
          checkOutDate: state?.searchCriteria?.checkOutDate || searchParams.get('checkOutDate') || '',
        }}
        onSubmit={handleBookingSubmit}
        onCancel={handleBookingCancel}
      />
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            fontSize: '14px',
          }}
        >
          ← Back to Guides
        </button>

        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #ddd' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>{guide.full_name}</h1>
            <div style={{ padding: '8px 16px', borderRadius: '20px', backgroundColor: guide.status === 'approved' ? '#28a745' : guide.status === 'rejected' ? '#dc3545' : '#ffc107', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '12px' }}>{guide.status}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <div><strong>Guide ID:</strong> {guide.guide_id}</div>
            <div><strong>Email:</strong> {guide.email}</div>
            <div><strong>Phone:</strong> {guide.contact_number}</div>
            <div><strong>Age:</strong> {guide.age} years</div>
            <div><strong>Gender:</strong> {guide.gender}</div>
            <div><strong>Experience:</strong> {guide.years_of_experience} years</div>
            <div><strong>License No:</strong> {guide.guide_license_no}</div>
            <div><strong>Registration Date:</strong> {new Date(guide.date).toLocaleDateString()}</div>
          </div>
          {guide.status === 'approved' && (
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button onClick={handleBookGuide} style={{ background: '#007bff', color: 'white', border: 'none', padding: '15px 30px', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Book Guide</button>
            </div>
          )}
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
            border: '1px solid #ddd',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            Profile Photo
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {guide.profile_image ? (
              <div
                style={{
                  width: '300px',
                  height: '300px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '3px solid #ddd',
                }}
              >
                <img
                  src={guide.profile_image}
                  alt={guide.full_name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: '#f0f0f0',
                    display: 'none',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '64px',
                    color: '#999',
                  }}
                >
                  👤
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: '300px',
                  height: '300px',
                  background: '#f0f0f0',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  color: '#999',
                }}
              >
                👤
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
            border: '1px solid #ddd',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            About This Guide
          </h2>
          <p style={{ color: '#666', lineHeight: '1.8', fontSize: '16px', margin: 0 }}>
            {guide.bio}
          </p>
        </div>

        <div
          style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            marginBottom: '30px',
            border: '1px solid #ddd',
          }}
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
            Pricing
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div
              style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #e9ecef',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Daily Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
                LKR {guide.daily_rate.toLocaleString()}
              </div>
            </div>
            <div
              style={{
                background: '#f8f9fa',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                border: '1px solid #e9ecef',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  color: '#666',
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Hourly Rate
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>
                LKR {guide.hourly_rate.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {guide.languages && guide.languages.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              marginBottom: '30px',
              border: '1px solid #ddd',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
              Languages
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {guide.languages.map((language, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{languageIcons[language] || '🗣️'}</span>
                  <span>{language}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {guide.specialities && guide.specialities.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              marginBottom: '30px',
              border: '1px solid #ddd',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
              Specialities
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {guide.specialities.map((specialty, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>{specializationIcons[specialty] || '⭐'}</span>
                  <span>{specialty}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {guide.area_cover && guide.area_cover.length > 0 && (
          <div
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '10px',
              border: '1px solid #ddd',
            }}
          >
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>
              Preferred Areas
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {guide.area_cover.map((area, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>📍</span>
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
