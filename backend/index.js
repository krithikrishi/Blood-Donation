const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Prediction = require("./models/Prediction");
const verifyToken = require("./middleware/auth");

const app = express();
app.use("/", require("./routes/predictionRoutes"));



require("dotenv").config();

const User = require("./models/User"); // 👈 import the model


const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Signup Route
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, message: "Login successful" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
const { spawn } = require("child_process");
const axios = require('axios');
app.post("/save-prediction", verifyToken, async (req, res) => {
  try {
    const { past_donations, days_since_last_donation, responded_last_time, prediction } = req.body;

    const newPrediction = new Prediction({
      userId: req.user.userId, // from decoded token
      past_donations,
      days_since_last_donation,
      responded_last_time,
      prediction,
    });

    await newPrediction.save();

    res.status(201).json({ message: "Prediction saved successfully" });
  } catch (err) {
    console.error("Save prediction error:", err);
    res.status(500).json({ message: "Failed to save prediction" });
  }
});
// Logout Route
app.post("/logout", (req, res) => {
  res.clearCookie("token"); // Clear cookie if you're using it
  req.session?.destroy(() => {
    res.status(200).json({ message: "Logged out" });
  });
});



app.post("/predict-availability", verifyToken, async (req, res) => {
  try {
    const { past_donations, days_since_last_donation, responded_last_time } = req.body;

    const flaskRes = await axios.post("http://localhost:5001/predict", {
      past_donations,
      days_since_last_donation,
      responded_last_time
    });

    const predictionResult = flaskRes.data.prediction;

    // 👇 Save to DB
    const newPrediction = new Prediction({
      userId: req.user.userId, // <-- make sure user is added to req via auth middleware
      input: {
        past_donations,
        days_since_last_donation,
        responded_last_time
      },
      prediction: predictionResult
    });

    await newPrediction.save();

    res.json({ prediction: predictionResult });
  } catch (err) {
    console.error("Prediction error:", err);
    res.status(500).json({ message: "Prediction failed" });
  }
});





app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
