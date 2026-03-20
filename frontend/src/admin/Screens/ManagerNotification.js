import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import Reviewtable from "../Components/Reviewtable";
import { Link } from "react-router-dom";

const ManagerNotification = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Notification</span>
            <Link
              to="/admin/notifications/notificationId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New Notification</span>
            </Link>
          </div>
          <Reviewtable />
        </div>
      </div>
    </div>
  );
};

export default ManagerNotification;
