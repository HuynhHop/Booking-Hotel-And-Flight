import React from "react";

const HotelHeader = ({ hotel, onBookClick }) => {
  return (
    <div className="hotel-header">
      {/* <div className="hotel-badge">
        <span className="badge exclusive">Giá độc quyền</span>
      </div> */}
      <h1>{hotel.name}</h1>
      <p className="rating">
        <span className="rating-score">{hotel.starRating}⭐</span> Tuyệt
        vời ({/* {hotel.reviewsCount} */} đánh giá)
      </p>
      <p className="hotel-location">📍 {hotel.address}</p>
      <div className="hotel-price">
        <span className="new-price">
          {hotel.pricePerNight?.toLocaleString()} đ
        </span>
        <button className="book-button" onClick={onBookClick}>
          Chọn phòng
        </button>
      </div>
    </div>
  );
};

export default HotelHeader;
