import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import Airlinetable from "../Components/Airlinetable";

const ManagerAirline = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Airline</span>
            <Link
              to="/admin/airlines/airlineId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New Airline</span>
            </Link>
          </div>
          <Airlinetable />
        </div>
      </div>
    </div>
  );
};

export default ManagerAirline;
