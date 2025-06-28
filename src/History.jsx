import React, { useEffect, useState } from "react";
import axios from "axios";

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/history", {
          headers: { Authorization: token },
        });
        setHistory(res.data);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Prediction History</h2>
      <table className="w-full table-auto bg-white rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Past Donations</th>
            <th className="px-4 py-2">Days Since Last</th>
            <th className="px-4 py-2">Responded Last</th>
            <th className="px-4 py-2">Prediction</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, i) => (
            <tr key={i} className="border-t">
            <td className="px-4 py-2">{new Date(item.createdAt).toLocaleString()}</td>
            <td className="px-4 py-2">{item.input.past_donations}</td>
            <td className="px-4 py-2">{item.input.days_since_last_donation}</td>
            <td className="px-4 py-2">{item.input.responded_last_time ? "✅" : "❌"}</td>
            <td className="px-4 py-2">{item.prediction ? "✅" : "❌"}</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
