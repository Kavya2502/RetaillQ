const express = require("express");
const router = express.Router();
const Profile = require("../models/Profile");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user });
    res.json(profile || {});
  } catch (error) {
    res.status(500).json({ message: "Could not fetch profile" });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { userId: req.user },
      { ...req.body, userId: req.user },
      { new: true, upsert: true }
    );

    res.json({
      message: "Profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({ message: "Could not save profile" });
  }
});

module.exports = router;