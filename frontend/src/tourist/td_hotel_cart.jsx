import React from "react";
import { Link } from "react-router-dom";

const HotelCart = ({ hotel }) => {
    return (
        <div className="card p-3 m-2 shadow-sm" style={{ width: '300px', borderRadius: '12px', background: 'white', border: '1px solid #ddd' }}>
            <style jsx>{`
                .hotel-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .hotel-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.1);
                }
                
                .hotel-image {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }
                
                .hotel-image-placeholder {
                    width: 100%;
                    height: 150px;
                    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
                    border-radius: 8px;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    color: #64748b;
                }
                
                .hotel-name {
                    font-size: 18px;
                    font-weight: 700;
                    color: #1e293b;
                    margin-bottom: 8px;
                }
                
                .hotel-price {
                    font-size: 14px;
                    font-weight: 600;
                    color: #10b981;
                    margin-bottom: 10px;
                }
                
                .hotel-description {
                    font-size: 13px;
                    color: #475569;
                    margin-bottom: 10px;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .hotel-info {
                    font-size: 12px;
                    color: #64748b;
                    margin-bottom: 8px;
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    width: 100%;
                    text-align: center;
                    text-decoration: none;
                    display: block;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                }
            `}</style>

            <div className="hotel-card">
                {hotel.images && hotel.images.length > 0 ? (
                    <img 
                        src={hotel.images[0]} 
                        alt={`${hotel.hotel_name} view`} 
                        className="hotel-image"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : (
                    <div className="hotel-image-placeholder">🏨</div>
                )}
                <div className="hotel-image-placeholder" style={{display: 'none'}}>🏨</div>
                
                <div className="hotel-name">{hotel.hotel_name}</div>
                <div className="hotel-price">
                    LKR {(hotel.room_types[0]?.price || 0).toLocaleString()}/night
                </div>
                <div className="hotel-description">{hotel.description}</div>
                <div className="hotel-info">📍 {hotel.city}</div>
                <div className="hotel-info">📞 {hotel.contact_number}</div>
                
                <button className="btn btn-primary mt-2">
                                <Link to={"/tourist/viewhotel/" + hotel.hotel_id} >
                                View Details
                                </Link>
                            </button>
            </div>
        </div>
    );
};

export default HotelCart;