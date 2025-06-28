import React, { useState } from "react";
import PredictionCard from "./components/PredictionCard";
import ChatbotButton from "./components/ChatbotButton";
import HospitalMap from "./components/HospitalMap";
import { LoadScript } from "@react-google-maps/api";
import { motion, AnimatePresence } from "framer-motion";

const libraries = ["places"];
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function Dashboard() {
  const [userChoice, setUserChoice] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      {/* ✅ Top-Right Logout */}
      {localStorage.getItem("token") && (
        <div
          style={{
            position: "fixed",
            top: "3rem",
            right: "1rem",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      )}

      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={libraries}
        onLoad={() => setIsScriptLoaded(true)}
      >
        <AnimatePresence>
          {!userChoice && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-gray-100 z-10 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-6">
                <motion.h1
                  className="text-4xl font-bold text-gray-800"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  Welcome! Choose your preferred action
                </motion.h1>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                    onClick={() => setUserChoice("donate")}
                  >
                    I want to Donate
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
                    onClick={() => setUserChoice("request")}
                  >
                    I need Blood
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {userChoice && (
            <motion.div
              className="p-6 space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <header className="text-center space-y-4">
                <motion.h2
                  className="text-2xl font-semibold text-gray-800"
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  You chose to {userChoice === "donate" ? "donate" : "request"} blood
                </motion.h2>
              </header>

              {isScriptLoaded ? (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-6">
                    {userChoice === "donate" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <PredictionCard selectedHospital={selectedHospital} />
                      </motion.div>
                    )}
                    <motion.div
                      className="bg-white rounded-xl shadow-lg overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                    >
                      <HospitalMap onHospitalSelected={setSelectedHospital} />
                    </motion.div>
                  </div>
                </div>
              ) : (
                <p className="text-center">Loading map...</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <ChatbotButton />
      </LoadScript>
    </div>
  );
}
