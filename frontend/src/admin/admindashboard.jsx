import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // Mock navigate function for demonstration

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Are you sure you want to logout?")) {
      return;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div>
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap");

        :root {
          --bg: #f4efe6;
          --bg-2: #e6f1ea;
          --panel: rgba(255, 255, 255, 0.92);
          --panel-solid: #ffffff;
          --panel-border: rgba(15, 23, 42, 0.08);
          --ink: #1f2937;
          --muted: #5b6472;
          --brand: #0f766e;
          --brand-2: #14532d;
          --accent: #d97706;
          --danger: #b42318;
          --shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
          --shadow-soft: 0 8px 20px rgba(15, 23, 42, 0.08);
          --ring: 0 0 0 4px rgba(15, 118, 110, 0.15);
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Manrope", "Segoe UI", Tahoma, sans-serif;
          background: var(--bg);
          color: var(--ink);
          min-height: 100vh;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--bg), var(--bg-2));
          position: relative;
          overflow: hidden;
        }

        .dashboard-container::before {
          content: "";
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(15, 118, 110, 0.2),
            transparent 65%
          );
          top: -120px;
          right: -120px;
          animation: float 14s ease-in-out infinite;
        }

        .dashboard-container::after {
          content: "";
          position: absolute;
          width: 420px;
          height: 420px;
          border-radius: 32%;
          background: radial-gradient(
            circle at 70% 30%,
            rgba(217, 119, 6, 0.18),
            transparent 60%
          );
          bottom: -160px;
          left: -120px;
          animation: float 18s ease-in-out infinite reverse;
        }

        .header {
          background: var(--panel);
          backdrop-filter: blur(14px);
          padding: 26px 32px;
          border-bottom: 1px solid var(--panel-border);
          box-shadow: var(--shadow-soft);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left h1 {
          font-size: clamp(26px, 3vw, 34px);
          margin-bottom: 6px;
          background: linear-gradient(90deg, var(--brand), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .header-left p {
          color: var(--muted);
          font-size: 16px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .controls select,
        .controls button {
          font-family: inherit;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid var(--panel-border);
          background: var(--panel-solid);
          color: var(--ink);
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.2s ease, box-shadow 0.2s ease,
            border-color 0.2s ease;
          box-shadow: var(--shadow-soft);
        }

        .controls select {
          appearance: none;
          padding-right: 34px;
          background-image: linear-gradient(
              45deg,
              transparent 50%,
              var(--muted) 50%
            ),
            linear-gradient(135deg, var(--muted) 50%, transparent 50%);
          background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%;
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
        }

        .controls button {
          background: linear-gradient(135deg, var(--brand), #1e9e8b);
          color: #fff;
          border: none;
          box-shadow: 0 12px 25px rgba(15, 118, 110, 0.25);
        }

        .controls select:hover,
        .controls button:hover {
          transform: translateY(-2px);
          border-color: rgba(15, 118, 110, 0.35);
          box-shadow: var(--shadow);
        }

        .controls select:focus,
        .controls button:focus {
          outline: none;
          box-shadow: var(--ring);
        }

        .logout-btn {
          padding: 12px 22px;
          background: linear-gradient(135deg, #ef4444, var(--danger));
          color: #fff;
          border: none;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 14px 26px rgba(180, 35, 24, 0.25);
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px rgba(180, 35, 24, 0.3);
        }

        .dashboard-content {
          padding: 44px 30px 60px;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          margin-bottom: 42px;
        }

        .stat-card {
          background: var(--panel);
          padding: 28px;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--panel-border);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.6s ease both;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--brand), var(--accent));
        }

        .stat-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow);
        }

        .stat-card h3 {
          font-size: 13px;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 12px;
          letter-spacing: 0.18em;
          font-weight: 700;
        }

        .stat-card .number {
          font-size: 40px;
          font-weight: 800;
          color: var(--brand);
          margin-bottom: 8px;
        }

        .sections-container {
          display: grid;
          gap: 28px;
        }

        .quick-actions,
        .management-section {
          background: var(--panel);
          padding: 34px;
          border-radius: 18px;
          box-shadow: var(--shadow-soft);
          border: 1px solid var(--panel-border);
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.7s ease both;
        }

        .section-header {
          margin-bottom: 26px;
        }

        .section-header h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: var(--ink);
          font-weight: 700;
        }

        .section-header p {
          color: var(--muted);
          font-size: 15px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .action-card {
          padding: 24px;
          border: 1px solid rgba(15, 118, 110, 0.15);
          border-radius: 14px;
          text-align: left;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease,
            border-color 0.25s ease;
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.08),
            rgba(217, 119, 6, 0.06)
          );
          position: relative;
          overflow: hidden;
          animation: fadeUp 0.7s ease both;
        }

        .action-card::after {
          content: "";
          position: absolute;
          width: 120px;
          height: 120px;
          background: radial-gradient(
            circle,
            rgba(15, 118, 110, 0.2),
            transparent 70%
          );
          right: -40px;
          top: -40px;
          opacity: 0.5;
          transition: opacity 0.25s ease;
        }

        .action-card:hover {
          border-color: rgba(15, 118, 110, 0.45);
          transform: translateY(-4px);
          box-shadow: var(--shadow);
        }

        .action-card:hover::after {
          opacity: 0.8;
        }

        .action-card h3 {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 700;
          color: var(--ink);
          position: relative;
          z-index: 1;
        }

        .action-card p {
          font-size: 14px;
          color: var(--muted);
          position: relative;
          z-index: 1;
        }

        .booking-card {
          background: linear-gradient(
            135deg,
            rgba(15, 118, 110, 0.12),
            rgba(20, 83, 45, 0.08)
          );
          border-color: rgba(20, 83, 45, 0.2);
        }

        .booking-card:hover {
          border-color: rgba(20, 83, 45, 0.4);
          box-shadow: 0 16px 30px rgba(20, 83, 45, 0.18);
        }

        .hotel-card {
          background: linear-gradient(
            135deg,
            rgba(217, 119, 6, 0.12),
            rgba(234, 88, 12, 0.08)
          );
          border-color: rgba(217, 119, 6, 0.25);
        }

        .hotel-card:hover {
          border-color: rgba(217, 119, 6, 0.45);
          box-shadow: 0 16px 30px rgba(217, 119, 6, 0.2);
        }

        .guide-card {
          background: linear-gradient(
            135deg,
            rgba(2, 132, 199, 0.12),
            rgba(15, 118, 110, 0.1)
          );
          border-color: rgba(2, 132, 199, 0.25);
        }

        .guide-card:hover {
          border-color: rgba(2, 132, 199, 0.45);
          box-shadow: 0 16px 30px rgba(2, 132, 199, 0.18);
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(12px);
          }
        }

        @media (max-width: 920px) {
          .header {
            flex-direction: column;
            gap: 20px;
            padding: 22px;
            text-align: center;
          }

          .header-right {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .controls {
            flex-wrap: wrap;
            justify-content: center;
          }
        }

        @media (max-width: 600px) {
          .dashboard-content {
            padding: 26px 18px 50px;
          }

          .controls select,
          .controls button,
          .logout-btn {
            padding: 10px 14px;
            font-size: 14px;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back to your command center</p>
          </div>

          <div className="header-right">
            <div className="controls">
              <select>
                <option>Last 30 days</option>
                <option>Last 7 days</option>
                <option>Last 3 months</option>
              </select>
              <button>Export Report</button>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="stats-grid">
            {/* <div className="stat-card">
              <h3>Total Users</h3>
              <div className="number">0</div>
            </div> */}

            {/* <div className="stat-card">
              <h3>Total Hotels</h3>
              <div className="number">0</div>
            </div> */}

            {/* <div className="stat-card">
              <h3>Platform Revenue</h3>
              <div className="number">0</div>
            </div> */}

            {/* <div className="stat-card">
              <h3>Pending Approvals</h3>
              <div className="number">0</div>
            </div> */}
          </div>

          <div className="sections-container">
            <div className="quick-actions">
              <div className="section-header">
                <h2>Quick Actions</h2>
                <p>Streamline your administrative workflow</p>
              </div>

              <div className="actions-grid">
                <div
                  className="action-card"
                  onClick={() => navigate("/admin/usermanagement")}
                >
                  <h3>User Management</h3>
                  <p>Manage all platform users and permissions</p>
                </div>

                <div
                  className="action-card"
                  onClick={() => navigate("/admin/pendingapprovels")}
                >
                  <h3>Pending Approvals</h3>
                  <p>Review and process registration requests</p>
                </div>
              </div>
            </div>

            <div className="management-section">
              <div className="section-header">
                <h2>Management Center</h2>
                <p>
                  Comprehensive management tools for guides, hotels, and
                  bookings
                </p>
              </div>

              <div className="actions-grid">
                <div
                  className="action-card guide-card"
                  onClick={() => navigate("/admin/viewallguides")}
                >
                  <h3>View All Guides</h3>
                  <p>Manage tour guides and their profiles</p>
                </div>

                <div
                  className="action-card hotel-card"
                  onClick={() => navigate("/admin/viewallhotels")}
                >
                  <h3>View All Hotels</h3>
                  <p>Manage hotel listings and accommodations</p>
                </div>

                <div
                  className="action-card booking-card"
                  onClick={() => navigate("/admin/viewallhotelbookings")}
                >
                  <h3>Hotel Bookings</h3>
                  <p>View and manage all hotel reservations</p>
                </div>

                <div
                  className="action-card booking-card"
                  onClick={() => navigate("/admin/viewallguidebookings")}
                >
                  <h3>Guide Bookings</h3>
                  <p>View and manage all guide reservations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
