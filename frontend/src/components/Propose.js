import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Propose.css";
import { FaInfoCircle } from "react-icons/fa";
import RoomDetailModal from "./RoomDetailModal";

const Propose = ({ hotelId }) => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [expandedAmenities, setExpandedAmenities] = useState({});
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState(null);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;
  const userId = localStorage.getItem("userId");
  const [userLevel, setUserLevel] = useState();

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        const user = localStorage.getItem("user");
        const userData = user ? JSON.parse(user) : null;
        const userId = userData?._id || null;
        if (userId) {
          const res = await fetch(`${apiUrl}/cash/${userId}/info`);
          const data = await res.json();
          if (data.success) {
            setUserLevel(data.data.level);
          }
        }
      } catch (error) {
        console.error("Error fetching user level:", error);
      }
    };

    fetchUserLevel();
  }, [apiUrl]);

  const calculateCashback = (baseCashback) => {
    switch (userLevel) {
      case "silver":
        return Math.round(baseCashback * 1.1);
      case "gold":
        return Math.round(baseCashback * 1.2);
      case "diamond":
        return Math.round(baseCashback * 1.5);
      default:
        return baseCashback;
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${apiUrl}/orders/user/${userId}`);
        const data = await res.json();
        if (data.success) {
          setBookings(data.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (userId) fetchBookings();
  }, [userId, apiUrl]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${apiUrl}/rooms/hotel/${hotelId}`);
        const data = await res.json();
        if (data.success) {
          const updatedRooms = data.data.map((room) => {
            const booking = bookings.find(
              (b) =>
                b.serviceType === "Hotel" &&
                b.serviceId === room._id &&
                b.status === "Paid"
            );

            let timeAgoText = null;
            if (booking) {
              const diffMs = new Date() - new Date(booking.bookingDate);
              const diffMins = Math.floor(diffMs / 60000);
              timeAgoText =
                diffMins < 60
                  ? `Đã đặt ${diffMins} phút trước`
                  : `Đã đặt ${Math.floor(diffMins / 60)} giờ trước`;
            }

            let discountedPrice = room.price;
            if (
              voucher &&
              (voucher.serviceId === null || voucher.serviceId === room._id)
            ) {
              if (voucher.discountType === "percent") {
                discountedPrice =
                  room.price - room.price * (voucher.discountValue / 100);
              } else if (voucher.discountType === "amount") {
                discountedPrice = room.price - voucher.discountValue;
              }
            }
            const finalPrice = Math.max(
              discountedPrice + (room.serviceFee || 0),
              0
            );

            return {
              ...room,
              discountedPrice: Math.round(discountedPrice),
              finalPrice: Math.round(finalPrice),
              timeAgoText,
            };
          });
          setRooms(updatedRooms);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (hotelId) fetchRooms();
  }, [hotelId, bookings, voucher, apiUrl]);

  const handleVoucherApply = async () => {
    try {
      setError(null);
      const res = await fetch(
        `${apiUrl}/vouchers/apply?code=${voucherCode}&type=hotel`
      );
      const data = await res.json();
      if (data && data._id) {
        setVoucher(data);
      } else {
        setVoucher(null);
        setError("Voucher không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      console.error("Lỗi khi áp dụng voucher:", err);
      setError("Lỗi server hoặc mã không tồn tại.");
      setVoucher(null);
    }
  };

  const toggleDetails = (roomId) => {
    setExpandedDetails((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const toggleAmenities = (roomId) => {
    setExpandedAmenities((prev) => ({ ...prev, [roomId]: !prev[roomId] }));
  };

  const openModal = async (roomId) => {
    try {
      const response = await fetch(`${apiUrl}/rooms/${roomId}`);
      const data = await response.json();
      if (data.success) {
        setSelectedRoom(data.data);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error fetching room details:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const renderCashbackInfo = (room) => {
    const baseCashback = room.cashback || 0;
    const actualCashback = calculateCashback(baseCashback);
    
    return (
      <p className="cashback">
        Hoàn {actualCashback.toLocaleString()}₫ vào Cash
        {userLevel !== "bronze" && (
          <span className="level-bonus">
            (Ưu đãi {userLevel} +{Math.round((actualCashback/baseCashback - 1)*100)}%)
          </span>
        )}
      </p>
    );
  };

  return (
    <div className="propose-container">
      <div className="propose-header">⭐ Được đề xuất</div>

      <div className="voucher-input">
        <label htmlFor="voucherCode">Mã giảm giá:</label>
        <input
          id="voucherCode"
          type="text"
          placeholder="Nhập mã và nhấn Enter"
          value={voucherCode}
          onChange={(e) => setVoucherCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleVoucherApply();
          }}
        />
        {error && <p className="voucher-error">{error}</p>}
      </div>

      <div className="propose-list">
        {rooms.map((room) => (
          <div key={room._id} className="propose-content">
            <div className="propose-image">
              <img src={room.images?.[0]} alt={room.name} />
              <button onClick={() => openModal(room._id)}>
                Xem chi tiết phòng »
              </button>
              {room.timeAgoText && (
                <div className="propose-booking-time">{room.timeAgoText}</div>
              )}
            </div>
            <div className="propose-info">
              <h3>{room.name}</h3>
              <p className="light-text">
                {room.people} | {room.area} | {room.view}
              </p>
              <ul className="bullet-list">
                <li>✅ Hoàn huỷ một phần</li>
                <li>✅ Giá đã bao gồm bữa sáng</li>
                <li>⚠️ Xác nhận trong 15 phút</li>
              </ul>
              <div className="propose-advantages">
                <div
                  className="advantage-frame"
                  onClick={() => toggleDetails(room._id)}
                >
                  <p>
                    <b>Ưu đãi bao gồm:</b> {room.policies?.extra || "Ăn sáng"}
                  </p>
                  <p>
                    <b>Thông tin bổ sung:</b>{" "}
                    {room.policies?.cancellation || "Không hoàn tiền"}
                  </p>
                </div>
                {expandedDetails[room._id] && (
                  <div className="room-details">
                    <p>
                      <b>Chính sách hủy:</b> {room.policies?.cancellation}
                    </p>
                    <p>
                      <b>Bữa ăn:</b> {room.policies?.breakfast}
                    </p>
                    <p>
                      <b>Xác nhận:</b> {room.policies?.confirmation}
                    </p>
                    <p>
                      <b>Hóa đơn:</b> {room.policies?.invoice}
                    </p>
                    <p>
                      <b>Ưu đãi:</b> {room.policies?.extra}
                    </p>
                  </div>
                )}
              </div>
              <div className="propose-amenities">
                {room.amenities.slice(0, 3).map((item, i) => (
                  <span key={i}>{item}</span>
                ))}
                {room.amenities.length > 3 && (
                  <span
                    className="more-amenities"
                    onClick={() => toggleAmenities(room._id)}
                  >
                    {expandedAmenities[room._id]
                      ? "Ẩn tiện ích"
                      : `+ ${room.amenities.length - 3} tiện ích`}
                  </span>
                )}
                {expandedAmenities[room._id] && (
                  <div className="full-amenities">
                    {room.amenities.slice(3).map((item, i) => (
                      <span key={i}>{item}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="propose-bed">
              <p>{room.beds}</p>
              <p className={`room-quantity ${room.quantity === 0 ? 'out' : room.quantity < 5 ? 'low' : ''}`}>
                {room.quantity === 0 ? 'Hết phòng' : `Còn lại: ${room.quantity} phòng`}
              </p>
            </div>
            <div className="propose-pricing">
              {voucher?.discountValue && (
                <p className="old-price">
                  -{voucher.discountValue}
                  {voucher.discountType === "percent" ? "%" : "₫"}{" "}
                  <s>{room.price.toLocaleString()}₫</s>
                </p>
              )}
              <p className="discounted-price">
                {room.discountedPrice.toLocaleString()}₫
              </p>
              <p className="coupon">
                Mã: <b>{voucher?.code || "Không có mã"}</b>
              </p>
              <p className="total-price">
                Giá cuối cùng: {room.finalPrice.toLocaleString()}₫
                <span className="price-tooltip">
                  <FaInfoCircle className="tooltip-icon" />
                  <span className="tooltip-text">
                    Giá cuối cùng = Giá đã giảm + Phí dịch vụ<br />
                    ({room.discountedPrice?.toLocaleString() || '0'}₫ + {room.serviceFee?.toLocaleString() || '0'}₫)
                  </span>
                </span>
              </p>
              <button
                className="book-btn"
                onClick={() => {
                  localStorage.setItem("price", room.price); // Giá gốc
                  localStorage.setItem("discountedPrice", room.discountedPrice);
                  localStorage.setItem("finalPrice", room.finalPrice);
                  localStorage.setItem("serviceFee", room.serviceFee);
                  localStorage.setItem("voucherCode", voucher?.code || "");
                  localStorage.setItem(
                    "voucherValue",
                    voucher?.discountValue || 0
                  );
                  localStorage.setItem(
                    "voucherType",
                    voucher?.discountType || ""
                  );
                  navigate(`/checkout?id=${room._id}`);
                }}
                disabled={room.quantity === 0}
              >
                {room.quantity === 0 ? 'Hết phòng' : 'Đặt phòng'}
              </button>

              <p className="cashback">
                {renderCashbackInfo(room)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedRoom && (
        <RoomDetailModal room={selectedRoom} onClose={closeModal} />
      )}
    </div>
  );
};

export default Propose;
