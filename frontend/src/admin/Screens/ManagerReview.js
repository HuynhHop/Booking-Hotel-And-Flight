import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/managerlesson.scss";
import Reviewtable from "../Components/Reviewtable";
import { Link } from "react-router-dom";

const ManagerReview = () => {
  return (
    <div className="product">
      <Sidebar />
      <div className="productContainer">
        <Navbar />
        <div className="productList">
          <div className="datatableTitle">
            <span>Manager Review</span>
            {/* <Link
              to="/admin/reviews/reviewId/new"
              style={{ textDecoration: "none" }}
            >
              <span className="link">Add New Review</span>
            </Link> */}
          </div>
          <Reviewtable />
        </div>
      </div>
    </div>
  );
};

export default ManagerReview;
