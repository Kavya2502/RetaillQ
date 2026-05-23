const express = require("express");
const router = express.Router();

const PurchaseInvoice = require("../models/PurchaseInvoice");
const Product = require("../models/Product");
const protect = require("../middleware/authmiddleware");
const upload = require("../config/cloudinary");

// CREATE PURCHASE INVOICE
router.post("/", protect, (req, res) => {
  upload.single("billFile")(req, res, async function (uploadError) {
    if (uploadError) {
      console.log("Cloudinary upload error:", uploadError);

      return res.status(500).json({
        message: "Bill upload failed",
        error: uploadError.message || JSON.stringify(uploadError),
      });
    }

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
              filename: req.file.originalname,
              path: req.file.path,
              mimetype: req.file.mimetype,
              cloudinaryUrl: req.file.path,
              publicId: req.file.filename,
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
      console.log("Purchase invoice error:", error);

      res.status(500).json({
        message: "Could not create purchase invoice",
        error: error.message,
      });
    }
  });
});

// GET ALL PURCHASE INVOICES
router.get("/", protect, async (req, res) => {
  try {
    const invoices = await PurchaseInvoice.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({
      message: "Could not fetch purchase invoices",
    });
  }
});
// UPDATE PURCHASE INVOICE
router.put("/:id", protect, async (req, res) => {
  try {
    const updatedInvoice = await PurchaseInvoice.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user,
      },
      req.body,
      { new: true }
    );

    if (!updatedInvoice) {
      return res.status(404).json({ message: "Purchase invoice not found" });
    }

    res.status(200).json(updatedInvoice);
  } catch (error) {
    res.status(500).json({
      message: "Could not update purchase invoice",
      error: error.message,
    });
  }
});

// DELETE PURCHASE INVOICE
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedInvoice = await PurchaseInvoice.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!deletedInvoice) {
      return res.status(404).json({ message: "Purchase invoice not found" });
    }

    res.status(200).json({ message: "Purchase invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete purchase invoice",
      error: error.message,
    });
  }
});
module.exports = router;