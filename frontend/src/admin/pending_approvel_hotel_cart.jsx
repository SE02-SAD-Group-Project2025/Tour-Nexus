import React from "react";
import { Link } from "react-router-dom";

const PendingApprovelCart = ({ hotel }) => {
    return (
        <div className="card p-3 m-2 shadow-sm" style={{ width: '300px' }}>
            <h4 className="mb-2">{hotel.hotel_name}</h4>
            <p className="text-muted">{hotel.address}</p>
            <button className="btn btn-primary mt-2">
                <Link to={"/admin/pendingapprovels/" + hotel.hotel_id} >
                View Details
                </Link>
            </button>
        </div>
    );
};

export default PendingApprovelCart;
