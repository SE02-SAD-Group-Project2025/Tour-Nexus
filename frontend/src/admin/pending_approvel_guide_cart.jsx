import React from "react";
import { Link } from "react-router-dom";

const PendingGuideCart = ({ guide }) => {
  const experience = guide.years_of_experience
    ? `${guide.years_of_experience} years experience`
    : "Experience not provided";

  return (
    <div className="approval-card">
      <div className="approval-card__meta">Tour Guide</div>
      <h4>{guide.full_name || "Guide"}</h4>
      <p>{experience}</p>
      <Link
        className="approval-card__action"
        to={"/admin/pendingapprovels/guide/" + guide.guide_id}
      >
        Review details
      </Link>
    </div>
  );
};

export default PendingGuideCart;
