// // utils/updateHotelMinPrice.js
// const Room = require("../models/Room");
// const Hotel = require("../models/Hotel");

// const updateHotelMinPrice = async (hotelId) => {
//   const rooms = await Room.find({ hotel: hotelId, deleted: false });
//   if (!rooms || rooms.length === 0) return;

//   const minPrice = Math.min(...rooms.map((r) => r.price));
//   await Hotel.findByIdAndUpdate(hotelId, { pricePerNight: minPrice });
// };

// module.exports = updateHotelMinPrice;

const Room = require("../models/Room");
const Hotel = require("../models/Hotel");

const updateHotelMinPrice = async (hotelId) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel) return null;

  const oldPrice = hotel.pricePerNight;

  const rooms = await Room.find({ hotel: hotelId, deleted: false });
  if (!rooms || rooms.length === 0) return null;

  const minPrice = Math.min(...rooms.map((r) => r.price));

  // ❗ Không đổi thì không làm gì
  if (oldPrice === minPrice) return null;

  const updatedHotel = await Hotel.findByIdAndUpdate(
    hotelId,
    { pricePerNight: minPrice },
    { new: true }
  );

  return {
    hotel: updatedHotel,
    oldPrice,
    newPrice: minPrice,
  };
};

module.exports = updateHotelMinPrice;