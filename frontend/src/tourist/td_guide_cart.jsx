import React from "react";
import { Link } from "react-router-dom";

const GuideCart = ({ guide, searchCriteria }) => {
  return (
    <div className="guide-card-container">
      <style jsx>{`
        .guide-card-container {
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

        .guide-card-container:hover {
          transform: translateY(-8px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .guide-image-section {
          position: relative;
          height: 220px;
          overflow: hidden;
        }

        .guide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .guide-card-container:hover .guide-image {
          transform: scale(1.05);
        }

        .guide-image-placeholder {
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

        .online-status {
          position: absolute;
          top: 12px;
          left: 12px;
          background: #10b981;
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .guide-content {
          padding: 20px;
        }

        .guide-header {
          margin-bottom: 15px;
        }

        .guide-name {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.3;
        }

        .guide-location {
          display: flex;
          align-items: flex-start;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 8px;
          line-height: 1.4;
        }

        .location-icon {
          margin-right: 6px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        .location-text {
          flex: 1;
          word-break: break-word;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .guide-id {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .guide-description {
          font-size: 14px;
          color: #475569;
          line-height: 1.5;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .languages-section {
          margin-bottom: 15px;
        }

        .languages-title {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .languages-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .language-badge {
          background: #eff6ff;
          color: #2563eb;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
        }

        .experience-section {
          margin-bottom: 15px;
        }

        .experience-item {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 6px;
        }

        .experience-icon {
          margin-right: 8px;
          font-size: 14px;
        }

        .guide-rating {
          display: flex;
          align-items: center;
          font-size: 14px;
          margin-bottom: 15px;
        }

        .rating-stars {
          color: #f59e0b;
          margin-right: 6px;
        }

        .rating-score {
          font-weight: 600;
          color: #374151;
          margin-right: 4px;
        }

        .rating-count {
          color: #6b7280;
          font-size: 12px;
        }

        .guide-contact {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 15px;
        }

        .contact-icon {
          margin-right: 6px;
        }

        .guide-price {
          font-size: 18px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 8px;
        }

        .price-label {
          font-size: 12px;
          color: #6b7280;
        }

        .availability-info {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 15px;
          text-align: center;
        }

        .guide-actions {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-view-details {
          flex: 1;
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
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
          box-shadow: 0 6px 20px rgba(5, 150, 105, 0.4);
          text-decoration: none;
          color: white;
        }

        .btn-message {
          background: transparent;
          color: #059669;
          border: 2px solid #059669;
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

        .btn-message:hover {
          background: #059669;
          color: white;
        }

        .btn-favorite {
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

        .btn-favorite:hover {
          background: #ef4444;
          color: white;
        }

        .registration-info {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 10px;
        }
      `}</style>

      <div className="guide-image-section">
        {guide.profile_image && guide.profile_image.length > 0 ? (
          <img
            src={guide.profile_image}
            alt={`${guide.full_name} profile`}
            className="guide-image"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : (
          <div className="guide-image-placeholder">👨‍🦱</div>
        )}
        <div className="guide-image-placeholder" style={{ display: "none" }}>
          👨‍🦱
        </div>

        <div className="approval-badge">APPROVED</div>
        <div className="online-status">
          <div className="status-dot"></div>
          Available
        </div>
      </div>

      <div className="guide-content">
        <div className="guide-header">
          <div className="guide-name">{guide.full_name}</div>
          <div className="guide-location">
            <span className="location-icon">🗺️</span>
            <span className="location-text" title={guide.area_cover}>
              {guide.area_cover}
            </span>
          </div>
          <div className="guide-id">ID: {guide.guide_id}</div>
        </div>

        <div className="guide-description">{guide.description}</div>

        {guide.languages && guide.languages.length > 0 && (
          <div className="languages-section">
            <div className="languages-title">Languages Spoken:</div>
            <div className="languages-list">
              {guide.languages.slice(0, 4).map((language, index) => (
                <span key={index} className="language-badge">
                  {language}
                </span>
              ))}
              {guide.languages.length > 4 && (
                <span className="language-badge">
                  +{guide.languages.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="experience-section">
          <div className="experience-item">
            <span className="experience-icon">🎯</span>
            {guide.experience || "5+"} years experience
          </div>
          <div className="experience-item">
            <span className="experience-icon">👥</span>
            {guide.group_size || "Small"} groups preferred
          </div>
          <div className="experience-item">
            <span className="experience-icon">🚗</span>
            {guide.transport_mode || "Multiple"} transport options
          </div>
        </div>

        <div className="guide-rating">
          <span className="rating-stars">⭐⭐⭐⭐⭐</span>
          <span className="rating-score">{guide.rating || "4.8"}</span>
          <span className="rating-count">
            ({guide.review_count || "156"} reviews)
          </span>
        </div>

        <div className="guide-price">
          LKR {(guide.daily_rate || 8500).toLocaleString()}
          <span className="price-label">/day</span>
        </div>

        <div className="guide-contact">
          <span className="contact-icon">📞</span>
          {guide.contact_number}
        </div>

        {searchCriteria && (
          <div className="availability-info">
            ✅ Available: {searchCriteria.checkInDate} →{" "}
            {searchCriteria.checkOutDate}
          </div>
        )}

        <div className="registration-info">
          📅 Member since:{" "}
          {guide.registration_date
            ? new Date(guide.registration_date).getFullYear()
            : "2020"}
        </div>

        <div className="guide-actions">
          <Link
            to={"/tourist/viewguide/" + guide.guide_id}
            className="btn-view-details"
          >
            View Profile
          </Link>
          <button className="btn-message" title="Send Message">
            💬
          </button>
          <button className="btn-favorite" title="Add to Favorites">
            ❤️
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuideCart;
