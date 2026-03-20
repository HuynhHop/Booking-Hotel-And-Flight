import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import TourIcon from "@mui/icons-material/Tour";
import LocalGroceryStoreOutlined from "@mui/icons-material/LocalGroceryStoreOutlined";
import LoyaltyIcon from "@mui/icons-material/Loyalty";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DnsOutlinedIcon from "@mui/icons-material/DnsOutlined";
import DomainOutlinedIcon from "@mui/icons-material/DomainOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AirplaneTicketOutlinedIcon from "@mui/icons-material/AirplaneTicketOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import DiscountOutlinedIcon from "@mui/icons-material/DiscountOutlined";
import "../Style/sidebar.scss";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  // Hàm để xử lý logout
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="top">
        <Link to="/admin/" style={{ textDecoration: "none" }}>
          <span className="logo">Admin Dardboard</span>
        </Link>
      </div>
      <hr />
      <div className="bottom">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/admin/" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>

          {/* <Link to="/admin/" style={{ textDecoration: "none" }}>
            <li>
              <ManageAccountsOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
          </Link> */}

          {/* <Link to="/admin/" style={{ textDecoration: "none" }}>
            <li>
              <CalendarMonthOutlinedIcon className="icon" />
              <span>Calendar</span>
            </li>
          </Link> */}

          <li onClick={handleLogout}>
            <ExitToAppOutlinedIcon className="icon" />
            <span>Logout</span>
          </li>

          <p className="title">LIST</p>
          <Link to="/admin/users" style={{ textDecoration: "none" }}>
            <li>
              <Person3OutlinedIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>

          {/* <Link to="/admin/homes" style={{ textDecoration: "none" }}>
            <li>
              <TourIcon className="icon" />
              <span>HomeStay</span>
            </li>
          </Link> */}

          <Link to="/admin/orders" style={{ textDecoration: "none" }}>
            <li>
              <LocalGroceryStoreOutlined className="icon" />
              <span>Orders</span>
            </li>
          </Link>

          <Link to="/admin/hotels" style={{ textDecoration: "none" }}>
            <li>
              <DomainOutlinedIcon className="icon" />
              <span>Hotels & Services</span>
            </li>
          </Link>

          <Link to="/admin/airlines" style={{ textDecoration: "none" }}>
            <li>
              <AirplaneTicketOutlinedIcon className="icon" />
              <span>Airline Tickets</span>
            </li>
          </Link>

          <Link to="/admin/rooms" style={{ textDecoration: "none" }}>
            <li>
              <LoyaltyIcon className="icon" />
              <span>Room</span>
            </li>
          </Link>

          <Link to="/admin/vouchers" style={{ textDecoration: "none" }}>
            <li>
              <DiscountOutlinedIcon className="icon" />
              <span>Vouchers</span>
            </li>
          </Link>

          <Link to="/admin/reviews" style={{ textDecoration: "none" }}>
            <li>
              <DnsOutlinedIcon className="icon" />
              <span>Hotel Comments</span>
            </li>
          </Link>

          {/* <Link to="/admin/notifications" style={{ textDecoration: "none" }}>
            <li>
              <NotificationsActiveOutlinedIcon className="icon" />
              <span>Notifications</span>
            </li>
          </Link> */}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
