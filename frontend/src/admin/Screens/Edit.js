import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import "../Style/new.scss";
import { DriveFolderUploadOutlined } from "@mui/icons-material";

const Edit = ({ inputs, title }) => {
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // Lưu trữ ảnh từ database
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");
  const apiUrl = process.env.REACT_APP_API_URL;

  const { userId, hotelId, roomId, voucherId, airlineId } = useParams();

  const resourceType = userId
    ? "user"
    : hotelId
    ? "hotel"
    : roomId
    ? "room"
    : voucherId
    ? "voucher"
    : airlineId
    ? "flight"
    : "";

  const resourceId = userId || hotelId || roomId || voucherId || airlineId;

  useEffect(() => {
    // Load thông tin từ database
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/${resourceType}s/${resourceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (resourceId === voucherId || resourceId === airlineId) {
          data.success = true;
          data.data = data;
        }
        if (data.success) {
          const fetchedData = data.data;

          // Xử lý các trường đặc biệt
          if (fetchedData.policies) {
            fetchedData["policies.cancellationPolicy"] =
              fetchedData.policies.cancellationPolicy || "";
            fetchedData["policies.paymentPolicy"] =
              fetchedData.policies.paymentPolicy || "";
            fetchedData["policies.cancellation"] =
              fetchedData.policies.cancellation || "";
            fetchedData["policies.breakfast"] =
              fetchedData.policies.breakfast || "";
            fetchedData["policies.confirmation"] =
              fetchedData.policies.confirmation || "";
            fetchedData["policies.invoice"] =
              fetchedData.policies.invoice || "";
            fetchedData["policies.extra"] = fetchedData.policies.extra || "";
            delete fetchedData.policies;
          }

          if (fetchedData.contact) {
            fetchedData["contact.phone"] = fetchedData.contact.phone || "";
            fetchedData["contact.email"] = fetchedData.contact.email || "";
            delete fetchedData.contact;
          }

          if (fetchedData.location) {
            fetchedData["location.lat"] = fetchedData.location.lat || "";
            fetchedData["location.lng"] = fetchedData.location.lng || "";
            delete fetchedData.location;
          }

          if (fetchedData.departureTime) {
            fetchedData.departureTime = new Date(fetchedData.departureTime)
              .toISOString()
              .slice(0, 16);
          }
          if (fetchedData.arrivalTime) {
            fetchedData.arrivalTime = new Date(fetchedData.arrivalTime)
              .toISOString()
              .slice(0, 16);
          }

          if (fetchedData.expiresAt) {
            fetchedData.expiresAt = new Date(fetchedData.expiresAt)
              .toISOString()
              .slice(0, 10);
          }

          if (resourceType === "room") {
            fetchedData.hotel = fetchedData.hotel._id;
          }

          if (fetchedData.images) {
            setExistingImages(fetchedData.images); // Lưu trữ ảnh từ database
          }
          setFormData(fetchedData);
          console.log("Fetched data:", fetchedData);
        } else {
          setError("Failed to fetch resource data.");
        }
      } catch (err) {
        console.error("Error fetching resource data:", err);
        setError("An error occurred while fetching resource data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, resourceType, resourceId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveExistingImage = (indexToRemove) => {
    setExistingImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemoveNewImage = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting...");

    const processedFormData = { ...formData };

    if (
      processedFormData["policies.cancellationPolicy"] ||
      processedFormData["policies.paymentPolicy"]
    ) {
      processedFormData["policies"] = JSON.stringify({
        cancellationPolicy:
          processedFormData["policies.cancellationPolicy"] || "",
        paymentPolicy: processedFormData["policies.paymentPolicy"] || "",
      });
      delete processedFormData["policies.cancellationPolicy"];
      delete processedFormData["policies.paymentPolicy"];
    }

    if (
      processedFormData["contact.phone"] ||
      processedFormData["contact.email"]
    ) {
      processedFormData["contact"] = JSON.stringify({
        phone: processedFormData["contact.phone"] || "",
        email: processedFormData["contact.email"] || "",
      });
      delete processedFormData["contact.phone"];
      delete processedFormData["contact.email"];
    }

    if (
      processedFormData["location.lat"] ||
      processedFormData["location.lng"]
    ) {
      processedFormData["location"] = JSON.stringify({
        lat: Number(processedFormData["location.lat"]) || 0,
        lng: Number(processedFormData["location.lng"]) || 0,
      });
      delete processedFormData["location.lat"];
      delete processedFormData["location.lng"];
    }

    if (processedFormData["amenities"]) {
      if (Array.isArray(processedFormData["amenities"])) {
        // đã là array → stringify luôn
        processedFormData["amenities"] = JSON.stringify(
          processedFormData["amenities"]
        );
      } else {
        // là string → split
        processedFormData["amenities"] = JSON.stringify(
          processedFormData["amenities"]
            .split(",")
            .map((item) => item.trim())
        );
      }
    }

    const data = new FormData();

    // Add form data fields to FormData object
    Object.keys(processedFormData).forEach((key) => {
      if (key === "images") return; // ❌ bỏ images ra

      data.append(key, processedFormData[key]);
    });

    // Add files to FormData
    if (files.length > 0) {
      if (resourceType === "user") {
        data.append("avatar", files[0]);
      } else if (resourceType === "voucher" || resourceType === "flight") {
        data.append("image", files[0]);
      } else {
        files.forEach((file) => data.append("images", file)); // Nhiều ảnh cho Hotel và Room
      }
    }

    // Add existing images to FormData
    if (existingImages.length > 0) {
      data.append("existingImages", JSON.stringify(existingImages));
    }
    delete data.existingImages;

    try {
      const response = await fetch(`${apiUrl}/${resourceType}s/${resourceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const responseData = await response.json();
      if (response.ok) {
        alert("Resource updated successfully!");
        if (resourceType === "flight") {
          navigate(`/admin/airlines`);
        } else {
          navigate(`/admin/${resourceType}s`);
        }
      } else {
        alert(responseData.message || "Failed to update resource.");
      }
    } catch (error) {
      console.error("Error updating resource:", error);
      alert("An error occurred during submission " + error.message);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            {resourceType === "user" && (
              <img
                src={
                  files.length > 0
                    ? URL.createObjectURL(files[0])
                    : formData.avatar || "/assets/person/DefaultProfile.jpg"
                }
                alt="user avatar"
                className="image"
              />
            )}
            {(resourceType === "voucher" || resourceType === "flight") && (
              <img
                src={
                  files.length > 0
                    ? URL.createObjectURL(files[0])
                    : formData.image
                }
                alt="image"
                className="image"
              />
            )}
            {(resourceType === "hotel" || resourceType === "room") && (
              <div className="imagePreviewList">
                {existingImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`existing ${index}`}
                    className="previewImage"
                    onClick={() => handleRemoveExistingImage(index)}
                    title="Click to remove"
                  />
                ))}
                {files.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`new ${index}`}
                    className="previewImage"
                    onClick={() => handleRemoveNewImage(index)}
                    title="Click to remove"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="right">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                {(resourceType === "hotel" || resourceType === "room") && (
                  <div className="formInput">
                    <label htmlFor="files">
                      Images: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input
                      type="file"
                      id="files"
                      multiple
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {resourceType === "user" && (
                  <div className="formInput">
                    <label htmlFor="file">
                      Avatar: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {(resourceType === "flight" || resourceType === "voucher") && (
                  <div className="formInput">
                    <label htmlFor="file">
                      Image: <DriveFolderUploadOutlined className="icon" />
                    </label>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </div>
                )}
                {inputs.map((input) => (
                  <div className="formInput" key={input.id}>
                    <label>{input.label}</label>
                    <input
                      type={input.type}
                      name={input.name}
                      placeholder={input.placeholder}
                      value={formData[input.name] || ""}
                      onChange={handleChange}
                    />
                  </div>
                ))}

                <button type="submit">Save</button>
              </form>
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edit;
