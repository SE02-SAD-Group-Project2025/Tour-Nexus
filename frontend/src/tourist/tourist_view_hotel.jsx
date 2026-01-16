import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bed,
  Calendar,
  Car,
  CheckCircle,
  Image,
  Mail,
  MapPin,
  Shield,
  Users,
} from "lucide-react";

export default function TouristViewHotelDetails() {
  const params = useParams();
  const navigate = useNavigate();
  const hotel_id = params.hotel_id;
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useState({
    checkInDate: "",
    checkOutDate: "",
    rooms: "1",
    guests: "2",
  });

  const handleSearchParamChange = (key, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/hotel/view_hotels_by_id/${hotel_id}`
        );

        const transformedHotel = {
          id: response.data._id,
          hotel_id: response.data.hotel_id,
          name: response.data.hotel_name,
          email: response.data.email,
          address: response.data.address,
          description: response.data.description,
          parkingAvailable: response.data.parking_available,
          images: response.data.images || [],
          status: response.data.status,
          totalRooms: response.data.total_rooms,
          date: response.data.date,
          roomCategories:
            response.data.room_types?.map((room, index) => ({
              id: index + 1,
              categoryName: room.name,
              roomCount: room.count,
              pricePerNight: room.price,
              facilities: room.facilities || [],
              images: room.images || [],
            })) || [],
        };

        setHotel(transformedHotel);
        setError(null);
      } catch (fetchError) {
        console.error("Error fetching hotel details:", fetchError);
        setError("Failed to load hotel details");
        toast.error("Something went wrong! Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (hotel_id) {
      fetchHotelDetails();
    }
  }, [hotel_id]);

  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (hotel?.roomCategories?.length > 0) {
      const availableRooms = hotel.roomCategories.filter(
        (room) => room.roomCount > 0
      );
      setSelectedRoomId(availableRooms.length > 0 ? availableRooms[0].id : null);
    }
  }, [hotel]);

  useEffect(() => {
    if (hotel?.images?.length) {
      setActiveImage(hotel.images[0]);
    } else {
      setActiveImage("");
    }
  }, [hotel]);

  const handleBookRoom = (roomData = null) => {
    const selectedRoom =
      roomData || hotel.roomCategories.find((room) => room.id === selectedRoomId);

    if (!selectedRoom) {
      toast.error("Please select a room type first");
      return;
    }

    navigate(`/tourist/bookhotel/${hotel_id}`, {
      state: {
        selectedRoom: selectedRoom,
        searchParams: searchParams,
        hotelData: hotel,
      },
    });
  };

  const goBack = () => {
    window.history.back();
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    return new Date(dateString).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    const numericAmount = Number(amount || 0);
    return `LKR ${numericAmount.toLocaleString("en-LK")}`;
  };

  const statusLabel = hotel?.status || "pending";
  const availableRoomCategories =
    hotel?.roomCategories?.filter((room) => room.roomCount > 0) || [];
  const currentRoom = availableRoomCategories.find(
    (room) => room.id === selectedRoomId
  );
  const hotelImages = hotel?.images || [];
  const mainImage = activeImage || hotelImages[0];
  const galleryImages = hotelImages.slice(0, 5);
  const amenities = hotel?.roomCategories
    ? [...new Set(hotel.roomCategories.flatMap((room) => room.facilities || []))]
    : [];
  const amenitiesToShow = amenities.slice(0, 8);
  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="hotel-view hotel-view--state">
        <style jsx>{styles}</style>
        <div className="state-card">
          <div className="state-spinner" />
          <div className="state-title">Loading hotel details...</div>
          <div className="state-subtitle">Please wait a moment.</div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="hotel-view hotel-view--state">
        <style jsx>{styles}</style>
        <div className="state-card">
          <div className="state-title">{error || "Hotel not found"}</div>
          <div className="state-subtitle">
            Please go back and try another hotel.
          </div>
          <button className="back-btn" onClick={goBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hotel-view">
      <style jsx>{styles}</style>
      <div className="hotel-container">
        <button className="back-btn" onClick={goBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to hotels
        </button>

        <header className="hero">
          <div className="hero-main">
            <div className="hero-header">
              <div>
                <h1>{hotel.name}</h1>
                <p className="hero-address">
                  <MapPin className="w-4 h-4" />
                  {hotel.address}
                </p>
              </div>
              <span className={`status-pill status-pill--${statusLabel}`}>
                {statusLabel}
              </span>
            </div>

            <p className="hero-description">
              {hotel.description || "A welcoming stay in the heart of the city."}
            </p>

            <div className="hero-meta">
              <div className="meta-card">
                <Mail className="w-4 h-4" />
                <div>
                  <span>Email</span>
                  <strong>{hotel.email}</strong>
                </div>
              </div>
              <div className="meta-card">
                <Bed className="w-4 h-4" />
                <div>
                  <span>Total rooms</span>
                  <strong>{hotel.totalRooms}</strong>
                </div>
              </div>
              <div className="meta-card">
                <Calendar className="w-4 h-4" />
                <div>
                  <span>Registered</span>
                  <strong>{formatDate(hotel.date)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-side">
            <div className="cta-card">
              <div className="cta-label">Selected room</div>
              <div className="cta-title">
                {currentRoom ? currentRoom.categoryName : "No rooms available"}
              </div>
              <div className="cta-price">
                {currentRoom ? formatCurrency(currentRoom.pricePerNight) : "N/A"}
              </div>
              <div className="cta-sub">per night</div>
              <div className="cta-form">
                <div className="cta-field">
                  <label htmlFor="checkin">Check-in</label>
                  <input
                    id="checkin"
                    type="date"
                    min={today}
                    value={searchParams.checkInDate}
                    onChange={(e) =>
                      handleSearchParamChange("checkInDate", e.target.value)
                    }
                  />
                </div>
                <div className="cta-field">
                  <label htmlFor="checkout">Check-out</label>
                  <input
                    id="checkout"
                    type="date"
                    min={searchParams.checkInDate || today}
                    value={searchParams.checkOutDate}
                    onChange={(e) =>
                      handleSearchParamChange("checkOutDate", e.target.value)
                    }
                  />
                </div>
                <div className="cta-split">
                  <div className="cta-field">
                    <label htmlFor="rooms">Rooms</label>
                    <select
                      id="rooms"
                      value={searchParams.rooms}
                      onChange={(e) =>
                        handleSearchParamChange("rooms", e.target.value)
                      }
                    >
                      {[1, 2, 3, 4].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="cta-field">
                    <label htmlFor="guests">Guests</label>
                    <select
                      id="guests"
                      value={searchParams.guests}
                      onChange={(e) =>
                        handleSearchParamChange("guests", e.target.value)
                      }
                    >
                      {[1, 2, 3, 4, 5, 6].map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <button
                className="cta-btn"
                disabled={!currentRoom}
                onClick={() => handleBookRoom(currentRoom)}
              >
                Book now
              </button>
              <div className="cta-note">Secure booking. Pay later.</div>
            </div>

            <div
              className={`parking-card ${
                hotel.parkingAvailable ? "parking-card--yes" : "parking-card--no"
              }`}
            >
              <Car className="w-4 h-4" />
              <div>
                <span>Parking</span>
                <strong>
                  {hotel.parkingAvailable
                    ? "Free parking available"
                    : "No parking available"}
                </strong>
              </div>
            </div>
          </div>
        </header>

        <section className="gallery">
          <div className="gallery-main">
            {mainImage ? (
              <img src={mainImage} alt={`${hotel.name} main`} />
            ) : (
              <div className="gallery-placeholder">
                <Image className="w-8 h-8" />
                No images available
              </div>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="gallery-strip">
              {galleryImages.map((image, index) => (
                <button
                  type="button"
                  className={`gallery-thumb ${
                    image === mainImage ? "is-active" : ""
                  }`}
                  key={`${image}-${index}`}
                  onClick={() => setActiveImage(image)}
                >
                  <img src={image} alt={`${hotel.name} ${index + 2}`} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="content-grid">
          <div className="content-main">
            <div className="panel">
              <div className="panel-header">
                <h2>Room categories</h2>
                <span>{availableRoomCategories.length} available</span>
              </div>
              <div className="room-grid">
                {hotel.roomCategories.map((room) => {
                  const isActive = room.id === selectedRoomId;
                  const isDisabled = room.roomCount === 0;
                  return (
                    <button
                      key={room.id}
                      className={`room-card ${
                        isActive ? "is-active" : ""
                      } ${isDisabled ? "is-disabled" : ""}`}
                      disabled={isDisabled}
                      onClick={() => setSelectedRoomId(room.id)}
                    >
                      <div className="room-card__title">
                        <div>
                          <h3>{room.categoryName}</h3>
                          <span>{room.roomCount} rooms</span>
                        </div>
                        <div className="room-card__price">
                          <strong>{formatCurrency(room.pricePerNight)}</strong>
                          {isDisabled && (
                            <span className="room-card__badge">Sold out</span>
                          )}
                        </div>
                      </div>
                      <div className="room-card__meta">
                        {room.facilities?.length
                          ? room.facilities.slice(0, 2).join(" · ")
                          : "Standard amenities"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {currentRoom && (
              <div className="panel">
                <div className="panel-header panel-header--inline">
                  <h2>{currentRoom.categoryName} details</h2>
                  <button
                    className="ghost-btn"
                    onClick={() => handleBookRoom(currentRoom)}
                  >
                    Book this room
                  </button>
                </div>
                <div className="room-detail">
                  <div className="room-stat">
                    <span>Rooms available</span>
                    <strong>{currentRoom.roomCount}</strong>
                  </div>
                  <div className="room-stat">
                    <span>Price per night</span>
                    <strong>{formatCurrency(currentRoom.pricePerNight)}</strong>
                  </div>
                  <div className="room-stat">
                    <span>Guests</span>
                    <strong>{searchParams.guests}</strong>
                  </div>
                </div>
                <div className="room-images">
                  {currentRoom.images?.length ? (
                    currentRoom.images.slice(0, 3).map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`${currentRoom.categoryName} ${index + 1}`}
                      />
                    ))
                  ) : (
                    <div className="gallery-placeholder small">
                      <Image className="w-4 h-4" />
                      No room images
                    </div>
                  )}
                </div>
                {currentRoom.facilities?.length ? (
                  <div className="facility-grid">
                    {currentRoom.facilities.map((facility) => (
                      <span className="facility-chip" key={facility}>
                        {facility}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <aside className="content-side">
            <div className="panel">
              <h2>Why book here</h2>
              <ul className="feature-list">
                <li>
                  <CheckCircle className="w-4 h-4" />
                  Verified hotel profile
                </li>
                <li>
                  <Shield className="w-4 h-4" />
                  Secure booking experience
                </li>
                <li>
                  <Users className="w-4 h-4" />
                  Great for families and groups
                </li>
              </ul>
            </div>
            {amenitiesToShow.length > 0 && (
              <div className="panel">
                <h2>Popular amenities</h2>
                <div className="amenity-grid">
                  {amenitiesToShow.map((amenity) => (
                    <span className="amenity-chip" key={amenity}>
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="panel panel--highlight">
              <h2>Need help?</h2>
              <p>
                Reach out directly for special requests or clarifications before
                booking.
              </p>
              <a className="ghost-btn" href={`mailto:${hotel.email}`}>
                Email hotel
              </a>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}

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
    --accent: #d97706;
    --danger: #b42318;
    --shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
    --shadow-soft: 0 8px 20px rgba(15, 23, 42, 0.08);
    --ring: 0 0 0 4px rgba(15, 118, 110, 0.15);
  }

  * {
    box-sizing: border-box;
  }

  .hotel-view {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg), var(--bg-2));
    font-family: "Manrope", "Segoe UI", Tahoma, sans-serif;
    color: var(--ink);
    padding: 24px;
  }

  .hotel-view--state {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hotel-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .back-btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border: 1px solid var(--panel-border);
    background: #fff;
    color: var(--ink);
    padding: 10px 16px;
    border-radius: 999px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: var(--shadow-soft);
  }

  .hero {
    background: var(--panel);
    border: 1px solid var(--panel-border);
    border-radius: 24px;
    padding: 26px;
    box-shadow: var(--shadow);
    display: grid;
    grid-template-columns: 1.6fr 1fr;
    gap: 24px;
  }

  .hero-header {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .hero h1 {
    font-size: clamp(28px, 3vw, 36px);
    margin-bottom: 8px;
  }

  .hero-address {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--muted);
    font-weight: 500;
  }

  .hero-description {
    margin: 16px 0 20px;
    color: var(--muted);
    line-height: 1.6;
  }

  .status-pill {
    padding: 8px 14px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    background: rgba(15, 118, 110, 0.12);
    color: var(--brand);
    border: 1px solid rgba(15, 118, 110, 0.2);
    align-self: flex-start;
  }

  .status-pill--approved {
    background: rgba(16, 185, 129, 0.12);
    color: #047857;
    border-color: rgba(16, 185, 129, 0.3);
  }

  .status-pill--pending {
    background: rgba(217, 119, 6, 0.12);
    color: #b45309;
    border-color: rgba(217, 119, 6, 0.25);
  }

  .status-pill--rejected {
    background: rgba(244, 63, 94, 0.12);
    color: var(--danger);
    border-color: rgba(244, 63, 94, 0.3);
  }

  .hero-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  .meta-card {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 14px;
    border-radius: 14px;
    border: 1px solid var(--panel-border);
    background: #fff;
  }

  .meta-card span {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    display: block;
  }

  .meta-card strong {
    font-weight: 700;
    font-size: 14px;
  }

  .hero-side {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: sticky;
    top: 24px;
    align-self: start;
  }

  .cta-card {
    background: #fff;
    border-radius: 18px;
    border: 1px solid var(--panel-border);
    padding: 18px;
    box-shadow: var(--shadow-soft);
  }

  .cta-label {
    font-size: 12px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 10px;
  }

  .cta-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .cta-price {
    font-size: 24px;
    font-weight: 800;
    color: var(--brand);
  }

  .cta-sub {
    color: var(--muted);
    margin-bottom: 16px;
    font-size: 13px;
  }

  .cta-btn {
    width: 100%;
    border: none;
    padding: 12px;
    border-radius: 12px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--brand), #1e9e8b);
    color: #fff;
    cursor: pointer;
  }

  .cta-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .cta-note {
    margin-top: 12px;
    font-size: 12px;
    color: var(--muted);
  }

  .parking-card {
    display: flex;
    gap: 12px;
    align-items: center;
    padding: 16px;
    border-radius: 16px;
    border: 1px solid var(--panel-border);
    background: #fff;
  }

  .parking-card span {
    display: block;
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .parking-card strong {
    font-size: 14px;
    font-weight: 700;
  }

  .parking-card--yes {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(16, 185, 129, 0.08);
  }

  .parking-card--no {
    border-color: rgba(244, 63, 94, 0.25);
    background: rgba(244, 63, 94, 0.08);
  }

  .gallery {
    display: grid;
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .gallery-main {
    border-radius: 18px;
    overflow: hidden;
    min-height: 260px;
    max-height: 360px;
    background: #fff;
    border: 1px solid var(--panel-border);
  }

  .gallery-main img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .gallery-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 10px;
  }

  .gallery-thumb {
    border: none;
    padding: 0;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--panel-border);
    min-height: 80px;
    max-height: 110px;
    background: #fff;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .gallery-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .gallery-thumb:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-soft);
  }

  .gallery-thumb.is-active {
    border-color: rgba(15, 118, 110, 0.6);
    box-shadow: var(--shadow-soft);
  }

  .gallery-placeholder {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: var(--muted);
    font-weight: 600;
  }

  .gallery-placeholder.small {
    min-height: 120px;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 20px;
  }

  .panel {
    background: var(--panel);
    border-radius: 18px;
    border: 1px solid var(--panel-border);
    padding: 20px;
    box-shadow: var(--shadow-soft);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .panel-header--inline {
    flex-wrap: wrap;
    gap: 12px;
  }

  .panel-header span {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    font-weight: 600;
  }

  .room-grid {
    display: grid;
    gap: 12px;
  }

  .room-card {
    border-radius: 14px;
    border: 1px solid var(--panel-border);
    background: #fff;
    padding: 14px 16px;
    text-align: left;
    cursor: pointer;
    transition: border 0.2s ease, transform 0.2s ease;
  }

  .room-card:hover {
    transform: translateY(-1px);
    border-color: rgba(15, 118, 110, 0.35);
  }

  .room-card.is-active {
    border-color: rgba(15, 118, 110, 0.5);
    box-shadow: var(--shadow-soft);
  }

  .room-card.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .room-card__title {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
  }

  .room-card__title h3 {
    font-size: 16px;
    margin-bottom: 4px;
  }

  .room-card__title span {
    font-size: 12px;
    color: var(--muted);
  }

  .room-card__price {
    text-align: right;
  }

  .room-card__badge {
    display: inline-flex;
    margin-top: 6px;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    background: rgba(244, 63, 94, 0.12);
    color: var(--danger);
    border: 1px solid rgba(244, 63, 94, 0.3);
  }

  .room-card__meta {
    font-size: 12px;
    color: var(--muted);
    margin-top: 6px;
  }

  .room-detail {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }

  .room-stat {
    background: #fff;
    border-radius: 12px;
    border: 1px solid var(--panel-border);
    padding: 12px;
  }

  .room-stat span {
    display: block;
    font-size: 12px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }

  .room-stat strong {
    font-size: 16px;
    font-weight: 700;
  }

  .room-images {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }

  .room-images img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 12px;
  }

  .facility-grid {
    margin-top: 16px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .facility-chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(15, 118, 110, 0.1);
    color: var(--brand);
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(15, 118, 110, 0.2);
  }

  .amenity-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .amenity-chip {
    padding: 6px 10px;
    border-radius: 999px;
    background: rgba(217, 119, 6, 0.12);
    color: var(--accent);
    font-size: 12px;
    font-weight: 600;
    border: 1px solid rgba(217, 119, 6, 0.2);
  }

  .cta-form {
    display: grid;
    gap: 12px;
    margin: 16px 0;
  }

  .cta-field label {
    display: block;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--muted);
    margin-bottom: 6px;
  }

  .cta-field input,
  .cta-field select {
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    border: 1px solid var(--panel-border);
    background: #fff;
    color: var(--ink);
  }

  .cta-field input:focus,
  .cta-field select:focus {
    outline: none;
    box-shadow: var(--ring);
    border-color: rgba(15, 118, 110, 0.4);
  }

  .cta-split {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .feature-list {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: grid;
    gap: 12px;
    color: var(--muted);
  }

  .feature-list li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .ghost-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 12px;
    border: 1px solid var(--panel-border);
    color: var(--ink);
    background: #fff;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
  }

  .panel--highlight {
    background: linear-gradient(135deg, rgba(15, 118, 110, 0.1), #fff);
  }

  .state-card {
    background: #fff;
    border-radius: 20px;
    padding: 32px;
    box-shadow: var(--shadow);
    text-align: center;
  }

  .state-spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(15, 118, 110, 0.2);
    border-top-color: var(--brand);
    margin: 0 auto 16px;
    animation: spin 0.9s linear infinite;
  }

  .state-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
  }

  .state-subtitle {
    color: var(--muted);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 900px) {
    .hero,
    .content-grid {
      grid-template-columns: 1fr;
    }

    .hero-side {
      position: static;
    }
  }
`;
