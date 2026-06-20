const express = require("express");
const router = express.Router();

const Invoice = require("../models/Invoice");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");


// Create Invoice
router.post("/", authMiddleware, async (req, res) => {
  try {
    const invoice = await Invoice.create({
      ...req.body,
      userId: req.user,
    });

    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(
        item._id,
        {
          $inc: {
            stock: -Number(item.qty || 1),
          },
        }
      );
    }

    res.status(201).json({
      message: "Invoice saved successfully",
      invoice,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not save invoice",
    });
  }
});


// Get User Invoices
router.get("/", authMiddleware, async (req, res) => {
  try {

    const invoices = await Invoice.find({
      userId: req.user,
    }).sort({ createdAt: -1 });

    res.status(200).json(invoices);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not fetch invoices",
    });
  }
});


// Delete Invoice
router.delete("/:id", authMiddleware, async (req, res) => {
  try {

    await Invoice.findOneAndDelete({
      _id: req.params.id,
      userId: req.user,
    });

    res.status(200).json({
      message: "Invoice deleted successfully",
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not delete invoice",
    });
  }
});


// Update Invoice
router.put("/:id", authMiddleware, async (req, res) => {
  try {

    const updatedInvoice = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user,
      },
      req.body,
      { new: true }
    );

    res.status(200).json(updatedInvoice);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Could not update invoice",
    });
  }
});

module.exports = router;