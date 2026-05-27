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
const corsOptions = {
  origin: "https://retail-q.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* ---------- Middleware ---------- */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- Home Route ---------- */
app.get("/", (req, res) => {
  res.send("RetailIQ backend is running");
});

/* ---------- Test Routes ---------- */
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend updated and working",
  });
});

app.get("/api/test-auth", (req, res) => {
  res.send("Auth test route working");
});

/* ---------- API Routes ---------- */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/purchase-invoices", purchaseInvoiceRoutes);

/* ---------- MongoDB Connection ---------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error.message);
  });