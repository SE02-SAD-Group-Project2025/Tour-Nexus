import React from "react";
import { Link } from "react-router-dom";

const PendingApprovelCart = ({ hotel }) => {
  return (
    <div className="approval-card">
      <div className="approval-card__meta">Hotel</div>
      <h4>{hotel.hotel_name || "Hotel"}</h4>
      <p>{hotel.address || "Address not provided"}</p>
      <Link
        className="approval-card__action"
        to={"/admin/pendingapprovels/" + hotel.hotel_id}
      >
        Review details
      </Link>
    </div>
  );
};

export default PendingApprovelCart;
