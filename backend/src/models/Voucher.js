const mongoose = require("mongoose");
var mongooseDelete = require("mongoose-delete");

const voucherSchema = new mongoose.Schema({
  code: String,
  discountType: { type: String, enum: ["percent", "amount"] },
  discountValue: Number,
  applyTo: { type: String, enum: ["tour", "hotel", "flight"] },
  // serviceId: mongoose.Schema.Types.ObjectId,
  expiresAt: Date,
  image: String,
});

voucherSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Voucher", voucherSchema);
