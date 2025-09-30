import React from "react";
import { Link } from "react-router-dom";

const HotelCart = ({ hotel }) => {
  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            fontSize: "14px",
            color: i <= rating ? "#fbbf24" : "#d1d5db",
            textShadow: i <= rating ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
            marginRight: "1px",
          }}
        >
          ★
        </span>
      );
    }

    const getStarDescription = (stars) => {
      const descriptions = {
        1: "Budget",
        2: "Economy",
        3: "Mid-range",
        4: "Superior",
        5: "Luxury",
      };
      return descriptions[stars] || "Unrated";
    };

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>{stars}</div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          {rating}/5
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#6b7280",
            fontWeight: "500",
          }}
        >
          ({getStarDescription(rating)})
        </span>
      </div>
    );
  };

  return (
    <div className="hotel-card-container">
      <style jsx>{`
        .hotel-card-container {
          width: 100%;
          max-width: 400px;
          margin: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }

        .hotel-card-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .hotel-image-section {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .hotel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .hotel-card-container:hover .hotel-image {
          transform: scale(1.05);
        }

        .hotel-image-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          color: #64748b;
        }

        .approval-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #22c55e;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .star-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .hotel-content {
          padding: 20px;
        }

        .hotel-header {
          margin-bottom: 15px;
        }

        .hotel-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .hotel-location {
          display: flex;
          align-items: center;
          color: #64748b;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .location-icon {
          margin-right: 6px;
        }

        .hotel-id {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .hotel-description {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .room-types-section {
          margin-bottom: 15px;
        }

        .room-types-title {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .room-types-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .room-type-badge {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .hotel-price {
          font-size: 18px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 8px;
        }

        .price-label {
          font-size: 12px;
          color: #6b7280;
        }

        .hotel-contact {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 15px;
        }

        .contact-icon {
          margin-right: 6px;
        }

        .hotel-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-view-details {
          flex: 1;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          text-align: center;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-view-details:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
          text-decoration: none;
          color: white;
        }

        .btn-edit {
          background: transparent;
          color: #3b82f6;
          border: 2px solid #3b82f6;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-edit:hover {
          background: #3b82f6;
          color: white;
        }

        .btn-delete {
          background: transparent;
          color: #ef4444;
          border: 2px solid #ef4444;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-delete:hover {
          background: #ef4444;
          color: white;
        }

        .registration-info {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 10px;
        }

        .parking-info {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
        }

        .parking-icon {
          margin-right: 6px;
        }

        .star-rating-section {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 15px;
          border: 1px solid #f59e0b20;
        }
      `}</style>

      <div className="hotel-image-section">
        {hotel.images && hotel.images.length > 0 ? (
          <img
            src={hotel.images[0]}
            alt={`${hotel.hotel_name} view`}
            className="hotel-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <div className="hotel-image-placeholder">🏨</div>
        )}
        <div className="hotel-image-placeholder" style={{ display: "none" }}>
          🏨
        </div>

        {/* Star Badge on Image */}
        {hotel.star && (
          <div className="star-badge">
            <span style={{ color: "#fbbf24", fontSize: "14px" }}>★</span>
            <span>{hotel.star}/5</span>
          </div>
        )}

        <div className="approval-badge">APPROVED</div>
      </div>

      <div className="hotel-content">
        <div className="hotel-header">
          <div className="hotel-name">{hotel.hotel_name}</div>
          <div className="hotel-location">
            <span className="location-icon">📍</span>
            {hotel.city}
          </div>
        </div>

        {hotel.star && (
          <div className="star-rating-section">
            {renderStarRating(hotel.star)}
          </div>
        )}

        <div className="hotel-description">{hotel.description}</div>

        {hotel.room_types && hotel.room_types.length > 0 && (
          <div className="room-types-section">
            <div className="room-types-title">
              Room Types ({hotel.room_types.length}):
            </div>
            <div className="room-types-list">
              {hotel.room_types.slice(0, 3).map((room, index) => (
                <span key={index} className="room-type-badge">
                  {room.name}: LKR {room.price?.toLocaleString()}
                </span>
              ))}
              {hotel.room_types.length > 3 && (
                <span className="room-type-badge">
                  +{hotel.room_types.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="hotel-price">
          LKR {(hotel.room_types?.[0]?.price || 0).toLocaleString()}
          <span className="price-label">/night</span>
        </div>

        <div className="hotel-contact">
          <span className="contact-icon">📞</span>
          {hotel.contact_number}
        </div>

        <div className="registration-info">
          📅 Registered:{" "}
          {hotel.date ? new Date(hotel.date).toLocaleDateString() : "N/A"}
        </div>

        {hotel.parking_available && (
          <div className="parking-info">
            <span className="parking-icon">🅿️</span>
            Free Parking Available
          </div>
        )}

        <div className="hotel-actions">
          <Link
            to={"/tourist/viewhotel/" + hotel.hotel_id}
            className="btn-view-details"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCart;
