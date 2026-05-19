const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    id: Number,
    date: String,
    invoiceNo: String,

    customerName: String,
    customerPhone: String,

    subtotal: Number,
    gst: Number,
    gstRate: Number,
    amount: Number,

    paymentMode: String,
    amountReceived: Number,
    balanceAmount: Number,
    paymentDate: String,

    status: {
      type: String,
      default: "Paid",
    },

    items: {
      type: Array,
      default: [],
    },
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);