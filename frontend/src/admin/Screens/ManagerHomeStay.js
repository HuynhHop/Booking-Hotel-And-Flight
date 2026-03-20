import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import Homestable from "../Components/Homestable";

const ManagerHomeStay = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager HomeStay</span>
            <Link
              to="/admin/homes/homesId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New HomeStay</span>
            </Link>
          </div>
          <Homestable />
        </div>
      </div>
    </div>
  );
};

export default ManagerHomeStay;
