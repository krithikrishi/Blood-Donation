// routes/predictionRoutes.js
const express = require("express");
const router = express.Router();
const Prediction = require("../models/Prediction");
const verifyToken = require("../middleware/verifyToken");

router.get("/history", verifyToken, async (req, res) => {
  try {
    const predictions = await Prediction.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(predictions);
  } catch (err) {
    console.error("Error fetching prediction history:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

module.exports = router;
