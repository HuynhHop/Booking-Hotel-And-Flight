import React, { useState } from "react";
import Modal from "./Modal";
import "../css/HotelImages.css";

const HotelImages = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return <p>Không có hình ảnh nào để hiển thị.</p>;
  }

  const mainImage = images[0];
  const sideImages = images.slice(1, 4); // chỉ 3 ảnh

  const openImageModal = (index) => {
    setSelectedImageIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const modalContent = (
    <div className="image-modal-content">
      <div className="main-image-container">
        <button className="nav-button prev" onClick={handlePrev}>
          &lt;
        </button>

        <img
          src={images[selectedImageIndex]}
          alt="Hotel"
          className="modal-main-image"
        />

        <button className="nav-button next" onClick={handleNext}>
          &gt;
        </button>
      </div>

      <div className="thumbnail-container">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt=""
            className={`thumbnail ${
              index === selectedImageIndex ? "active" : ""
            }`}
            onClick={() => setSelectedImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="hotel-images">

      {/* MAIN IMAGE */}
      <div className="main-image-wrapper">
        <img
          src={mainImage}
          alt="Main"
          className="main-image"
          onClick={() => openImageModal(0)}
        />
      </div>

      {/* SIDE IMAGES */}
      <div className="side-images">
        {sideImages.map((img, index) => {

          const isLast = index === 2;
          const remaining = images.length - 4;

          return (
            <div
              key={index}
              className="side-image-wrapper"
              onClick={() => openImageModal(index + 1)}
            >
              <img src={img} alt="" />

              {isLast && remaining > 0 && (
                <div className="image-overlay">
                  +{remaining} ảnh
                </div>
              )}

            </div>
          );
        })}
      </div>

      {isModalOpen && (
        <Modal
          content={modalContent}
          closeModal={() => setIsModalOpen(false)}
          width="90%"
          height="90vh"
        />
      )}
    </div>
  );
};

export default HotelImages;