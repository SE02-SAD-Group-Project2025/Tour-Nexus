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

        const hotelStatsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/hotel/stats"
        );
        const guideStatsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/guide/stats"
        );

        const hotelsResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/hotel/view_pending_hotels"
        );
        const guidesResponse = await axios.get(
          import.meta.env.VITE_BACKEND_URL + "/api/guide/view_pending_guides"
        );

        setStats({
          hotels: hotelStatsResponse.data,
          guides: guideStatsResponse.data,
          vehicles: { pending: 0, approved: 0, rejected: 0 },
        });

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

  const totalPending =
    stats.hotels.pending + stats.guides.pending + stats.vehicles.pending;

  const styles = `
    @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap");

    :root {
      --bg: #f4efe6;
      --bg-2: #e6f1ea;
      --panel: rgba(255, 255, 255, 0.92);
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
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: "Manrope", "Segoe UI", Tahoma, sans-serif;
      background: var(--bg);
      color: var(--ink);
    }

    .approvals-shell {
      min-height: 100vh;
      background: linear-gradient(135deg, var(--bg), var(--bg-2));
      padding: 30px 24px 60px;
      position: relative;
      overflow: hidden;
    }

    .approvals-shell::before {
      content: "";
      position: absolute;
      width: 360px;
      height: 360px;
      border-radius: 50%;
      background: radial-gradient(
        circle at 30% 30%,
        rgba(15, 118, 110, 0.2),
        transparent 65%
      );
      top: -140px;
      right: -140px;
    }

    .approvals-shell::after {
      content: "";
      position: absolute;
      width: 420px;
      height: 420px;
      border-radius: 30%;
      background: radial-gradient(
        circle at 70% 30%,
        rgba(217, 119, 6, 0.18),
        transparent 60%
      );
      bottom: -180px;
      left: -140px;
    }

    .approvals-inner {
      max-width: 1400px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .page-header {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 18px;
      padding: 22px 24px;
      box-shadow: var(--shadow-soft);
      display: flex;
      align-items: center;
      gap: 18px;
      flex-wrap: wrap;
    }

    .back-btn {
      border: 1px solid var(--panel-border);
      background: #fff;
      color: var(--ink);
      padding: 10px 16px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: var(--shadow-soft);
    }

    .back-btn:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow);
    }

    .header-text {
      flex: 1 1 280px;
    }

    .page-title {
      font-size: clamp(26px, 3vw, 34px);
      margin-bottom: 6px;
      background: linear-gradient(90deg, var(--brand), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 800;
    }

    .page-subtitle {
      color: var(--muted);
      font-size: 15px;
    }

    .header-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 10px 16px;
      border-radius: 999px;
      background: rgba(15, 118, 110, 0.12);
      color: var(--brand);
      font-weight: 700;
      border: 1px solid rgba(15, 118, 110, 0.2);
    }

    .pill-label {
      font-size: 12px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .pill-value {
      font-size: 18px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
    }

    .stat-card {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 22px;
      box-shadow: var(--shadow-soft);
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

    .stat-title {
      font-size: 13px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 12px;
      font-weight: 700;
    }

    .stat-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 8px;
    }

    .stat-label {
      color: var(--muted);
      font-size: 13px;
    }

    .stat-value {
      font-size: 20px;
      font-weight: 700;
    }

    .stat-value.pending {
      color: #b45309;
    }

    .stat-value.approved {
      color: #15803d;
    }

    .stat-value.rejected {
      color: #b42318;
    }

    .section-block {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      font-size: 22px;
      font-weight: 700;
      color: var(--ink);
    }

    .section-subtitle {
      color: var(--muted);
      font-size: 14px;
    }

    .cards-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .approval-card {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 16px;
      padding: 18px;
      width: min(320px, 100%);
      box-shadow: var(--shadow-soft);
      position: relative;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease,
        border-color 0.2s ease;
    }

    .approval-card::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--brand), var(--accent));
    }

    .approval-card:hover {
      transform: translateY(-3px);
      border-color: rgba(15, 118, 110, 0.35);
      box-shadow: var(--shadow);
    }

    .approval-card__meta {
      font-size: 12px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      margin-bottom: 8px;
      font-weight: 600;
    }

    .approval-card h4 {
      font-size: 18px;
      margin-bottom: 8px;
      color: var(--ink);
    }

    .approval-card p {
      color: var(--muted);
      font-size: 14px;
      margin-bottom: 16px;
    }

    .approval-card__action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--brand), #1e9e8b);
      color: #fff;
      text-decoration: none;
      font-weight: 600;
      box-shadow: 0 12px 20px rgba(15, 118, 110, 0.2);
    }

    .approval-card__action:hover {
      box-shadow: 0 16px 24px rgba(15, 118, 110, 0.25);
      transform: translateY(-1px);
    }

    .loading-card {
      background: var(--panel);
      border: 1px solid var(--panel-border);
      border-radius: 18px;
      padding: 36px;
      box-shadow: var(--shadow-soft);
      text-align: center;
      width: min(420px, 100%);
      margin: 0 auto;
    }

    .loading-shell {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      border: 3px solid rgba(15, 118, 110, 0.2);
      border-top-color: var(--brand);
      animation: spin 0.8s linear infinite;
      margin: 0 auto 18px;
    }

    .loading-title {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .loading-subtitle {
      color: var(--muted);
      font-size: 14px;
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

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    @media (max-width: 720px) {
      .page-header {
        justify-content: center;
        text-align: center;
      }

      .header-pill {
        width: 100%;
        justify-content: center;
      }
    }
  `;

  if (isLoading) {
    return (
      <div className="approvals-shell">
        <style jsx>{styles}</style>
        <div className="approvals-inner loading-shell">
          <div className="loading-card">
            <div className="spinner" />
            <div className="loading-title">Loading pending approvals</div>
            <div className="loading-subtitle">
              Fetching the latest registrations...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="approvals-shell">
      <style jsx>{styles}</style>
      <div className="approvals-inner">
        <header className="page-header">
          <button className="back-btn" onClick={() => window.history.back()}>
            Back
          </button>
          <div className="header-text">
            <h1 className="page-title">Pending Approvals</h1>
            <p className="page-subtitle">
              Review pending registrations for all roles
            </p>
          </div>
          <div className="header-pill">
            <span className="pill-label">Total Pending</span>
            <span className="pill-value">{totalPending}</span>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">Hotels</div>
            <div className="stat-row">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{stats.hotels.pending}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Approved</span>
              <span className="stat-value approved">
                {stats.hotels.approved}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Rejected</span>
              <span className="stat-value rejected">
                {stats.hotels.rejected}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Tour Guides</div>
            <div className="stat-row">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">{stats.guides.pending}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Approved</span>
              <span className="stat-value approved">
                {stats.guides.approved}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Rejected</span>
              <span className="stat-value rejected">
                {stats.guides.rejected}
              </span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-title">Vehicle Rentals</div>
            <div className="stat-row">
              <span className="stat-label">Pending</span>
              <span className="stat-value pending">
                {stats.vehicles.pending}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Approved</span>
              <span className="stat-value approved">
                {stats.vehicles.approved}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Rejected</span>
              <span className="stat-value rejected">
                {stats.vehicles.rejected}
              </span>
            </div>
          </div>
        </section>

        <section className="section-block">
          <div>
            <div className="section-title">Pending Hotels</div>
            <div className="section-subtitle">
              Review hotel listings waiting for approval.
            </div>
          </div>
          <div className="cards-grid">
            {hotels.map((hotel) => {
              return (
                <PendingApprovelCart
                  key={hotel._id || hotel.hotel_id}
                  hotel={hotel}
                />
              );
            })}
          </div>
        </section>

        <section className="section-block">
          <div>
            <div className="section-title">Pending Tour Guides</div>
            <div className="section-subtitle">
              Review guide profiles waiting for approval.
            </div>
          </div>
          <div className="cards-grid">
            {guides.map((guide) => {
              return (
                <PendingGuideCart
                  key={guide._id || guide.guide_id}
                  guide={guide}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
