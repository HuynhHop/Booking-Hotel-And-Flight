import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/HotelCheckout.css";
import { FaPlane, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useRef } from "react";

const FlightCheckout = () => {
  const hasProcessedRef = useRef(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const [flight, setFlight] = useState(null);
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [passengerInfo, setPassengerInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    contactInfo: {},
    passengerInfo: {},
  });
  const [note, setNote] = useState("");
  const [isBookingForOthers, setIsBookingForOthers] = useState(false);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await fetch(`${apiUrl}/flights/${id}`);
        const data = await res.json();
        setFlight(data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu chuyến bay:", err);
      }
    };
    fetchFlight();
  }, [id, apiUrl]);

  const handleContactChange = (e) => {
    setContactInfo({ ...contactInfo, [e.target.name]: e.target.value });
  };

  const handlePassengerChange = (e) => {
    setPassengerInfo({ ...passengerInfo, [e.target.name]: e.target.value });
  };

  const handlePaymentReturn = useCallback(
    async (success) => {
      if (success) {
        try {
          const savedContactInfo = JSON.parse(localStorage.getItem("contactInfo"));
          const savedPassengerInfo = JSON.parse(localStorage.getItem("passengerInfo"));
          const savedNote = localStorage.getItem("note");
          const savedIsBookingForOthers = localStorage.getItem("isBookingForOthers");
          const savedFlightId = localStorage.getItem("flightId");
          const savedPrice = localStorage.getItem("price");

          const response = await fetch(`${apiUrl}/order-flight/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user: JSON.parse(localStorage.getItem("user"))._id,
              flight: savedFlightId,
              totalPrice: Number(savedPrice.toString().replace(/\./g, "")),
              contactInfo: savedContactInfo,
              passengerInfo: savedIsBookingForOthers === "true" ? savedPassengerInfo : savedContactInfo,
              note: savedNote,
            }),
          });
          
          const data = await response.json();
          if (data.success) {
            alert("Đặt vé thành công!");
            navigate("/account?tab=flight");
          } else {
            alert("Không thể lưu thông tin đặt vé. Vui lòng thử lại!");
            navigate(`/checkout-flight/${savedFlightId}`);
          }
        } catch (error) {
          console.error("Error creating order:", error);
          alert("Có lỗi xảy ra khi lưu thông tin đặt vé!");
        }
      } else {
        const savedFlightId = localStorage.getItem("flightId");
        alert("Thanh toán thất bại. Vui lòng thử lại!");
        navigate(`/checkout-flight/${savedFlightId}`);
      }
      
      localStorage.removeItem("paymentProcessed");
      localStorage.removeItem("flightNumber");
      localStorage.removeItem("airline");
      localStorage.removeItem("contactInfo");
      localStorage.removeItem("passengerInfo");
      localStorage.removeItem("note");
      localStorage.removeItem("isBookingForOthers");
      localStorage.removeItem("flightId");
      localStorage.removeItem("price");
      localStorage.removeItem("image");
      localStorage.removeItem("departure");
      localStorage.removeItem("destination");
      localStorage.removeItem("departureTime");
      localStorage.removeItem("arrivalTime");
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

      localStorage.setItem("flightNumber", flight.flightNumber);
      localStorage.setItem("airline", flight.airline);
      localStorage.setItem("contactInfo", JSON.stringify(contactInfo));
      localStorage.setItem("passengerInfo", JSON.stringify(passengerInfo));
      localStorage.setItem("note", note);
      localStorage.setItem("isBookingForOthers", isBookingForOthers);
      localStorage.setItem("flightId", id);
      localStorage.setItem("price", (flight.originalPrice || 0) + (flight.taxPrice || 0));
      localStorage.setItem("image", flight.image);
      localStorage.setItem("departure", flight.departure);
      localStorage.setItem("destination", flight.destination);
      localStorage.setItem("departureTime", flight.departureTime);
      localStorage.setItem("arrivalTime", flight.arrivalTime);

      const response = await fetch(`${apiUrl}/payment/create_payment_url`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(((flight.originalPrice || 0) + (flight.taxPrice || 0)).toString().replace(/\./g, "")),
          bankCode: "",
          language: "vn",
          serviceType: "Flight"
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Không thể tạo thanh toán. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      alert("Có lỗi xảy ra khi xác nhận thanh toán!");
    }
  };

  const validateInfo = () => {
    const newErrors = { contactInfo: {}, passengerInfo: {} };

    if (!contactInfo.fullName) newErrors.contactInfo.fullName = "Bạn chưa nhập Họ và Tên";
    if (!contactInfo.email) newErrors.contactInfo.email = "Bạn chưa nhập Email";
    if (!contactInfo.phone) newErrors.contactInfo.phone = "Bạn chưa nhập Số điện thoại";

    if (isBookingForOthers) {
      if (!passengerInfo.fullName) newErrors.passengerInfo.fullName = "Bạn chưa nhập Họ và Tên";
      if (!passengerInfo.email) newErrors.passengerInfo.email = "Bạn chưa nhập Email";
      if (!passengerInfo.phone) newErrors.passengerInfo.phone = "Bạn chưa nhập Số điện thoại";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors.contactInfo).length === 0 &&
      Object.keys(newErrors.passengerInfo).length === 0
    );
  };

  if (!flight) return <div className="section-container">Đang tải thông tin chuyến bay...</div>;

  const flightDuration = Math.floor((new Date(flight.arrivalTime) - new Date(flight.departureTime)) / (1000 * 60 * 60));

  return (
    <div className="checkout-container">
      <div className="checkout-content">
        <div className="left-side">
          {/* Flight Card */}
          <div className="hotel-card">
            <div className="hotel-image-container">
              <img src={flight.image} alt={flight.airline} className="hotel-image" />
            </div>
            <div className="hotel-info">
              <h2 className="hotel-name">{flight.airline} - {flight.flightNumber}</h2>
              <div className="hotel-location">
                <FaMapMarkerAlt className="location-icon" />
                <span>{flight.departure} → {flight.destination}</span>
              </div>
              
              <div className="booking-dates">
                <div className="date-item">
                  <FaCalendarAlt className="date-icon" />
                  <div>
                    <div className="date-label">KHỞI HÀNH</div>
                    <div className="date-value">
                      {new Date(flight.departureTime).toLocaleString("vi-VN", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                <div className="date-item">
                  <FaCalendarAlt className="date-icon" />
                  <div>
                    <div className="date-label">ĐẾN NƠI</div>
                    <div className="date-value">
                      {new Date(flight.arrivalTime).toLocaleString("vi-VN", {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="booking-summary">
                <div className="summary-item">
                  <span className="summary-label">Thời gian bay</span>
                  <span className="summary-value">{flightDuration} giờ</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Hạng vé</span>
                  <span className="summary-value">Phổ thông</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Hành lý</span>
                  <span className="summary-value">7kg xách tay</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="section-container">
            <h3 className="section-title">
              <FaUser /> Thông tin liên hệ
            </h3>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Họ và tên</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  value={contactInfo.fullName}
                  onChange={handleContactChange}
                />
                {errors.contactInfo.fullName && (
                  <div className="error-message">{errors.contactInfo.fullName}</div>
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
                />
                {errors.contactInfo.email && (
                  <div className="error-message">{errors.contactInfo.email}</div>
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
                />
                {errors.contactInfo.phone && (
                  <div className="error-message">{errors.contactInfo.phone}</div>
                )}
              </div>
            </div>
          </div>

          {/* Booking for others */}
          <div className="section-container">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="bookingForOthers"
                checked={isBookingForOthers}
                onChange={(e) => setIsBookingForOthers(e.target.checked)}
              />
              <label htmlFor="bookingForOthers" className="checkbox-label">
                Tôi đặt vé cho người khác
              </label>
            </div>

            {isBookingForOthers && (
              <>
                <h3 className="section-title">
                  <FaUser /> Thông tin hành khách
                </h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      className="form-input"
                      value={passengerInfo.fullName}
                      onChange={handlePassengerChange}
                    />
                    {errors.passengerInfo.fullName && (
                      <div className="error-message">{errors.passengerInfo.fullName}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-input"
                      value={passengerInfo.email}
                      onChange={handlePassengerChange}
                    />
                    {errors.passengerInfo.email && (
                      <div className="error-message">{errors.passengerInfo.email}</div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-input"
                      value={passengerInfo.phone}
                      onChange={handlePassengerChange}
                    />
                    {errors.passengerInfo.phone && (
                      <div className="error-message">{errors.passengerInfo.phone}</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Special Request */}
          <div className="section-container">
            <h3 className="section-title">
              <FaEnvelope /> Yêu cầu đặc biệt
            </h3>
            <div className="form-group">
              <textarea
                className="form-textarea"
                placeholder="Nhập yêu cầu của bạn..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <p className="form-note">
                * Lưu ý: Các yêu cầu đặc biệt phụ thuộc vào chính sách của hãng hàng không.
              </p>
            </div>
          </div>
        </div>

        <div className="right-side">
          {/* Flight Details */}
          <div className="section-container">
            <h3 className="section-title">
              <FaPlane /> Chi tiết chuyến bay
            </h3>
            <div className="booking-dates">
              <div className="date-item">
                <FaMapMarkerAlt className="date-icon" />
                <div>
                  <div className="date-label">ĐIỂM ĐI</div>
                  <div className="date-value">{flight.departure}</div>
                </div>
              </div>
              <div className="date-item">
                <FaMapMarkerAlt className="date-icon" />
                <div>
                  <div className="date-label">ĐIỂM ĐẾN</div>
                  <div className="date-value">{flight.destination}</div>
                </div>
              </div>
            </div>
            <div className="booking-dates">
              <div className="date-item">
                <FaCalendarAlt className="date-icon" />
                <div>
                  <div className="date-label">KHỞI HÀNH</div>
                  <div className="date-value">
                    {new Date(flight.departureTime).toLocaleString("vi-VN", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="date-item">
                <FaCalendarAlt className="date-icon" />
                <div>
                  <div className="date-label">ĐẾN NƠI</div>
                  <div className="date-value">
                    {new Date(flight.arrivalTime).toLocaleString("vi-VN", {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="booking-summary">
              <div className="summary-item">
                <span className="summary-label">Hãng hàng không</span>
                <span className="summary-value">{flight.airline}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Số hiệu chuyến bay</span>
                <span className="summary-value">{flight.flightNumber}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Thời gian bay</span>
                <span className="summary-value">{flightDuration} giờ</span>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="section-container">
            <h3 className="section-title">Chi tiết giá</h3>
            <div className="price-item">
              <span>Giá vé</span>
              <span>{flight.originalPrice?.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="price-item">
              <span>Thuế & Phí</span>
              <span>{flight.taxPrice?.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className="price-total">
              <span>Tổng cộng</span>
              <span className="total-amount">
                {((flight.originalPrice || 0) + (flight.taxPrice || 0)).toLocaleString("vi-VN")}₫
              </span>
            </div>
          </div>

          <button className="payment-button" onClick={handleConfirmPayment}>
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCheckout;