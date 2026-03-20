import React, { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import {
  FaWifi,
  FaTv,
  FaSwimmingPool,
  FaUtensils,
  FaCar,
  FaDumbbell,
  FaSpa,
  FaHeart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const provinces = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Huế"];
const apiUrl = process.env.REACT_APP_API_URL;

const amenityIcons = {
  Wifi: <FaWifi />,
  TV: <FaTv />,
  "Hồ bơi": <FaSwimmingPool />,
  "Nhà hàng": <FaUtensils />,
  "Chỗ đỗ xe": <FaCar />,
  "Phòng gym": <FaDumbbell />,
  Spa: <FaSpa />
};

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [favoriteHotelIds, setFavoriteHotelIds] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const fetchHotels = async (province) => {
    try {
      setLoading(true);
      const endpoint = province
        ? `${apiUrl}/hotels/province/${encodeURIComponent(province)}`
        : `${apiUrl}/hotels`;
      const res = await fetch(endpoint);
      const data = await res.json();
      if (data.success) {
        setHotels(data.data);
      }
    } catch (err) {
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${apiUrl}/favorites/${userId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.favoriteHotels)) {
        setFavoriteHotelIds(data.favoriteHotels.map((hotel) => hotel._id));
      } else {
        setFavoriteHotelIds([]);
        console.warn("API favorites trả về không đúng định dạng:", data);
      }
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  const toggleFavorite = async (hotelId) => {
    if (!userId) return alert("Vui lòng đăng nhập để sử dụng chức năng yêu thích.");
    const isFavorite = favoriteHotelIds.includes(hotelId);

    try {
      const endpoint = `${apiUrl}/favorites`;
      const method = isFavorite ? "DELETE" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, hotelId })
      });

      const data = await res.json();
      if (data.success) {
        setFavoriteHotelIds((prev) =>
          isFavorite ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]
        );
      } else {
        console.error("Lỗi cập nhật yêu thích:", data.message);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  useEffect(() => {
    fetchHotels(selectedProvince);
    setShowAll(false);
  }, [selectedProvince]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const displayedHotels = showAll ? hotels : hotels.slice(0, 8);

  return (
  <div
    style={{
      padding: "30px",
      background: "#f5efef",
      minHeight: "100vh",
      maxWidth: "1300px",
      margin: "0 auto"
    }}
  >
    <h2 style={{ marginBottom: "20px" }}>Khách sạn nổi bật</h2>

    {/* Filter */}
    <div
      style={{
        display: "flex",
        gap: "15px",
        marginBottom: "25px",
        flexWrap: "wrap"
      }}  
    >
      <button
        onClick={() => setSelectedProvince("")}
        style={{
          padding: "8px 18px",
          background: selectedProvince === "" ? "#007BFF" : "#987f7f",
          color: selectedProvince === "" ? "white" : "#333",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer"
        }}
      >
        Tất cả
      </button>

      {provinces.map((province) => (
        <button
          key={province}
          onClick={() => setSelectedProvince(province)}
          style={{
            padding: "8px 18px",
            background: selectedProvince === province ? "#007BFF" : "#efafaf",
            color: selectedProvince === province ? "white" : "#333",
            borderRadius: "20px",
            border: "none",
            cursor: "pointer"
          }}
        >
          {province}
        </button>
      ))}
    </div>

    {/* List */}
    {loading ? (
      <CircularProgress />
    ) : (
      <>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "35.5px"
          }}
        >
          {displayedHotels.map((hotel, index) => {
            const isFavorite = favoriteHotelIds.includes(hotel._id);
            const hasDiscount =
              hotel.oldPricePerNight &&
              hotel.oldPricePerNight > hotel.pricePerNight;

            const discountPercent = hasDiscount
              ? Math.round(
                  ((hotel.oldPricePerNight - hotel.pricePerNight) /
                    hotel.oldPricePerNight) *
                    100
                )
              : 0;

            return (
              <div
                key={hotel._id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => navigate(`/hotelInfo?id=${hotel._id}`)}
                style={{
                  width: "280px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  background: "white",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform:
                    hoveredIndex === index
                      ? "translateY(-6px)"
                      : "translateY(0)",
                  boxShadow:
                    hoveredIndex === index
                      ? "0 12px 30px rgba(0,0,0,0.2)"
                      : "0 5px 15px rgba(0,0,0,0.08)",
                  position: "relative"
                }}
              >
                {/* Discount badge */}
                {hasDiscount && (
                  <div
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      background: "#ff4757",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      zIndex: 2
                    }}
                  >
                    🔥 -{discountPercent}%
                  </div>
                )}

                {/* Favorite */}
                <div
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    zIndex: 2,

                    width: "36px",
                    height: "36px",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    background: "rgba(255,255,255,0.95)",
                    borderRadius: "50%",

                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    cursor: "pointer",
                    transition: "all 0.3s ease"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(hotel._id);
                  }}
                >
                  <FaHeart
                    size={16}
                    color={isFavorite ? "#e74c3c" : "#ccc"}
                  />
                </div>

                {/* Image */}
                <img
                  src={
                    hotel.images[0] ||
                    "https://via.placeholder.com/280x180"
                  }
                  alt={hotel.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                    transition: "0.4s"
                  }}
                />

                {/* Content */}
                <div style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      margin: "5px 0",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis"
                    }}
                  >
                    {hotel.name}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "8px"
                    }}
                  >
                    <span style={{ fontSize: "14px", color: "#666" }}>
                      {hotel.province}
                    </span>

                    <span
                      style={{
                        background: "#f1c40f",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "bold"
                      }}
                    >
                      {hotel.starRating || "?"} ★
                    </span>
                  </div>

                  {/* Amenities */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "10px"
                    }}
                  >
                    {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "12px",
                          background: "#f1f3f5",
                          padding: "4px 8px",
                          borderRadius: "12px",
                          gap: "4px"
                        }}
                      >
                        {amenityIcons[amenity]} {amenity}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div>
                    {hasDiscount && (
                      <div
                        style={{
                          fontSize: "13px",
                          color: "#999",
                          textDecoration: "line-through"
                        }}
                      >
                        {hotel.oldPricePerNight.toLocaleString()} đ
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#e74c3c"
                      }}
                    >
                      {hotel.pricePerNight.toLocaleString()} đ
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Show more */}
        {hotels.length > 8 && (
          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                padding: "12px 30px",
                background: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "30px",
                cursor: "pointer"
              }}
            >
              {showAll ? "Thu gọn" : "Xem thêm"}
            </button>
          </div>
        )}
      </>
    )}
  </div>
);
};

export default HotelList;
