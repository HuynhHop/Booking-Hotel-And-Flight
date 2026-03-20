const Voucher = require("../models/Voucher");
const { imageUpload } = require("../config/cloudinary");

class VoucherController {
  async getAll(req, res) {
    try {
      const vouchers = await Voucher.find(); // hoặc có thể giới hạn số lượng
      res.json(vouchers);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server khi lấy danh sách voucher" });
    }
  }

  async createVoucher(req, res) {
    imageUpload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Error uploading image",
          error: err.message,
        });
      }

      // Nếu có file ảnh, lưu URL vào req.body
      if (req.file && req.file.path) {
        req.body.image = req.file.path; // URL ảnh trên Cloudinary
      }
      const voucher = new Voucher(req.body);
      await voucher.save();
      res.json(voucher);
    });
  }
  async applyVoucher(req, res) {
    const { code, type } = req.query;

    try {
      // const vouch = await Voucher.findOne({
      //   code,
      //   applyTo: type,
      //   $or: [
      //     { serviceId: null }, // áp dụng toàn bộ
      //     { serviceId: id }, // hoặc chỉ áp dụng cho service cụ thể
      //   ],
      // });
      const vouch = await Voucher.findOne({
        code,
        applyTo: type,
      });

      if (!vouch || vouch.expiresAt < new Date()) {
        return res.status(404).json({ error: "Invalid or expired" });
      }

      return res.json(vouch);
    } catch (error) {
      console.error("applyVoucher error:", error);
      return res.status(500).json({ error: "Server error" });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const voucher = await Voucher.findById(id);

      if (!voucher) {
        return res.status(404).json({ error: "Voucher không tồn tại" });
      }

      res.json(voucher);
    } catch (error) {
      console.error("getById error:", error);
      res.status(500).json({ error: "Lỗi server khi lấy voucher theo ID" });
    }
  }

  async updateVoucher(req, res) {
    try {
      imageUpload.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Error uploading image",
            error: err.message,
          });
        }

        // Nếu có file ảnh, lưu URL vào req.body
        if (req.file && req.file.path) {
          req.body.image = req.file.path; // URL ảnh trên Cloudinary
        }

        const voucher = await Voucher.findByIdAndUpdate(
          req.params.id,
          req.body,
          {
            new: true,
          }
        );
        if (!voucher) {
          return res
            .status(404)
            .json({ message: "Không tìm thấy mã giảm giá" });
        }
        res.status(200).json({ success: true, data: voucher });
      });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
  async deleteVoucher(req, res) {
    try {
      const { id } = req.params;
      const deletedVoucher = await Voucher.findByIdAndDelete(id);

      if (!deletedVoucher) {
        return res
          .status(404)
          .json({ success: false, message: "Voucher not found" });
      }

      res
        .status(200)
        .json({ success: true, message: "Voucher deleted successfully" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
module.exports = new VoucherController();
