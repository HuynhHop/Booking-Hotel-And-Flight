import React, { useState, useEffect } from "react";
import { FaBell, FaGift } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import "../css/SiteHeader.css";
import logo from "../assets/image.png";
import ChatBox from "./ChatBox";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const User = localStorage.getItem("user");
    if (User) {
      setUser(JSON.parse(User));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    navigate("/home");
  };

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const scrollToSection = (hash) => {
    navigate(`/home${hash}`);
  };

  return (
    <header className="header">
      <div className="container">
        {/* Left Section: Logo & Navigation */}
        <div className="left-section">
          <div className="logo" onClick={() => navigate("/home")}>
            <img src={logo} alt="Logo" />
          </div>
          <nav className="nav-links">
            <div className="nav-item" onClick={() => scrollToSection("#hotelList")}>
              Khách sạn
            </div>
            <div className="nav-item" onClick={() => scrollToSection("#flightList")}>
              Vé máy bay
            </div>
          </nav>
        </div>

        {/* Right Section */}
        <div className="right-menu">
          <FaBell className="icon" />
          <FaGift className="icon" />
          <div className="icon">
            <ChatBox />
          </div>

          {user ? (
            <div className="user-menu">
              <img
                src={user.avatar || "https://via.placeholder.com/40"}
                alt="User Avatar"
                className="user-avatar"
                onClick={() => setMenuOpen(!menuOpen)}
              />
              <span className="user-name">{user.fullname || "Người dùng"}</span>
              {menuOpen && (
                <div className="dropdown-menu">
                  <div onClick={() => handleNavigate("/account")}>Tài khoản</div>
                  <div onClick={() => handleNavigate("/account?tab=favorite")}>Yêu Thích</div>
                  <div onClick={() => handleNavigate("/account?tab=cash")}>Cash</div>
                  <div onClick={() => handleNavigate("/orders")}>Đơn hàng của tôi</div>
                  <div onClick={handleLogout}>Đăng xuất</div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="btn login" onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
              <button className="btn signup" onClick={() => navigate("/signup")}>
                Đăng ký
              </button>
            </>
          )}
          <IoMenu className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <div className="nav-item" onClick={() => scrollToSection("#hotelList")}>
            Khách sạn
          </div>
          <div className="nav-item" onClick={() => scrollToSection("#flightList")}>
            Vé máy bay
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
