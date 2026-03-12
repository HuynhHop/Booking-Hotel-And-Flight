const multer = require("multer");

// Đơn giản: lưu vào bộ nhớ (dùng cho Cloudinary upload)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // giới hạn 5MB
  },
});

module.exports = upload;