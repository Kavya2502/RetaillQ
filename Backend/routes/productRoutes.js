const express = require("express");
const Product = require("../models/Product");
const protect = require("../middleware/authmiddleware");

const router = express.Router();

// ADD PRODUCT
router.post("/", protect, async (req, res) => {
  try {
    const { name, brand, category, price, stock } = req.body;

    if (!name || !brand || !category || price === "" || stock === "") {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const product = await Product.create({
      user: req.user,
      name,
      brand,
      category,
      price,
      stock,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET LOGGED-IN USER PRODUCTS
router.get("/", protect, async (req, res) => {
  try {
    const products = await Product.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// DELETE PRODUCT
router.delete("/:id", protect, async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
// UPDATE PRODUCT
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, brand, category, price, stock } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name || product.name;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.price = price || product.price;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;