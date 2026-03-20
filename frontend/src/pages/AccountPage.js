import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AccountManagement from "../components/AccountManagement.js";
import BookingHistory from "../components/BookingHistory";
import FlightHistory from "../components/FlightHistory";
// import CancellationHistory from "../components/CancellationHistory";
import FavoriteList from "../components/FavoriteList";
import CashInfo from "../components/CashInfo.js"; 
import "../css/AccountPage.css";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("account");
  const location = useLocation();

  useEffect(() => {
    // Lấy giá trị tab từ query parameter
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountManagement />;
      case "booking":
        return <BookingHistory />;
      case "flight":
        return <FlightHistory />;
      case "favorite":
        return <FavoriteList />;
      case "cash":
        return <CashInfo />;
      // case "cancellation":
      //   return <CancellationHistory />;
      default:
        return <AccountManagement />;
    }
  };

  return (
    <div className="account-page">
      <div className="tabs">
        <div
          className={`tab ${activeTab === "account" ? "active" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          Quản lý tài khoản
        </div>
        <div
          className={`tab ${activeTab === "booking" ? "active" : ""}`}
          onClick={() => setActiveTab("booking")}
        >
          Đơn phòng
        </div>
        <div
          className={`tab ${activeTab === "flight" ? "active" : ""}`}
          onClick={() => setActiveTab("flight")}
        >
          Chuyến bay
        </div>
        <div
          className={`tab ${activeTab === "favorite" ? "active" : ""}`}
          onClick={() => setActiveTab("favorite")}
        >
          Yêu thích
        </div>
        <div
          className={`tab ${activeTab === "cash" ? "active" : ""}`}
          onClick={() => setActiveTab("cash")}
        >
          Ví Cash
        </div>
        <div
          className={`tab ${activeTab === "cancellation" ? "active" : ""}`}
          onClick={() => setActiveTab("cancellation")}
        >
          Đơn hủy
        </div>
      </div>

      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default AccountPage;
