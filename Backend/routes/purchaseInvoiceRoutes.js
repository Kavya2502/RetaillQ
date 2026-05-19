const express = require("express");
const router = express.Router();

const PurchaseInvoice = require("../models/PurchaseInvoice");
const Product = require("../models/Product");
const protect = require("../middleware/authMiddleware");

const multer = require("multer");

// FILE UPLOAD SETUP
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// CREATE PURCHASE INVOICE
router.post("/", protect, upload.single("billFile"), async (req, res) => {
  try {
    const {
      supplierName,
      supplierPhone,
      totalAmount,
      paymentMode,
      paymentStatus,
      purchaseDate,
    } = req.body;

    const items = JSON.parse(req.body.items);

    const invoice = await PurchaseInvoice.create({
      user: req.user,
      supplierName,
      supplierPhone,
      items,
      totalAmount,
      paymentMode,
      paymentStatus,
      purchaseDate,

      billFile: req.file
        ? {
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
          }
        : null,
    });

    for (const item of items) {
      const existingProduct = await Product.findOne({
        name: item.productName,
        user: req.user,
      });

      if (existingProduct) {
        existingProduct.stock =
          Number(existingProduct.stock || 0) + Number(item.quantity || 0);

        existingProduct.price = Number(item.purchasePrice || 0);

        await existingProduct.save();
      } else {
        await Product.create({
          user: req.user,
          name: item.productName,
          brand: item.brand,
          category: item.category,
          price: Number(item.purchasePrice || 0),
          stock: Number(item.quantity || 0),
        });
      }
    }

    res.status(201).json(invoice);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not create purchase invoice",
      error: error.message,
    });
  }
});

// GET ALL PURCHASE INVOICES
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find({
      user: req.user,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(invoices);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not fetch purchase invoices",
    });
  }
});

module.exports = router;