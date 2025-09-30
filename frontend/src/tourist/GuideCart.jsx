import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GuideCart = ({ guide, searchCriteria }) => {
  const navigate = useNavigate();
  

  const handleViewDetails = () => {
    console.log('Button clicked in GuideCart'); // Log button click
    if (!searchCriteria || !searchCriteria.checkInDate || !searchCriteria.checkOutDate) {
      console.error('Invalid searchCriteria:', searchCriteria);
      return;
    }
    const checkInDateEncoded = encodeURIComponent(searchCriteria.checkInDate);
    const checkOutDateEncoded = encodeURIComponent(searchCriteria.checkOutDate);
    const url = `/tourist/viewguide/${guide._id || guide.guide_id}?checkInDate=${checkInDateEncoded}&checkOutDate=${checkOutDateEncoded}`;
    console.log('Navigating to:', url); // Log the target URL
    console.log('Navigating with searchCriteria:', searchCriteria); // Log searchCriteria
    try {
      navigate(url, {
        state: {
          guide,
          searchCriteria,
        },
      });
      console.log('Navigation attempted successfully'); // Confirm navigation
    } catch (error) {
      console.error('Navigation failed:', error);
    }
  };

  // Verify rendering
  useEffect(() => {
    console.log('GuideCart rendered with guide:', guide, 'searchCriteria:', searchCriteria);
  }, [guide, searchCriteria]);

  return (
    <div className="guide-card" style={{ background: 'white', padding: '20px', border: '1px solid #ddd', margin: '10px' }}>
      <h3>{guide.full_name}</h3>
      <p>Languages: {guide.languages?.join(', ')}</p>
      <p>Price per day: LKR {guide.daily_rate?.toLocaleString()}</p>
      <button
        className="btn btn-primary"
        onClick={handleViewDetails}
        style={{ marginTop: '10px' }}
      >
        View Details
      </button>
    </div>
  );
};

export default GuideCart;