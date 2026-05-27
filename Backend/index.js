const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("RetailIQ backend is running");
});

app.get("/test", (req, res) => {
  res.send("Backend test route working");
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});