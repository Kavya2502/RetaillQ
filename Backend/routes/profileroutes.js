const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });
  res.json(profile || {});
});

router.post("/", authMiddleware, async (req, res) => {
  const profile = await Profile.findOneAndUpdate(
    { userId: req.user.id },
    { ...req.body, userId: req.user.id },
    { new: true, upsert: true }
  );

  res.json({
    message: "Profile saved successfully",
    profile,
  });
});

module.exports = router;