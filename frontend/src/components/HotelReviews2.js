import React, { useEffect, useState } from "react";
import "../css/HotelReview2.css";
import { FaStar, FaCalendarAlt, FaPlusCircle, FaTrash } from "react-icons/fa";

const HotelReviews2 = ({ hotelId, closeModal }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));


  const [formData, setFormData] = useState({
    name: "",
    groupType: "Cặp đôi",
    roomType: "",
    nights: 1,
    rating: 10,
    content: "",
  });

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${apiUrl}/comments/${hotelId}`);
        const data = await res.json();
        setComments(data);
        setFilteredComments(data);
      } catch (error) {
        console.error("Lỗi khi lấy comment:", error);
      }
    };
    if (hotelId) fetchComments();
  }, [hotelId, apiUrl]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const filterByGroup = (groupType) => {
    setActiveFilter(groupType);
    if (groupType === "Tất cả") {
      setFilteredComments(comments);
    } else {
      setFilteredComments(comments.filter((c) => c.groupType === groupType));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fullname = user?.fullname || "Ẩn danh";

      const res = await fetch(`${apiUrl}/comments/${hotelId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, name: fullname }),
      });

      const newComment = await res.json();
      setComments([newComment, ...comments]);
      setFilteredComments([newComment, ...filteredComments]);
      setShowForm(false);
      setFormData({
        name: "",
        groupType: "Cặp đôi",
        roomType: "",
        nights: 1,
        rating: 10,
        content: "",
      });
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const res = await fetch(`${apiUrl}/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          // Nếu cần token auth, thêm vào đây
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Xóa bình luận thất bại: " + errData.message);
        return;
      }

      // Xóa thành công, cập nhật lại danh sách comment
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setFilteredComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  return (
    <div className="hotel-review2-container">
      <div className="modal-header">
        <h2>Đánh giá</h2>
        <button className="close-btn" onClick={closeModal}>
          ×
        </button>
      </div>

      <div className="review-actions">
        <div className="review-filters">
          {["Tất cả", "Cặp đôi", "Gia đình", "Bạn bè", "Du lịch một mình"].map((type) => (
            <button
              key={type}
              className={activeFilter === type ? "active" : ""}
              onClick={() => filterByGroup(type)}
            >
              {type}
            </button>
          ))}
        </div>
        <button className="add-review-btn" onClick={() => setShowForm(true)}>
          <FaPlusCircle /> Thêm
        </button>
      </div>

      <div className="review-list">
        {filteredComments.length === 0 ? (
          <p>Chưa có bình luận nào.</p>
        ) : (
          filteredComments.map((comment, index) => (
            <div className="review-card" key={index}>
              <div className="review-avatar">
                {comment.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="review-content">
                <div className="review-header">
                  <h4>{comment.name || "Ẩn danh"}</h4>
                  {(user?.fullname === comment.name || user?.isAdmin) && (
                    <button
                      className="delete-btn"
                      title="Xóa bình luận"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
                <div className="meta">
                  <span>
                    <FaCalendarAlt /> {formatDate(comment.createdAt)}
                  </span>
                  <span>
                    {comment.nights} đêm • {comment.roomType} • {comment.groupType}
                  </span>
                </div>
                <div className="rating">
                  {comment.rating} <FaStar color="crimson" />{" "}
                  {comment.rating >= 9
                    ? "Tuyệt vời"
                    : comment.rating >= 7
                    ? "Tốt"
                    : comment.rating >= 5
                    ? "Tạm ổn"
                    : comment.rating >= 3
                    ? "Hơi tệ"
                    : "Tệ"}
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Thêm đánh giá mới</h3>
            <form onSubmit={handleSubmit}>
              {/* <input
                type="text"
                placeholder="Tên của bạn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              /> */}
              <select
                value={formData.groupType}
                onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
              >
                <option value="Cặp đôi">Cặp đôi</option>
                <option value="Gia đình">Gia đình</option>
                <option value="Bạn bè">Bạn bè</option>
                <option value="Du lịch một mình">Du lịch một mình</option>
              </select>
              <input
                type="text"
                placeholder="Loại phòng"
                value={formData.roomType}
                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
              />
              <input
                type="number"
                placeholder="Số đêm"
                min={1}
                value={formData.nights}
                onChange={(e) =>
                  setFormData({ ...formData, nights: parseInt(e.target.value) })
                }
              />
              <input
                type="number"
                placeholder="Điểm đánh giá (1-10)"
                min={1}
                max={10}
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
              />
              <textarea
                placeholder="Nội dung đánh giá"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
              <div className="form-actions">
                <button type="submit">Gửi đánh giá</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Huỷ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelReviews2;
