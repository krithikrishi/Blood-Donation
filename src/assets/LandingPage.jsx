import React from "react";
import { Link } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-container">
      <header>
        <nav>
          <Link to="/login" className="btn">Login</Link>
          <Link to="/signup" className="btn">Sign Up</Link>
        </nav>
      </header>

      <main>
        {/* 👇 Blood drop animation goes here */}
        <div className="blood-drip-wrapper">
          <div className="blood-drop" />
        </div>

        <h1>
          Blood Donation <span className="drip">and Receiving</span> Made Easy
        </h1>
      </main>
    </div>
  );
}
