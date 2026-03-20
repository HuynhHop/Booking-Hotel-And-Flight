import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import "../css/BookingHistory.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingHistory = () => {
  const [orders, setOrders] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchOrders();
  }, [apiUrl]);

  const fetchOrders = async () => {
    try {
      const userId = JSON.parse(localStorage.getItem("user"))._id;
      const response = await fetch(`${apiUrl}/orders/user/${userId}`);
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        // Lọc chỉ hiển thị các đơn có status khác "Cancelled"
        const activeOrders = data.data.filter(order => order.status !== "Cancelled");
        setOrders(activeOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "Processing" }),
      });

      if (response.ok) {
        // Hiển thị thông báo cho khách hàng
        toast.success("Yêu cầu hủy đơn đã được gửi đến quản trị viên", {
          position: "top-right",
          autoClose: 3000,
        });
        fetchOrders();
      } else {
        toast.error("Hủy đơn không thành công");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Đã xảy ra lỗi khi hủy đơn");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Paid":
        return "status-paid";
      case "Cancelled":
        return "status-cancelled";
      case "Reserved":
        return "status-reserved";
      case "Refunded":
        return "status-refunded";
      default:
        return "status-default";
    }
  };

  return (
    <div className="booking-history">
      <h3>Danh sách đơn phòng</h3>
      <ToastContainer />
      <p>Xem lại các đơn phòng đã đặt trước đây tại đây.</p>
      {Array.isArray(orders) && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="order-item form-grid">
            <div className="order-image">
              <img
                src={order.imageRoom || "../assets/Premium.jpg"}
                alt="Room"
              />
            </div>
            <div className="order-details">
              <h4 className="hotel-name">
                {order.hotelName || "Tên khách sạn"}
              </h4>
              <p>
                Phòng:{" "}
                <span className="room-name">
                  {order.roomName || "Loại phòng"}
                </span>
              </p>
              <p>
                Giá:{" "}
                <span className="total-price">
                  {order.totalPrice?.toLocaleString() || "0"} VND
                </span>
              </p>
              <p>
                Trạng thái:{" "}
                <span className={getStatusClass(order.status)}>
                  {order.status}
                </span>
              </p>
              <p>
                Nhận phòng:{" "}
                <span>
                  {order.checkIn
                    ? new Date(order.checkIn).toLocaleString()
                    : "N/A"}
                </span>
              </p>

              <p>
                Trả phòng:{" "}
                <span>
                  {order.checkOut
                    ? new Date(order.checkOut).toLocaleString()
                    : "N/A"}
                </span>
              </p>
              <p>
                Ghi chú:{" "}
                <span className="note">{order.note || "Không có ghi chú"}</span>
              </p>
              
              {order.status === "Paid" && (
                <button 
                  className="cancel-button"
                  onClick={() => handleCancelOrder(order._id)}
                >
                  <FaTimes /> Hủy đơn
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>Không có đơn phòng nào.</p>
      )}
    </div>
  );
};

export default BookingHistory;