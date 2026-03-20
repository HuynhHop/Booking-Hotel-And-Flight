// import React, { useEffect, useState } from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import "../css/HotelLocation.css"; // Import CSS cho component này
// import Modal from "./Modal"; // Import Modal component

// const hotelIcon = new L.DivIcon({
//   html: `<div style="
//     background: #e74c3c;
//     width: 32px;
//     height: 32px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 16px;
//     transform: translate(-50%, -50%);
//   "><i class="fas fa-hotel"></i></div>`,
//   className: "custom-icon",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// const restaurantIcon = new L.DivIcon({
//   html: `<div style="
//     background: #2ecc71;
//     width: 32px;
//     height: 32px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 16px;
//     transform: translate(-50%, -50%);
//   "><i class="fas fa-utensils"></i></div>`,
//   className: "custom-icon",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// const attractionIcon = new L.DivIcon({
//   html: `<div style="
//     background: #3498db;
//     width: 32px;
//     height: 32px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     color: white;
//     font-size: 16px;
//     transform: translate(-50%, -50%);
//   "><i class="fas fa-camera-retro"></i></div>`,
//   className: "custom-icon",
//   iconSize: [32, 32],
//   iconAnchor: [16, 32],
// });

// const HotelLocation = ({ location, openModal }) => {
//   const [places, setPlaces] = useState([]);
//   const [isMapModalOpen, setIsMapModalOpen] = useState(false);
//   const [activeTab, setActiveTab] = useState("all");
//   const [locationScore, setLocationScore] = useState(null);

//   // Fetch địa điểm xung quanh từ Overpass API
//   useEffect(() => {
//     if (!location) return;

//     const fetchPlaces = async () => {
//       try {
//         const { lat, lng } = location;
//         const query = `
//           [out:json];
//           (
//             node[amenity=restaurant](around:3000,${lat},${lng});
//             node[tourism=attraction](around:3000,${lat},${lng});
//           );
//           out center;
//         `;
//         const res = await fetch(
//           `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
//             query
//           )}`
//         );
//         const data = await res.json();
//         setPlaces(data.elements || []);
//         // Phân tích kết quả
//         const restaurantCount = data.elements.filter(
//           (e) => e.tags?.amenity === "restaurant"
//         ).length;
//         const attractionCount = data.elements.filter(
//           (e) => e.tags?.tourism === "attraction"
//         ).length;

//         // Tính điểm
//         const restaurantScore = Math.min((restaurantCount / 20) * 5, 5);
//         const attractionScore = Math.min((attractionCount / 10) * 5, 5);

//         const totalScore = (restaurantScore + attractionScore).toFixed(1);
//         setLocationScore(totalScore);
//       } catch (error) {
//         console.error("Fetch places error:", error);
//       }
//     };

//     fetchPlaces();
//   }, [location, isMapModalOpen]);

//   if (!location) return null;

//   // Lọc địa điểm có tên và theo tab
//   const filteredPlaces = places.filter((place) => {
//     const hasName = place.tags?.name;
//     if (activeTab === "restaurants")
//       return hasName && place.tags?.amenity === "restaurant";
//     if (activeTab === "attractions")
//       return hasName && place.tags?.tourism === "attraction";
//     return hasName;
//   });

//   // Top places (ưu tiên có đánh giá hoặc phổ biến)
//   const topPlaces = [...places]
//     .filter((place) => place.tags?.name)
//     .sort((a, b) => (b.tags?.rating || 0) - (a.tags?.rating || 0))
//     .slice(0, 4);

//   // Modal content với sidebar và bản đồ
//   const mapModalContent = (
//     <div style={{ height: "70vh", width: "100%" }}>
//       <MapContainer
//         center={[location.lat, location.lng]}
//         zoom={15}
//         style={{ height: "100%", width: "100%" }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />
//         <Marker position={[location.lat, location.lng]} icon={hotelIcon}>
//           <Popup>Khách sạn của bạn</Popup>
//         </Marker>
//         {filteredPlaces.map((place) => (
//           <Marker
//             key={place.id}
//             position={[place.lat, place.lon]}
//             icon={
//               place.tags?.amenity === "restaurant"
//                 ? restaurantIcon
//                 : attractionIcon
//             }
//           >
//             <Popup>
//               <strong>{place.tags?.name || "Địa điểm"}</strong>
//               <br />
//               {place.tags?.amenity || place.tags?.tourism}
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );

//   return (
//     <div className="hotel-location">
//       <h3>
//         Điểm vị trí tuyệt vời: <strong>{locationScore}</strong>
//       </h3>

//       {/* Hiển thị danh sách địa điểm */}
//       <div className="top-places">
//         <h4>Gợi ý nổi bật:</h4>
//         <ul>
//           {topPlaces.map((place) => (
//             <li key={place.id}>
//               <span className="place-category">
//                 {place.tags?.amenity === "restaurant" ? "🍴" : "🏞️"}
//               </span>
//               <strong>{place.tags.name}</strong>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Nút mở Modal bản đồ */}
//       <button className="detail-button" onClick={() => setIsMapModalOpen(true)}>
//         Xem bản đồ
//       </button>

//       {/* Modal chứa bản đồ */}
//       {isMapModalOpen && (
//         <Modal
//           title="Bản đồ & Địa điểm lân cận"
//           content={mapModalContent}
//           closeModal={() => setIsMapModalOpen(false)}
//           width="100%"
//           height="80vh"
//         />
//       )}
//     </div>
//   );
// };

// export default HotelLocation;

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "../css/HotelLocation.css";
import Modal from "./Modal";

// Các icon giữ nguyên như cũ
const hotelIcon = new L.DivIcon({ /* ... */ });
const restaurantIcon = new L.DivIcon({ /* ... */ });
const attractionIcon = new L.DivIcon({ /* ... */ });

const HotelLocation = ({ location, address, openModal }) => {
  const [places, setPlaces] = useState([]);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [locationScore, setLocationScore] = useState(null);
  const [mapCenter, setMapCenter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Geocode địa chỉ để lấy tọa độ
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!address) return;
      
      const provider = new OpenStreetMapProvider();
      try {
        const results = await provider.search({ query: address });
        if (results.length > 0) {
          const { x: lng, y: lat } = results[0];
          setMapCenter([lat, lng]);
          fetchNearbyPlaces(lat, lng);
        } else {
          console.error("Không tìm thấy tọa độ cho địa chỉ này");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setIsLoading(false);
      }
    };

    const fetchNearbyPlaces = async (lat, lng) => {
      try {
        const query = `
          [out:json];
          (
            node[amenity=restaurant](around:3000,${lat},${lng});
            node[tourism=attraction](around:3000,${lat},${lng});
          );
          out center;
        `;
        const res = await fetch(
          `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
            query
          )}`
        );
        const data = await res.json();
        setPlaces(data.elements || []);

        // Tính điểm vị trí
        const restaurantCount = data.elements.filter(
          (e) => e.tags?.amenity === "restaurant"
        ).length;
        const attractionCount = data.elements.filter(
          (e) => e.tags?.tourism === "attraction"
        ).length;

        const restaurantScore = Math.min((restaurantCount / 20) * 5, 5);
        const attractionScore = Math.min((attractionCount / 10) * 5, 5);
        const totalScore = (restaurantScore + attractionScore).toFixed(1);
        
        setLocationScore(totalScore);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch places error:", error);
        setIsLoading(false);
      }
    };

    geocodeAddress();
  }, [address]);

  // Lọc địa điểm có tên và theo tab
  const filteredPlaces = places.filter((place) => {
    const hasName = place.tags?.name;
    if (activeTab === "restaurants")
      return hasName && place.tags?.amenity === "restaurant";
    if (activeTab === "attractions")
      return hasName && place.tags?.tourism === "attraction";
    return hasName;
  });

  // Top places (ưu tiên có đánh giá hoặc phổ biến)
  const topPlaces = [...places]
    .filter((place) => place.tags?.name)
    .sort((a, b) => (b.tags?.rating || 0) - (a.tags?.rating || 0))
    .slice(0, 4);

  // Modal content với sidebar và bản đồ
  const mapModalContent = (
    <div style={{ height: "70vh", width: "100%" }}>
      {mapCenter ? (
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapCenter} icon={hotelIcon}>
            <Popup>{address}</Popup>
          </Marker>
          {filteredPlaces.map((place) => (
            <Marker
              key={place.id}
              position={[place.lat, place.lon]}
              icon={
                place.tags?.amenity === "restaurant"
                  ? restaurantIcon
                  : attractionIcon
              }
            >
              <Popup>
                <strong>{place.tags?.name || "Địa điểm"}</strong>
                <br />
                {place.tags?.amenity || place.tags?.tourism}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <div className="loading-map">Đang tải bản đồ...</div>
      )}
    </div>
  );

  if (isLoading) return <div className="loading">Đang tải thông tin vị trí...</div>;

  return (
    <div className="hotel-location">
      <h3>
        Điểm vị trí tuyệt vời: <strong>{locationScore}</strong>
      </h3>
      <p className="address">{address}</p>

      {/* Hiển thị danh sách địa điểm */}
      {/* <div className="top-places">
        <h4>Gợi ý nổi bật:</h4>
        <ul>
          {topPlaces.map((place) => (
            <li key={place.id}>
              <span className="place-category">
                {place.tags?.amenity === "restaurant" ? "🍴" : "🏞️"}
              </span>
              <strong>{place.tags.name}</strong>
            </li>
          ))}
        </ul>
      </div> */}

      {/* Nút mở Modal bản đồ */}
      <button className="detail-button" onClick={() => setIsMapModalOpen(true)}>
        Xem bản đồ
      </button>

      {/* Modal chứa bản đồ */}
      {isMapModalOpen && (
        <Modal
          title="Bản đồ & Địa điểm lân cận"
          content={mapModalContent}
          closeModal={() => setIsMapModalOpen(false)}
          width="100%"
          height="80vh"
        />
      )}
    </div>
  );
};

export default HotelLocation;