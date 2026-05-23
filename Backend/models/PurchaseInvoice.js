const mongoose = require("mongoose");

const purchaseInvoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    supplierName: String,
    supplierPhone: String,

    items: [
      {
        productName: String,
        brand: String,
        category: String,
        quantity: Number,
        purchasePrice: Number,
        total: Number,
      },
    ],

    totalAmount: Number,

    paymentMode: String,
    paymentStatus: String,

    purchaseDate: String,
    billFile: {
  filename: String,
  path: String,
  mimetype: String,
  cloudinaryUrl: String,
  publicId: String,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PurchaseInvoice",
  purchaseInvoiceSchema
);