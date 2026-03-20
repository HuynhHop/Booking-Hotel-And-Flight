import React, { useState, useEffect } from "react";
import "../css/AccountManagement.css"; // Import CSS cho

const AccountManagement = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    fullname: "",
    phone: "",
    avatar: "",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false); // Hộp thoại xác nhận

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData({
        fullname: user.fullname || "",
        phone: user.phone || "",
        avatar: user.avatar || "https://via.placeholder.com/150",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${apiUrl}/user/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Cập nhật thông tin thành công!");
        localStorage.setItem("user", JSON.stringify({ ...formData })); // Cập nhật localStorage
      } else {
        alert(data.message || "Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  const handleDisableAccount = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user từ localStorage
      const userId = user._id; // Lấy ID của người dùng

      const response = await fetch(`${apiUrl}/user/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        alert("Tài khoản đã bị vô hiệu hóa!");
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        window.location.href = "/home"; // Điều hướng về trang chủ
      } else {
        alert(data.message || "Vô hiệu hóa tài khoản thất bại!");
      }
    } catch (error) {
      console.error("Error disabling account:", error);
      alert("Có lỗi xảy ra khi vô hiệu hóa tài khoản!");
    }
  };

  return (
    <div>
      <h3>Thông tin tài khoản</h3>
      {/* <p>Chỉnh sửa thông tin cá nhân và mật khẩu tại đây.</p> */}

      <div className="avatar-section">
        <img
          src={formData.avatar}
          alt="Avatar"
          className="avatar"
          onClick={() => document.getElementById("avatarInput").click()}
        />
        <input
          type="file"
          id="avatarInput"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleAvatarChange}
        />
      </div>
      <div className="form-section">
        <label>Họ và tên:</label>
        <input
          type="text"
          name="fullname"
          value={formData.fullname}
          onChange={handleChange}
        />
        <label>Số điện thoại:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <button onClick={handleUpdateProfile}>Lưu lại</button>
      {/* <button
        className="disable-account"
        onClick={() => setShowConfirmDialog(true)}
      >
        Vô hiệu hóa tài khoản
      </button> */}

      {showConfirmDialog && (
        <div className="confirm-dialog">
          <p>Bạn có chắc chắn muốn vô hiệu hóa tài khoản?</p>
          <button onClick={handleDisableAccount}>Đồng ý</button>
          <button onClick={() => setShowConfirmDialog(false)}>Hủy</button>
        </div>
      )}
    </div>
  );
};

export default AccountManagement;
