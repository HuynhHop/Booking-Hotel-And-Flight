// const slugify = require("slugify");
// const Hotel = require("../models/Hotel");

// class HotelController {
//   async createHotel(req, res) {
//     try {
//       const {
//         name,
//         address,
//         province,
//         district,
//         description,
//         amenities,
//         // pricePerNight,
//         location,
//         starRating,
//         checkInTime,
//         checkOutTime,
//         policies,
//         contact,
//       } = req.body;

//       if (!name || !address || !req.files?.length) {
//         return res.status(400).json({
//           success: false,
//           message: "Missing required fields",
//         });
//       }

//       // Chuyển chuỗi tiện nghi thành mảng nếu cần
//       const amenitiesArray =
//         typeof amenities === "string"
//           ? amenities.split(",").map((item) => item.trim())
//           : Array.isArray(amenities)
//           ? amenities
//           : [];

//       // Lấy URL ảnh từ Cloudinary đã upload sẵn
//       const imageUrls = req.files.map((file) => file.path);

//       // Parse location nếu là JSON string
//       const parsedLocation =
//         typeof location === "string" ? JSON.parse(location) : location;

//       const newHotel = new Hotel({
//         name,
//         slug: slugify(name, { lower: true, strict: true }),
//         address,
//         province,
//         district,
//         description,
//         amenities: amenitiesArray,
//         // pricePerNight,
//         location: parsedLocation,
//         starRating: starRating ? Number(starRating) : undefined,
//         checkInTime,
//         checkOutTime,
//         policies: policies ? JSON.parse(policies) : undefined,
//         contact: contact ? JSON.parse(contact) : undefined,
//         images: imageUrls,
//       });

//       await newHotel.save();

//       res.status(201).json({ success: true, data: newHotel });
//     } catch (err) {
//       console.error("Error creating hotel:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getAllHotel(req, res) {
//     try {
//       const hotels = await Hotel.find();
//       res.json({ success: true, data: hotels });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getHotelById(req, res) {
//     try {
//       const hotel = await Hotel.findById(req.params.id);
//       if (!hotel)
//         return res
//           .status(404)
//           .json({ success: false, message: "Hotel not found" });
//       res.json({ success: true, data: hotel });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getHotelsByProvince(req, res) {
//     try {
//       const { province } = req.params;
//       const hotels = await Hotel.find({ province: new RegExp(province, "i") }); // Tìm không phân biệt hoa thường
//       res.status(200).json({ success: true, data: hotels });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getHotelsByDistrict(req, res) {
//     try {
//       const { district } = req.params;
//       const hotels = await Hotel.find({ district: new RegExp(district, "i") });
//       res.status(200).json({ success: true, data: hotels });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async updateHotel(req, res) {
//     try {
//       const { id } = req.params;

//       const {
//         name,
//         address,
//         province,
//         district,
//         description,
//         amenities,
//         pricePerNight,
//         location,
//         starRating,
//         checkInTime,
//         checkOutTime,
//         policies,
//         contact,
//       } = req.body;

//       const updateData = {
//         ...(name && {
//           name,
//           slug: slugify(name, { lower: true, strict: true }),
//         }),
//         ...(address && { address }),
//         ...(province && { province }),
//         ...(district && { district }),
//         ...(description && { description }),
//         ...(pricePerNight && { pricePerNight }),
//         ...(starRating && { starRating }),
//         ...(checkInTime && { checkInTime }),
//         ...(checkOutTime && { checkOutTime }),
//         ...(policies && { policies: JSON.parse(policies) }),
//         ...(contact && { contact: JSON.parse(contact) }),
//       };

//       if (location) {
//         updateData.location =
//           typeof location === "string" ? JSON.parse(location) : location;
//       }

//       if (amenities) {
//         updateData.amenities =
//           typeof amenities === "string"
//             ? amenities.split(",").map((a) => a.trim())
//             : Array.isArray(amenities)
//             ? amenities
//             : [];
//       }

//       if (req.files?.length) {
//         updateData.images = req.files.map((file) => file.path);
//       }

//       const updatedHotel = await Hotel.findByIdAndUpdate(id, updateData, {
//         new: true,
//       });

//       if (!updatedHotel) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Hotel not found" });
//       }

//       res.status(200).json({ success: true, data: updatedHotel });
//     } catch (err) {
//       console.error("Update error:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async deleteHotel(req, res) {
//     try {
//       const { id } = req.params;
//       const deletedHotel = await Hotel.findByIdAndDelete(id);

//       if (!deletedHotel) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Hotel not found" });
//       }

//       res
//         .status(200)
//         .json({ success: true, message: "Hotel deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async filterHotels(req, res) {
//     try {
//       const { minPrice, maxPrice, starRating, amenities, province } = req.query;

//       const filter = {};

//       if (minPrice || maxPrice) {
//         filter.pricePerNight = {};
//         if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
//         if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
//       }

//       if (starRating) {
//         filter.starRating = { $in: starRating.split(",").map(Number) };
//       }

//       if (amenities) {
//         filter.amenities = { $all: amenities.split(",") };
//       }

//       if (province) {
//         filter.province = new RegExp(province, "i");
//       }

//       const hotels = await Hotel.find(filter);
//       res.status(200).json({ success: true, data: hotels });
//     } catch (err) {
//       console.error("Error filtering hotels:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   async getRecommendedRooms(req, res) {
//     try {
//       const { hotelId } = req.params;

//       // Giả sử mỗi khách sạn có danh sách phòng trong trường `rooms`
//       const hotel = await Hotel.findById(hotelId).populate("rooms"); // Populate nếu có liên kết với model Room
//       if (!hotel) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Hotel not found" });
//       }

//       // Lọc danh sách phòng được đề xuất (ví dụ: dựa trên giá hoặc đánh giá)
//       const recommendedRooms = hotel.rooms.filter((room) => room.isRecommended);

//       res.status(200).json({ success: true, data: recommendedRooms });
//     } catch (err) {
//       console.error("Error fetching recommended rooms:", err);
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// }

// module.exports = new HotelController();

const slugify = require("slugify");
const Hotel = require("../models/Hotel");
const NodeCache = require("node-cache");
const { handlePriceDrop } = require("../util/priceAlertService");

const cache = new NodeCache({ stdTTL: 30 });

class HotelController {
  async createHotel(req, res) {
    try {
      const {
        name,
        address,
        province,
        district,
        description,
        amenities,
        location,
        starRating,
        checkInTime,
        checkOutTime,
        policies,
        contact,
      } = req.body;

      if (!name || !address || !req.files?.length) {
        return res.status(400).json({
          success: false,
          message: "Missing required fields",
        });
      }

      const amenitiesArray =
        typeof amenities === "string"
          ? amenities.split(",").map((item) => item.trim())
          : Array.isArray(amenities)
          ? amenities
          : [];

      const imageUrls = req.files.map((file) => file.path);

      const parsedLocation =
        typeof location === "string" ? JSON.parse(location) : location;

      const newHotel = new Hotel({
        name,
        slug: slugify(name, { lower: true, strict: true }),
        address,
        province,
        district,
        description,
        amenities: amenitiesArray,
        location: parsedLocation,
        starRating: starRating ? Number(starRating) : undefined,
        checkInTime,
        checkOutTime,
        policies: policies ? JSON.parse(policies) : undefined,
        contact: contact ? JSON.parse(contact) : undefined,
        images: imageUrls,
      });

      await newHotel.save();

      cache.flushAll(); // clear cache khi create

      res.status(201).json({ success: true, data: newHotel });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // 🔥 TỐI ƯU CHÍNH
  async getAllHotel(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const cacheKey = `hotels_${page}_${limit}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const hotels = await Hotel.find()
        .select("name pricePerNight oldPricePerNight starRating province images address slug amenities")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      cache.set(cacheKey, hotels);

      res.json({ success: true, data: hotels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getHotelById(req, res) {
    try {
      const cacheKey = `hotel_${req.params.id}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const hotel = await Hotel.findById(req.params.id).lean();

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      cache.set(cacheKey, hotel);

      res.json({ success: true, data: hotel });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getHotelsByProvince(req, res) {
    try {
      const { province } = req.params;

      const cacheKey = `province_${province}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const hotels = await Hotel.find({
        province: new RegExp(province, "i"),
      })
        .select("name pricePerNight oldPricePerNight province images")
        .lean();

      cache.set(cacheKey, hotels);

      res.json({ success: true, data: hotels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getHotelsByDistrict(req, res) {
    try {
      const { district } = req.params;

      const cacheKey = `district_${district}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const hotels = await Hotel.find({
        district: new RegExp(district, "i"),
      })
        .select("name pricePerNight district images")
        .lean();

      cache.set(cacheKey, hotels);

      res.json({ success: true, data: hotels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateHotel(req, res) {
    try {
      const hotelId = req.params.id;

      // 1. Lấy hotel cũ
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      const oldPrice = hotel.pricePerNight;

      // 2. Clone data từ request
      const updateData = { ...req.body };

      // =========================
      // ✅ 3. Parse amenities
      // =========================
      if (updateData.amenities) {
        try {
          updateData.amenities =
            typeof updateData.amenities === "string"
              ? JSON.parse(updateData.amenities)
              : updateData.amenities;
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "Amenities format is invalid",
          });
        }
      }

      // =========================
      // ✅ 4. Parse JSON fields
      // =========================
      if (updateData.policies && typeof updateData.policies === "string") {
        updateData.policies = JSON.parse(updateData.policies);
      }

      if (updateData.contact && typeof updateData.contact === "string") {
        updateData.contact = JSON.parse(updateData.contact);
      }

      if (updateData.location && typeof updateData.location === "string") {
        updateData.location = JSON.parse(updateData.location);
      }

      // =========================
      // ✅ 5. Xử lý images (QUAN TRỌNG NHẤT)
      // =========================

      let existingImages = [];

      // lấy ảnh cũ từ FE
      if (req.body.existingImages) {
        try {
          existingImages = JSON.parse(req.body.existingImages);
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: "existingImages format is invalid",
          });
        }
      }

      // ảnh upload mới
      const newImages =
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : [];

      // merge ảnh
      if (existingImages.length > 0 || newImages.length > 0) {
        updateData.images = [...existingImages, ...newImages];
      }

      // =========================
      // ✅ 6. Lưu giá cũ
      // =========================
      updateData.oldPricePerNight = oldPrice;

      // =========================
      // 7. Update DB
      // =========================
      const updatedHotel = await Hotel.findByIdAndUpdate(
        hotelId,
        updateData,
        { new: true }
      );

      // =========================
      // 8. Trigger price alert (async)
      // =========================
      // handlePriceDrop(
      //   updatedHotel,
      //   oldPrice,
      //   updatedHotel.pricePerNight
      // );

      return res.status(200).json({
        success: true,
        data: updatedHotel,
      });

    } catch (error) {
      console.error("Update error:", error);
      return res.status(500).json({
        success: false,
        message: "Update failed",
      });
    }
  }

  async deleteHotel(req, res) {
    try {
      const { id } = req.params;

      await Hotel.findByIdAndDelete(id);

      cache.flushAll();

      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async filterHotels(req, res) {
    try {
      const cacheKey = `filter_${JSON.stringify(req.query)}`;
      const cached = cache.get(cacheKey);

      if (cached) {
        return res.json({ success: true, data: cached });
      }

      const { minPrice, maxPrice, starRating, amenities, province } =
        req.query;

      const filter = {};

      if (minPrice || maxPrice) {
        filter.pricePerNight = {};
        if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
        if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
      }

      if (starRating) {
        filter.starRating = { $in: starRating.split(",").map(Number) };
      }

      if (amenities) {
        filter.amenities = { $all: amenities.split(",") };
      }

      if (province) {
        filter.province = new RegExp(province, "i");
      }

      const hotels = await Hotel.find(filter)
        .select("name pricePerNight starRating province")
        .limit(20)
        .lean();

      cache.set(cacheKey, hotels);

      res.json({ success: true, data: hotels });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getRecommendedRooms(req, res) {
    try {
      const { hotelId } = req.params;

      const hotel = await Hotel.findById(hotelId)
        .populate("rooms")
        .lean();

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found",
        });
      }

      const recommendedRooms = hotel.rooms.filter(
        (room) => room.isRecommended
      );

      res.json({ success: true, data: recommendedRooms });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}

module.exports = new HotelController();