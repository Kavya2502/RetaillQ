const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  shopName: String,
  gstin: String,
  email: String,
  address: String,
  website: String,
  bankName: String,
  accountName: String,
  accountNumber: String,
  ifsc: String,
});

module.exports = mongoose.model("Profile", profileSchema);