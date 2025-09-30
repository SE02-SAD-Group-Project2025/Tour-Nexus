import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  // Mock navigate function for demonstration

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div>
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #333;
          min-height: 100vh;
        }

        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 25px 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-left h1 {
          font-size: 32px;
          margin-bottom: 5px;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .header-left p {
          color: #666;
          font-size: 16px;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .controls select,
        .controls button {
          padding: 12px 20px;
          border: 2px solid transparent;
          background: linear-gradient(45deg, #667eea, #764ba2);
          color: white;
          cursor: pointer;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .controls select:hover,
        .controls button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .logout-btn {
          padding: 12px 24px;
          background: linear-gradient(45deg, #ff6b6b, #ee5a24);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(238, 90, 36, 0.3);
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(238, 90, 36, 0.4);
        }

        .dashboard-content {
          padding: 40px 30px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-bottom: 50px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 30px;
          border-radius: 16px;
          text-align: center;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(45deg, #667eea, #764ba2);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }

        .stat-card h3 {
          font-size: 14px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 15px;
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .stat-card .number {
          font-size: 42px;
          font-weight: 700;
          background: linear-gradient(45deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .sections-container {
          display: grid;
          gap: 30px;
        }

        .quick-actions,
        .management-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 35px;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .section-header {
          margin-bottom: 30px;
        }

        .section-header h2 {
          font-size: 24px;
          margin-bottom: 8px;
          color: #333;
          font-weight: 700;
        }

        .section-header p {
          color: #666;
          font-size: 16px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .action-card {
          padding: 25px;
          border: 2px solid rgba(102, 126, 234, 0.1);
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(
            135deg,
            rgba(102, 126, 234, 0.05),
            rgba(118, 75, 162, 0.05)
          );
          position: relative;
          overflow: hidden;
        }

        .action-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            45deg,
            rgba(102, 126, 234, 0.1),
            rgba(118, 75, 162, 0.1)
          );
          transition: left 0.3s ease;
        }

        .action-card:hover::before {
          left: 0;
        }

        .action-card:hover {
          border-color: rgba(102, 126, 234, 0.3);
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.2);
        }

        .action-card h3 {
          margin-bottom: 10px;
          font-size: 18px;
          font-weight: 600;
          color: #333;
          position: relative;
          z-index: 1;
        }

        .action-card p {
          font-size: 14px;
          color: #666;
          position: relative;
          z-index: 1;
        }

        .booking-card {
          background: linear-gradient(
            135deg,
            rgba(40, 167, 69, 0.05),
            rgba(32, 201, 151, 0.05)
          );
          border-color: rgba(40, 167, 69, 0.2);
        }

        .booking-card:hover {
          border-color: rgba(40, 167, 69, 0.4);
          box-shadow: 0 10px 30px rgba(40, 167, 69, 0.2);
        }

        .hotel-card {
          background: linear-gradient(
            135deg,
            rgba(255, 107, 107, 0.05),
            rgba(238, 90, 36, 0.05)
          );
          border-color: rgba(255, 107, 107, 0.2);
        }

        .hotel-card:hover {
          border-color: rgba(255, 107, 107, 0.4);
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.2);
        }

        .guide-card {
          background: linear-gradient(
            135deg,
            rgba(52, 152, 219, 0.05),
            rgba(155, 89, 182, 0.05)
          );
          border-color: rgba(52, 152, 219, 0.2);
        }

        .guide-card:hover {
          border-color: rgba(52, 152, 219, 0.4);
          box-shadow: 0 10px 30px rgba(52, 152, 219, 0.2);
        }

        .clear {
          clear: both;
        }

        @media (max-width: 768px) {
          .header {
            flex-direction: column;
            gap: 20px;
            padding: 20px;
          }

          .header-right {
            width: 100%;
            justify-content: space-between;
          }

          .controls {
            flex-wrap: wrap;
          }

          .dashboard-content {
            padding: 20px 15px;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
          }

          .actions-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }
        }

        @media (max-width: 480px) {
          .header-left h1 {
            font-size: 24px;
          }

          .controls select,
          .controls button,
          .logout-btn {
            padding: 10px 16px;
            font-size: 14px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
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
