const mongoose = require("mongoose");
var mongooseDelete = require("mongoose-delete");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    serviceType: {
      type: String,
      enum: ["Tour", "Hotel", "Flight"],
      required: true,
    },
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "serviceType",
    },
    hotelName: { type: String, required: true }, // Tên khách sạn
    roomName: { type: String, required: true }, // Tên loại phòng
    quantity: { type: Number, default: 1 },
    totalPrice: Number,
    bookingDate: { type: Date, default: Date.now }, // Thêm ngày đặt chỗ
    status: {
      type: String,
      enum: [
        "Reserved", // Đã giữ chỗ
        "Pending", // Đang chờ thanh toán
        "Paid", // Đã thanh toán
        "Cancelled", // Đã hủy
        "Refunded", // Đã hoàn tiền
      ],
      default: "Paid",
    },
    contactInfo: {
      fullName: String,
      email: String,
      phone: String,
    },
    guestInfo: {
      fullName: String,
      email: String,
      phone: String,
    },
    note: { type: String }, // Ghi chú của khách hàng
    imageRoom: { type: String }, // Hình ảnh phòng đã đặt
    checkIn: { type: Date },
    checkOut: { type: Date },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Order", orderSchema);
