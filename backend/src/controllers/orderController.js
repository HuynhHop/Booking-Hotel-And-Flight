const Order = require("../models/Order");
const Room = require("../models/Room");
const Cash = require("../models/Cash");
const { getIO } = require('../config/socket');

class OrderController {
  async getAllOrder(req, res) {
    try {
      const orders = await Order.find().populate("user serviceId");
      res.json({ success: true, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getByUser(req, res) {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ user: userId }).populate("serviceId");
      res.json({ success: true, data: orders });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const { id } = req.params; // Lấy orderId từ URL
      const order = await Order.findById(id).populate("user serviceId"); // Tìm order theo id và populate các trường liên quan
      if (!order) {
        return res
          .status(404)
          .json({ success: false, message: "Order not found" });
      }
      res.json({ success: true, data: order });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async createOrder(req, res) {
    try {
      const {
        user,
        serviceType,
        serviceId,
        hotelName,
        roomName,
        quantity,
        totalPrice,
        contactInfo,
        guestInfo,
        note,
        imageRoom,
        cashUsed = 0, // Thêm trường cashUsed, mặc định là 0
        checkIn,
        checkOut
      } = req.body;

      if (serviceType === "Hotel") {
        const room = await Room.findById(serviceId);
        if (!room) {
          return res.status(404).json({ 
            success: false, 
            message: "Không tìm thấy phòng" 
          });
        }

        if (room.quantity < quantity) {
          return res.status(400).json({ 
            success: false, 
            message: "Số lượng phòng không đủ" 
          });
        }

        // Giảm số lượng phòng
        room.quantity -= quantity;
        await room.save();
      }

      // Trừ tiền từ ví Cash nếu có sử dụng
      if (cashUsed > 0) {
        const cash = await Cash.findOne({ user });
        if (!cash || cash.money < cashUsed) {
          return res.status(400).json({
            success: false,
            message: "Số dư ví Cash không đủ"
          });
        }
        
        cash.money -= cashUsed;
        await cash.save();
      }

      const newOrder = new Order({
        user,
        serviceType,
        serviceId,
        hotelName,
        roomName,
        quantity,
        totalPrice,
        contactInfo,
        guestInfo,
        status: "Paid",
        note: note || "",
        imageRoom: imageRoom || "",
        cashUsed, // Lưu số tiền đã sử dụng từ Cash vào order
        checkIn,
        checkOut
      });
      await newOrder.save();

      // Xử lý cashback (phần này giữ nguyên nhưng thêm kiểm tra cashUsed)
      if (serviceType === "Hotel" && (!cashUsed || cashUsed < totalPrice)) {
        const room = await Room.findById(serviceId);
        if (room && room.cashback) {
          const cashbackValue = room.cashback * quantity;

          // Tìm hoặc tạo cash
          const cash = await Cash.findOne({ user });
          if (cash) {
            // Tính toán cashback dựa trên level
            let actualCashback = cashbackValue;
            switch (cash.level) {
              case "silver":
                actualCashback *= 1.1;
                break;
              case "gold":
                actualCashback *= 1.2;
                break;
              case "diamond":
                actualCashback *= 1.5;
                break;
            }

            cash.money += Math.round(actualCashback);
            cash.totalSpent += quantity;
            cash.updateLevel();
            await cash.save();
          } else {
            const newCash = new Cash({
              user,
              money: Math.round(cashbackValue),
              totalSpent: quantity
            });
            newCash.updateLevel();
            await newCash.save();
          }
        }
      }

      res.status(201).json({ success: true, data: newOrder });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Reserved", "Pending", "Paid", "Cancelled", "Refunded", "Processing"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('user');

    // Gửi thông báo real-time
    console.log('Emitting orderStatusChanged event:', {
      orderId: updatedOrder._id,
      newStatus: status,
      userId: updatedOrder.user._id,
      message: `Yêu cầu hủy đơn #${updatedOrder._id} từ khách hàng ${updatedOrder.user.name || updatedOrder.user.email}`
    });
    const io = getIO();
    io.emit('orderStatusChanged', {
    orderId: updatedOrder._id,
    newStatus: status,
    userId: updatedOrder.user._id,
    message: `Yêu cầu hủy đơn #${updatedOrder._id} từ khách hàng ${updatedOrder.user.name || updatedOrder.user.email}`
  });

    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

  async deleteOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng"
        });
      }

      const { serviceType, status, user, serviceId, quantity, cashUsed } = order;

      // Nếu là đơn phòng khách sạn và đã thanh toán, hoàn trả số lượng phòng
      if (serviceType === "Hotel" && status === "Paid") {
        const room = await Room.findById(serviceId);
        if (room) {
          room.quantity += quantity;
          await room.save();
        }

        // Trừ lại số tiền cashback đã cộng vào (nếu có)
        const cash = await Cash.findOne({ user });
        if (cash && room?.cashback) {
          let cashbackValue = room.cashback * quantity;

          // Tính toán theo level lúc cộng (giả sử không thay đổi giữa lúc cộng & lúc xóa)
          let actualCashback = cashbackValue;
          switch (cash.level) {
            case "silver":
              actualCashback *= 1.1;
              break;
            case "gold":
              actualCashback *= 1.2;
              break;
            case "diamond":
              actualCashback *= 1.5;
              break;
          }

          cash.money -= Math.round(actualCashback);
          if (cash.money < 0) cash.money = 0;

          // Trừ số lần mua phòng ra khỏi totalSpent (giữ đồng bộ level)
          cash.totalSpent -= quantity;
          if (cash.totalSpent < 0) cash.totalSpent = 0;

          cash.updateLevel();
          await cash.save();
        }
      }

      // Xóa đơn hàng
      await Order.findByIdAndDelete(id);

      res.json({
        success: true,
        message: "Xóa đơn hàng thành công"
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
  
}
module.exports = new OrderController();
