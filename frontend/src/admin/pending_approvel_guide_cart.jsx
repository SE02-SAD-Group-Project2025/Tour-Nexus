import React from "react";
import { Link } from "react-router-dom";

const PendingGuideCart = ({ guide }) => {
    return (
        <div className="card p-3 m-2 shadow-sm" style={{ width: '300px' }}>
                    <h4 className="mb-2">Name: {guide.full_name}</h4>
                    <p className="text-muted">Experience: {guide.years_of_experience} years</p>
                    <button className="btn btn-primary mt-2">
                        <Link to={"/admin/pendingapprovels/guide/" + guide.guide_id} >
                        
                        View Details
                        </Link>
                    </button>
                </div>
    );
};

export default PendingGuideCart;