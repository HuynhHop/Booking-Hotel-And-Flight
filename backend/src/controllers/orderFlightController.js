const OrderFlight = require("../models/OrderFlight");
const Flight = require("../models/Flight");

class orderFlightController {
  // Create a new flight order
  async create(req, res) {
    try {
      // Verify flight exists
      const flight = await Flight.findById(req.body.flight);
      if (!flight) {
        return res.status(404).json({ message: "Flight not found" });
      }

      // Check seat availability
      if (flight.seatsAvailable < 1) {
        return res.status(400).json({ message: "No seats available" });
      }

      const order = new OrderFlight(req.body);
      await order.save();

      // Update available seats
      flight.seatsAvailable -= 1;
      await flight.save();

      res.status(201).json({ success: true, data: order  });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Update flight order
  async update(req, res) {
    try {
      const order = await OrderFlight.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete flight order
  async delete(req, res) {
    try {
      const order = await OrderFlight.findById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Restore seat if order is being cancelled
      if (order.status !== 'cancelled') {
        const flight = await Flight.findById(order.flight);
        if (flight) {
          flight.seatsAvailable += 1;
          await flight.save();
        }
      }

      await OrderFlight.findByIdAndDelete(req.params.id);
      res.json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get all flight orders for a user
  async getUserOrders(req, res) {
    try {
      const orders = await OrderFlight.find({ user: req.params.userId })
        .populate('flight')
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Get order details
  async getOrder(req, res) {
    try {
      const order = await OrderFlight.findById(req.params.id).populate('flight');
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update payment status
  async updatePaymentStatus(req, res) {
    try {
      const { status } = req.body;
      const order = await OrderFlight.findByIdAndUpdate(
        req.params.id,
        { 
          paymentStatus: status,
          status: status === 'paid' ? 'confirmed' : 'pending'
        },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json(order);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new orderFlightController();