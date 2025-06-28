import React, { useState } from "react";
import HospitalMap from "./HospitalMap";
import PredictionCard from "./PredictionCard";

const PredictionPage = () => {
  const [selectedHospital, setSelectedHospital] = useState(null);

  return (
    <div className="space-y-6 p-4">
      <HospitalMap onHospitalSelected={setSelectedHospital} />
      <PredictionCard selectedHospital={selectedHospital} />
    </div>
  );
};

export default PredictionPage;
