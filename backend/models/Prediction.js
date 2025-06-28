const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  input: {
    past_donations: Number,
    days_since_last_donation: Number,
    responded_last_time: Number
  },
  prediction: {
    type: Number, // 0 or 1
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Prediction", PredictionSchema);
