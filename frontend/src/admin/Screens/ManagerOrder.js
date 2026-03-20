import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import { Link } from "react-router-dom";
import Ordertable from "../Components/Ordertable";

const ManagerOrder = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Order</span>
            <Link
              to="/admin/orders/orderId/new"
              style={{ textDecoration: "none" }}
            >
              {/* <span className="link">Add New Order</span> */}
            </Link>
          </div>
          <Ordertable />
        </div>
      </div>
    </div>
  );
};

export default ManagerOrder;
