import React, { useState } from "react";
import axios from "axios";

const PredictionCard = ({ selectedHospital }) => {
  const [pastDonations, setPastDonations] = useState("");
  const [daysSinceLast, setDaysSinceLast] = useState("");
  const [respondedLastTime, setRespondedLastTime] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pastDonations < 0 || daysSinceLast < 0) {
      setError("Values must be positive");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const payload = {
        past_donations: Number(pastDonations),
        days_since_last_donation: Number(daysSinceLast),
        responded_last_time: Number(respondedLastTime),
      };

      // 👇 Attach hospital info if available
      if (selectedHospital) {
        payload.selected_hospital = {
          name: selectedHospital.name,
          address: selectedHospital.address,
          place_id: selectedHospital.place_id,
          location: selectedHospital.location,
          distance: selectedHospital.distance,
          duration: selectedHospital.duration,
        };
      }

      const response = await axios.post(
        "http://localhost:5000/predict-availability",
        payload,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setPrediction(response.data.prediction);
    } catch (err) {
      console.error("Prediction error:", err);
      setError("Failed to fetch prediction.");
    }
  };

  return (
    <div className="p-4 shadow-md rounded-lg bg-white max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Check Donation Eligibility</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          min="0"
          placeholder="Past Donations"
          value={pastDonations}
          onChange={(e) => setPastDonations(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          min="0"
          placeholder="Days Since Last Donation"
          value={daysSinceLast}
          onChange={(e) => setDaysSinceLast(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <select
          value={respondedLastTime}
          onChange={(e) => setRespondedLastTime(e.target.value)}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Responded Last Time?</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Predict
        </button>
      </form>

      {error && <div className="text-red-600 mt-2">{error}</div>}

      {prediction !== null && (
        <div className="mt-4 text-lg font-bold">
          {prediction === 1 ? "✅ You are eligible to donate!" : "❌ You are not eligible."}
        </div>
      )}
    </div>
  );
};

export default PredictionCard;
