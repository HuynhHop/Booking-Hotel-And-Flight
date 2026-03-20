const Room = require("../models/Room");
const NodeCache = require("node-cache");
const updateHotelMinPrice = require("../util/updateHotelMinPrice");
const { handlePriceDrop } = require("../util/priceAlertService");

const cache = new NodeCache({ stdTTL: 30 });

class RoomController {
  async getAllRooms(req, res) {
    try {
      const cacheKey = "rooms_all";
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const rooms = await Room.find()
        .populate("hotel", "name")
        .select("name price capacity hotel beds people amenities")
        .limit(20)
        .lean();

      cache.set(cacheKey, rooms);

      res.json({ success: true, data: rooms });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getRoomById(req, res) {
    try {
      const room = await Room.findById(req.params.id)
        .populate("hotel")
        .lean(); // chỉ populate ở detail

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Phòng không tồn tại.",
        });
      }

      res.json({ success: true, data: room });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getRoomsByHotelId(req, res) {
    try {
      const { hotelId } = req.params;

      const cacheKey = `rooms_${hotelId}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const rooms = await Room.find({ hotel: hotelId })
        .select("name price capacity amenities images quantity policies area view serviceFee cashback")
        .lean();

      cache.set(cacheKey, rooms);

      res.json({ success: true, data: rooms });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async createRoom(req, res) {
    try {
      let data = req.body;

      if (typeof data.policies === "string") {
        data.policies = JSON.parse(data.policies);
      }

      if (typeof data.amenities === "string") {
        data.amenities = data.amenities.split(",").map((a) => a.trim());
      }

      data.images = req.files?.map((f) => f.path) || [];

      const newRoom = await Room.create(data);

      const result = await updateHotelMinPrice(newRoom.hotel);

      if (result) {
        handlePriceDrop(result.hotel, result.oldPrice, result.newPrice);
      }

      cache.flushAll();

      res.status(201).json({ success: true, data: newRoom });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async updateRoom(req, res) {
    try {
      let data = req.body;

      // ✅ Parse lại giống createRoom
      if (typeof data.policies === "string") {
        data.policies = JSON.parse(data.policies);
      }

      if (typeof data.amenities === "string") {
        data.amenities = JSON.parse(data.amenities);
      }

      // ✅ Convert number
      if (data.price) data.price = Number(data.price);
      if (data.quantity) data.quantity = Number(data.quantity);

      // 1. Lấy room cũ
      const oldRoom = await Room.findById(req.params.id);
      if (!oldRoom) {
        return res.status(404).json({
          success: false,
          message: "Room not found",
        });
      }

      // 2. Update
      const updatedRoom = await Room.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      // 3. Update hotel price
      const result = await updateHotelMinPrice(updatedRoom.hotel);

      if (result) {
        handlePriceDrop(result.hotel, result.oldPrice, result.newPrice);
      }

      cache.flushAll();

      res.json({ success: true, data: updatedRoom });
    } catch (err) {
      console.error(err); // 👈 thêm dòng này để debug
      res.status(400).json({ success: false, message: err.message });
    }
  }

  async deleteRoom(req, res) {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);

      const result = await updateHotelMinPrice(room.hotel);

      if (result) {
        handlePriceDrop(result.hotel, result.oldPrice, result.newPrice);
      }

      cache.flushAll();

      res.json({ success: true, message: "Deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new RoomController();

// const Room = require("../models/Room");
// const updateHotelMinPrice = require("../util/updateHotelMinPrice");

// class RoomController {
//   async getAllRooms(req, res) {
//     try {
//       const rooms = await Room.find().populate("hotel");
//       res.status(200).json({ success: true, data: rooms });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getRoomById(req, res) {
//     try {
//       const room = await Room.findById(req.params.id).populate("hotel");
//       if (!room) {
//         return res.status(404).json({
//           success: false,
//           message: "Phòng không tồn tại.",
//         });
//       }
//       res.status(200).json({ success: true, data: room });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getRoomsByHotelId(req, res) {
//     try {
//       const { hotelId } = req.params;
//       const rooms = await Room.find({ hotel: hotelId }).populate("hotel");
//       if (!rooms.length) {
//         return res.status(404).json({
//           success: false,
//           message: "Không có phòng nào cho khách sạn này.",
//         });
//       }
//       res.status(200).json({ success: true, data: rooms });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async createRoom(req, res) {
//     try {
//       let data = req.body;

//       if (typeof data.policies === "string") {
//         data.policies = JSON.parse(data.policies);
//       }

//       if (typeof data.amenities === "string") {
//         data.amenities = data.amenities.split(",").map((a) => a.trim());
//       }

//       // Kiểm tra files từ form-data (upload hình) hoặc giữ nguyên nếu là từ raw
//       const images = req.files?.map((file) => file.path) || data.images || [];
//       data.images = images;

//       if (data.quantity && data.quantity < 0) {
//         return res.status(400).json({ 
//           success: false, 
//           message: "Số lượng phòng không thể âm" 
//         });
//       }
      
//       const newRoom = new Room(data);
//       await newRoom.save();

//       await updateHotelMinPrice(newRoom.hotel);

//       res.status(201).json({ success: true, data: newRoom });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }


//   async updateRoom(req, res) {
//     try {
//       let data = req.body;

//       if (typeof data.policies === "string") {
//         data.policies = JSON.parse(data.policies);
//       }

//       if (typeof data.amenities === "string") {
//         data.amenities = data.amenities.split(",").map((a) => a.trim());
//       }

//       const images = req.files.map((file) => file.path);
//       data.images = images;

//       const updatedRoom = await Room.findByIdAndUpdate(req.params.id, data, {
//         new: true,
//       });

//       await updateHotelMinPrice(updatedRoom.hotel);
//       if (!updatedRoom) {
//         return res.status(404).json({ success: false, message: "Không tìm thấy phòng." });
//       }

//       res.status(200).json({ success: true, data: updatedRoom });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   async deleteRoom(req, res) {
//     try {
//       const room = await Room.findByIdAndDelete(req.params.id);
//       await updateHotelMinPrice(room.hotel);
//       if (!room) {
//         return res.status(404).json({ success: false, message: "Phòng không tồn tại." });
//       }
//       res.status(200).json({ success: true, message: "Đã xoá phòng thành công." });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// }

// module.exports = new RoomController();
