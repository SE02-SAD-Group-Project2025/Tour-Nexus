import axios from "axios";
import { useEffect, useState } from "react";
import PendingApprovelCart from "./pending_approvel_hotel_cart";
import PendingGuideCart from "./pending_approvel_guide_cart";

export default function PendingApprovalsPage() {
  const [stats, setStats] = useState({
    hotels: { pending: 0, approved: 0, rejected: 0 },
    guides: { pending: 0, approved: 0, rejected: 0 },
    vehicles: { pending: 0, approved: 0, rejected: 0 },
  });

  const [hotels, setHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch stats
        const hotelStatsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/hotel/stats"
        );
        const guideStatsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/guide/stats"
        );

        // Fetch pending data
        const hotelsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/hotel/view_pending_hotels"
        );
        const guidesResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/guide/view_pending_guides"
        );

        // Update stats with real data
        setStats({
          hotels: hotelStatsResponse.data,
          guides: guideStatsResponse.data,
          vehicles: { pending: 0, approved: 0, rejected: 0 }, // Keep 0 until you implement vehicles
        });

        // Update data
        setHotels(hotelsResponse.data);
        setGuides(guidesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
          <div style={{ fontSize: "18px", color: "#666" }}>
            Loading pending approvals...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Page Header */}
        <div
          style={{
            background: "white",
            padding: "20px",
            border: "1px solid #ddd",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Go Back
          </button>
          <div>
            <h1 style={{ fontSize: "28px", margin: "0 0 10px 0" }}>
              Pending Approvals
            </h1>
            <p style={{ color: "#666", margin: 0 }}>
              Review pending registrations for all roles
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "30px",
            marginBottom: "30px",
          }}
        >
          {/* Hotels Stats */}
          <div
            style={{
              background: "white",
              padding: "25px",
              border: "1px solid #ddd",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                textAlign: "center",
                margin: "0 0 15px 0",
              }}
            >
              🏨 Hotels
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
                  {stats.hotels.pending}
                </div>
                <div style={{ fontSize: "12px" }}>Pending</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {stats.hotels.approved}
                </div>
                <div style={{ fontSize: "12px" }}>Approved</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#dc3545",
                  }}
                >
                  {stats.hotels.rejected}
                </div>
                <div style={{ fontSize: "12px" }}>Rejected</div>
              </div>
            </div>
          </div>

          {/* Guides Stats */}
          <div
            style={{
              background: "white",
              padding: "25px",
              border: "1px solid #ddd",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                textAlign: "center",
                margin: "0 0 15px 0",
              }}
            >
              👥 Tour Guides
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
                  {stats.guides.pending}
                </div>
                <div style={{ fontSize: "12px" }}>Pending</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {stats.guides.approved}
                </div>
                <div style={{ fontSize: "12px" }}>Approved</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#dc3545",
                  }}
                >
                  {stats.guides.rejected}
                </div>
                <div style={{ fontSize: "12px" }}>Rejected</div>
              </div>
            </div>
          </div>

          {/* Vehicle Rental Companies Stats */}
          <div
            style={{
              background: "white",
              padding: "25px",
              border: "1px solid #ddd",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                textAlign: "center",
                margin: "0 0 15px 0",
              }}
            >
              🚗 Vehicle Rental Companies
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                textAlign: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#ffc107",
                  }}
                >
                  {stats.vehicles.pending}
                </div>
                <div style={{ fontSize: "12px" }}>Pending</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#28a745",
                  }}
                >
                  {stats.vehicles.approved}
                </div>
                <div style={{ fontSize: "12px" }}>Approved</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#dc3545",
                  }}
                >
                  {stats.vehicles.rejected}
                </div>
                <div style={{ fontSize: "12px" }}>Rejected</div>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Pending Hotels
          </h2>
          <div className="w-100 d-flex justify-content-start align-items-start flex-wrap">
            {hotels.map((hotel) => {
              return (
                <PendingApprovelCart
                  key={hotel._id || hotel.hotel_id}
                  hotel={hotel}
                />
              );
            })}
          </div>
        </div>

        {/* Guides Section */}
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>
            Pending Tour Guides
          </h2>
          <div className="w-100 d-flex justify-content-start align-items-start flex-wrap">
            {guides.map((guide) => {
              return (
                <PendingGuideCart
                  key={guide._id || guide.guide_id}
                  guide={guide}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
