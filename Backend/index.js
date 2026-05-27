const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const purchaseInvoiceRoutes = require("./routes/purchaseInvoiceRoutes");

const app = express();

/* ---------- CORS ---------- */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ---------- Middleware ---------- */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- Test Route ---------- */
app.get("/", (req, res) => {
  res.send("RetailIQ backend is running");
});

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend updated and working",
  });
});

app.get("/api/test-auth", (req, res) => {
  res.send("Auth test route working");
});

/* ---------- Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/purchase-invoices", purchaseInvoiceRoutes);

/* ---------- MongoDB ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });