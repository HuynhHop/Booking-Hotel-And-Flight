import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import Hoteltable from "../Components/Hoteltable";

const ManagerHotel = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Hotel & Service</span>
            <Link
              to="/admin/hotels/hotelId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New Hotel & Service</span>
            </Link>
          </div>
          <Hoteltable />
        </div>
      </div>
    </div>
  );
};

export default ManagerHotel;
