const express = require("express");
const router = express.Router();
const Invoice = require("../models/Invoice");
const Product = require("../models/Product");

// Create invoice
router.post("/", async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
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


// Get all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    res.status(200).json(invoices);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Could not fetch invoices",
    });
  }
});

// Delete invoice
router.delete("/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);

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
// Update invoice
router.put("/:id", async (req, res) => {
  try {
    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
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