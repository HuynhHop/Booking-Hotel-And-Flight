import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import Roomtable from "../Components/Roomtable";
import { Link } from "react-router-dom";

const ManagerRoom = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Room</span>
            <Link
              to="/admin/rooms/roomId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New Room</span>
            </Link>
          </div>
          <Roomtable />
        </div>
      </div>
    </div>
  );
};

export default ManagerRoom;
