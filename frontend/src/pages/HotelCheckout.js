import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/HotelCheckout.css";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { useRef } from "react";

const HotelCheckout = () => {
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("id"); // Lấy roomId từ URL param
  console.log("Room ID:", roomId); // Kiểm tra roomId
  const hasProcessedRef = useRef(false);
  const MAX_CASH_PER_HOTEL_BOOKING = 200000;
  const [useCash, setUseCash] = useState(false);
  const [cashAmount, setCashAmount] = useState(0);
  const [maxCashAvailable, setMaxCashAvailable] = useState(0);
  const [cashInfo, setCashInfo] = useState(null);

  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [guestInfo, setGuestInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    contactInfo: {},
    guestInfo: {},
  });
  const [note, setNote] = useState("");
  const [isBookingForOthers, setIsBookingForOthers] = useState(false);

  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(
    new Date(Date.now() + 86400000)
  );

  useEffect(() => {
    const fetchCashInfo = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("user"))?._id;
        if (userId) {
          const response = await fetch(`${apiUrl}/cash/${userId}/info`);
          const data = await response.json();
          if (data.success) {
            setCashInfo(data.data);
            setMaxCashAvailable(data.data.money);
          }
        }
      } catch (error) {
        console.error("Error fetching cash info:", error);
      }
    };

    fetchCashInfo();
  }, [apiUrl]);

  // Fetch thông tin phòng và khách sạn
  useEffect(() => {
    const fetchRoomAndHotel = async () => {
      try {
        const roomResponse = await fetch(`${apiUrl}/rooms/${roomId}`);
        const roomData = await roomResponse.json();
        if (roomData.success) {
          setRoom(roomData.data);
          // Fetch thông tin khách sạn dựa trên hotelId từ room
          const hotelResponse = await fetch(
            `${apiUrl}/hotels/${roomData.data.hotel._id}`
          );
          const hotelData = await hotelResponse.json();
          if (hotelData.success) {
            setHotel(hotelData.data);
          }
        }
      } catch (error) {
        console.error("Error fetching room and hotel:", error);
      }
    };

    fetchRoomAndHotel();
  }, [roomId, apiUrl]);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    });
  };

  const nights = Math.max(
    1,
    Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    )
  );
  
  const handleContactChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handleGuestChange = (e) => {
    setGuestInfo({ ...guestInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentReturn = useCallback(
    async (success) => {
      if (success) {
        try {
          const savedHotelName = localStorage.getItem("hotelName"); // Lấy hotelName từ localStorage
          const savedRoomName = localStorage.getItem("roomName"); // Lấy roomName từ localStorage
          const savedContactInfo = JSON.parse(
            localStorage.getItem("contactInfo")
          );
          const savedGuestInfo = JSON.parse(localStorage.getItem("guestInfo"));
          const savedNote = localStorage.getItem("note");
          const savedIsBookingForOthers =
            localStorage.getItem("isBookingForOthers");
          const savedRoomId = localStorage.getItem("roomId");
          const savedPrice = localStorage.getItem("amountToPay"); // Lấy hotelId từ localStorage
          const savedImage = localStorage.getItem("image"); // Lấy hình ảnh từ localStorage
          const cashToUse = Number(localStorage.getItem("cashToUse") || 0); // Lấy số tiền cash đã sử dụng từ localStorageeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee

          console.log("Order request payload:", {
          user: JSON.parse(localStorage.getItem("user"))._id,
          serviceType: "Hotel",
          serviceId: savedRoomId,
          hotelName: savedHotelName,
          roomName: savedRoomName,
          quantity: 1,
          totalPrice: Number(savedPrice.toString().replace(/\./g, "")),
          contactInfo: savedContactInfo,
          guestInfo: savedIsBookingForOthers === "true" && savedGuestInfo ? savedGuestInfo : savedContactInfo,
          note: savedNote,
          imageRoom: savedImage,
        });
          // Gọi API tạo Order
          const response = await fetch(`${apiUrl}/orders/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: JSON.parse(localStorage.getItem("user"))._id,
              serviceType: "Hotel",
              serviceId: savedRoomId,
              hotelName: savedHotelName,
              roomName: savedRoomName,
              quantity: 1,
              totalPrice: Number(savedPrice.toString().replace(/\./g, "")),
              contactInfo: savedContactInfo,
              guestInfo: savedIsBookingForOthers
                ? savedGuestInfo
                : savedContactInfo,
              note: savedNote,
              imageRoom: savedImage,
              cashUsed: cashToUse, // Sử dụng cash nếu có
              checkIn: localStorage.getItem("checkIn"),
              checkOut: localStorage.getItem("checkOut"),
            }),
          });
          const data = await response.json();
          console.log("Order created:", data);
          if (data.success) {
            alert("Đặt phòng thành công!");
            navigate("/account?tab=booking"); // Chuyển đến trang BookingHistory
          } else {
            alert("Không thể lưu thông tin đặt phòng. Vui lòng thử lại!");
            navigate(`/checkout?id=${savedRoomId}`);
          }
        } catch (error) {
          console.error("Error creating order:", error);
          alert("Có lỗi xảy ra khi lưu thông tin đặt phòng!");
        }
      } else {
        const savedRoomId = localStorage.getItem("roomId");
        alert("Thanh toán thất bại. Vui lòng thử lại!");
        navigate(`/checkout?id=${savedRoomId}`); // Quay lại trang thanh toán
      }
      localStorage.removeItem("paymentProcessed");
      localStorage.removeItem("hotelName"); // Xóa thông tin khỏi localStorage
      localStorage.removeItem("roomName"); // Xóa thông tin khỏi localStorage
      localStorage.removeItem("contactInfo");
      localStorage.removeItem("guestInfo");
      localStorage.removeItem("note");
      localStorage.removeItem("isBookingForOthers");
      localStorage.removeItem("roomId");
      localStorage.removeItem("price");
      localStorage.removeItem("image"); // Xóa thông tin khỏi localStorage
    },
    [apiUrl, navigate]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");

    if (hasProcessedRef.current) return;

    if (success === "true") {
      handlePaymentReturn(true);
      hasProcessedRef.current = true;
    } else if (success === "false") {
      handlePaymentReturn(false);
      hasProcessedRef.current = true;
    }
  }, [handlePaymentReturn]);

  const handleConfirmPayment = async () => {
    try {
      if (!validateInfo()) {
        alert("Vui lòng điền đầy đủ thông tin trước khi thanh toán!");
        return;
      }
      const cashToUse = useCash 
      ? Math.min(cashAmount, maxCashAvailable, finalPrice, MAX_CASH_PER_HOTEL_BOOKING) 
      : 0;
      const amountToPay = finalPrice - cashToUse;
      // localStorage.setItem("paymentProcessed", "false"); // Lưu giá phòng vào localStorage
      localStorage.setItem("hotelName", hotel.name); // Lưu tên khách sạn vào localStorage
      localStorage.setItem("roomName", room.name); // Lưu tên loại phòng vào localStorage
      localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
      localStorage.setItem("guestInfo", JSON.stringify(guestInfo));
      localStorage.setItem("note", note);
      localStorage.setItem("isBookingForOthers", isBookingForOthers);
      localStorage.setItem("roomId", roomId);
      localStorage.setItem("price", room.price);
      localStorage.setItem("image", room.images[0]);
      localStorage.setItem("finalPrice", finalPrice.toString());
      localStorage.setItem("amountToPay", amountToPay.toString());
      localStorage.setItem("cashToUse", cashToUse.toString()); 
      localStorage.setItem("checkIn", checkIn);
      localStorage.setItem("checkOut", checkOut);

      const response = await fetch(`${apiUrl}/payment/create_payment_url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(localStorage.getItem("amountToPay")),
          bankCode: "",
          language: "vn",
          serviceType: "Hotel"
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url; // Chuyển hướng đến VNPay
      } else {
        alert("Không thể tạo thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Có lỗi xảy ra khi xác nhận thanh toán!");
    }
  };

  const validateInfo = () => {
    const newErrors = { contactInfo: {}, guestInfo: {} };

    // Kiểm tra thông tin liên hệ
    if (!contactInfo.fullName)
      newErrors.contactInfo.fullName = "Bạn chưa nhập Họ và Tên";
    if (!contactInfo.email) newErrors.contactInfo.email = "Bạn chưa nhập Email";
    if (!contactInfo.phone)
      newErrors.contactInfo.phone = "Bạn chưa nhập Số điện thoại";

    // Kiểm tra thông tin khách nhận phòng (nếu đặt cho người khác)
    if (isBookingForOthers) {
      if (!guestInfo.fullName)
        newErrors.guestInfo.fullName = "Bạn chưa nhập Họ và Tên";
      if (!guestInfo.email) newErrors.guestInfo.email = "Bạn chưa nhập Email";
      if (!guestInfo.phone)
        newErrors.guestInfo.phone = "Bạn chưa nhập Số điện thoại";
    }

    setErrors(newErrors);

    // Trả về true nếu không có lỗi
    return (
      Object.keys(newErrors.contactInfo).length === 0 &&
      Object.keys(newErrors.guestInfo).length === 0
    );
  };

  if (!room || !hotel) {
    return <p>Đang tải thông tin...</p>;
  }

  const basePrice = room.price;
  const finalPrice = basePrice * nights + room.serviceFee;

  return (
  <div className="checkout-container">
    <div className="checkout-content">
      {/* Left Side - Booking Details */}
      <div className="booking-details">
        {/* Hotel Info Section */}
        <div className="hotel-card">
          <div className="hotel-image-container">
            <img src={hotel.images[0]} alt="Hotel" className="hotel-image" />
          </div>
          <div className="hotel-info">
            <h2 className="hotel-name">{hotel.name}</h2>
            <div className="hotel-location">
              <FaMapMarkerAlt className="location-icon" />
              <span>{hotel.address}</span>
            </div>
            
            {/* <div className="booking-dates">
              <div className="date-item">
                <FaCalendarAlt className="date-icon" />
                <div>
                  <div className="date-label">Nhận phòng</div>
                  <div className="date-value">{formatDate(checkIn)}</div>
                </div>
              </div>
              <div className="date-item">
                <FaCalendarAlt className="date-icon" />
                <div>
                  <div className="date-label">Trả phòng</div>
                  <div className="date-value">{formatDate(checkOut)}</div>
                </div>
              </div>
            </div> */}
            
            <div className="date-picker-container">
              <div className="date-box">
                <label>Nhận phòng</label>
                <input
                  type="date"
                  value={new Date(checkIn).toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
                <span className="time-note">Từ 14:00</span>
              </div>

              <div className="date-box">
                <label>Trả phòng</label>
                <input
                  type="date"
                  value={new Date(checkOut).toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                <span className="time-note">Trước 12:00</span>
              </div>
            </div>
            <div className="stay-summary">
              <p>
                🏨 {nights} đêm | {room.price.toLocaleString("vi-VN")}₫ / đêm
              </p>
              <p>
                📅 {new Date(checkIn).toLocaleDateString("vi-VN")} →{" "}
                {new Date(checkOut).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="section-container">
          <h3 className="section-title">Thông tin liên hệ</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                name="fullName"
                className="form-input"
                value={contactInfo.fullName}
                onChange={handleContactChange}
                placeholder="Nhập họ tên"
              />
              {errors.contactInfo.fullName && (
                <p className="error-message">{errors.contactInfo.fullName}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={contactInfo.email}
                onChange={handleContactChange}
                placeholder="Nhập email"
              />
              {errors.contactInfo.email && (
                <p className="error-message">{errors.contactInfo.email}</p>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={contactInfo.phone}
                onChange={handleContactChange}
                placeholder="Nhập số điện thoại"
              />
              {errors.contactInfo.phone && (
                <p className="error-message">{errors.contactInfo.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="checkbox-container">
          <input
            type="checkbox"
            id="bookingForOthers"
            checked={isBookingForOthers}
            onChange={(e) => setIsBookingForOthers(e.target.checked)}
          />
          <label htmlFor="bookingForOthers" className="checkbox-label">
            Tôi đặt phòng giúp cho người khác
          </label>
        </div>

        {isBookingForOthers && (
          <div className="section-container">
            <h3 className="section-title">Thông tin khách nhận phòng</h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={guestInfo.fullName}
                  onChange={handleGuestChange}
                  placeholder="Nhập họ tên"
                />
                {errors.guestInfo.fullName && (
                  <p className="error-message">{errors.guestInfo.fullName}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={guestInfo.email}
                  onChange={handleGuestChange}
                  placeholder="Nhập email"
                />
                {errors.guestInfo.email && (
                  <p className="error-message">{errors.guestInfo.email}</p>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  value={guestInfo.phone}
                  onChange={handleGuestChange}
                  placeholder="Nhập số điện thoại"
                />
                {errors.guestInfo.phone && (
                  <p className="error-message">{errors.guestInfo.phone}</p>
                )}
              </div>
              <input type="date" onChange={(e) => setCheckIn(e.target.value)} />
              <input type="date" onChange={(e) => setCheckOut(e.target.value)} />
            </div>
          </div>
        )}

        {/* Special Requests */}
        <div className="section-container">
          <h3 className="section-title">Yêu cầu đặc biệt</h3>
          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Nhập yêu cầu của bạn..."
              rows="4"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="form-note">
              * Lưu ý: Các yêu cầu phụ thuộc vào tình trạng phòng khách sạn.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Payment Summary */}
      <div className="payment-summary">
        {/* Room Card */}
        <div className="room-card">
          <div className="room-image-container">
            <img src={room.images[0]} alt="Room" className="room-image" />
          </div>
          <h3 className="room-title">{room.name}</h3>
          <ul className="room-features">
            <li className="feature-item">
              <span className="feature-icon">👥</span>
              <span>{room.capacity} Người</span>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🛏</span>
              <span>{room.beds}</span>
            </li>
            <li className="feature-item">
              <span className="feature-icon">🌅</span>
              <span>{room.view}</span>
            </li>
          </ul>
        </div>

        {/* Included Services */}
        <div className="included-services">
          <h4 className="services-title">Ưu đãi bao gồm</h4>
          <ul className="services-list">
            <li className="service-item">{room.policies.breakfast}</li>
            <li className="service-item">{room.policies.extra}</li>
          </ul>
        </div>

        {/* Cash Payment Section */}
        {cashInfo && cashInfo.money > 0 && (
          <div className="cash-section">
            <div className="cash-toggle">
              <input
                type="checkbox"
                id="useCash"
                checked={useCash}
                onChange={(e) => setUseCash(e.target.checked)}
              />
              <label htmlFor="useCash" className="cash-label">
                Sử dụng ví Cash (Có {cashInfo.money.toLocaleString()}₫)
              </label>
            </div>

            {useCash && (
              <div className="cash-controls">
                <input
                  type="range"
                  min="0"
                  max={Math.min(maxCashAvailable, finalPrice, MAX_CASH_PER_HOTEL_BOOKING)}
                  value={cashAmount}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="cash-slider"
                />
                <div className="cash-amount-info">
                  <span>Sử dụng: {cashAmount.toLocaleString()}₫</span>
                  <span>Tối đa: {Math.min(maxCashAvailable, finalPrice, MAX_CASH_PER_HOTEL_BOOKING).toLocaleString()}₫</span>
                </div>
                <div className="cash-remaining">
                  Sau khi sử dụng cash: <strong>{(finalPrice - cashAmount).toLocaleString()}₫</strong>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="price-breakdown">
          <h3 className="price-title">Chi tiết giá</h3>
          <div className="price-item">
            <span>Giá tính theo số đêm:</span>
            <span className="original-price">
              {(room.price * nights).toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="price-item">
            {/* <span>Giảm giá còn:</span>
            <span className="discounted-price">
              {Number(localStorage.getItem("discountedPrice")).toLocaleString("vi-VN")}₫
            </span> */}
          </div>
          {useCash && (
            <div className="price-item">
              <span>Sử dụng Cash:</span>
              <span className="cash-used">
                -{cashAmount.toLocaleString("vi-VN")}₫
              </span>
            </div>
          )}
          <div className="price-item">
            <span>Thuế và phí:</span>
            <span className="service-fee">
              {Number(room.serviceFee.toString().replace(/\./g, "")).toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="price-total">
            <span>Tổng cộng:</span>
            <span className="total-amount">
              {(finalPrice - (useCash ? cashAmount : 0)).toLocaleString("vi-VN")}₫
            </span>
          </div>
          {room.cashback > 0 && (
            <div className="cashback-notice">
              Nhận ngay {calculateCashback(room.cashback, cashInfo?.level).toLocaleString("vi-VN")}₫ 
              vào ví Cash sau khi đặt phòng thành công!
            </div>
          )}
        </div>

        {/* Payment Button */}
        <button className="payment-button" onClick={handleConfirmPayment}>
          Xác nhận thanh toán
        </button>
      </div>
    </div>
  </div>
);
};

function calculateCashback(baseCashback, level) {
  switch (level) {
    case "silver":
      return Math.round(baseCashback * 1.1);
    case "gold":
      return Math.round(baseCashback * 1.2);
    case "diamond":
      return Math.round(baseCashback * 1.5);
    default:
      return baseCashback;
  }
}

export default HotelCheckout;
