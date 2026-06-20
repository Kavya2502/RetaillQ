const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const purchaseInvoiceRoutes = require("./routes/purchaseInvoiceRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();

/* ---------- CORS ---------- */
app.use((req, res, next) => {
  const allowedOrigins = [
  "http://localhost:3000",
  "https://retaill-q.vercel.app",
  "https://retaill-9vev4v8pr-kavya-rani-s-projects.vercel.app",
  "https://retailiq-backend-tbs4.onrender.com"
];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

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
app.use("/api/profile", profileRoutes);

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