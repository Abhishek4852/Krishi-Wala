import React, { useState } from "react";
import jsonData from "./address_data.json"; // Import JSON file

function SelectAddress({ selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, selectedVillage, setSelectedVillage , className = ""  }) {
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  
  // Handle State Selection
  const handleStateChange = (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedDistrict(""); // Reset district
    setVillages([]); // Reset villages
    setDistricts(Object.keys(jsonData[state] || {})); // Get districts
  };

  // Handle District Selection
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setSelectedDistrict(district);
    setVillages(jsonData[selectedState]?.[district] || []);
  };

  return (
    <div className={`text-white ${className} `}>
      <select onChange={handleStateChange} value={selectedState}>
        <option value="">Select State</option>
        {Object.keys(jsonData).map((state, index) => (
          <option key={index} value={state}>{state}</option>
        ))}
      </select>

      <select onChange={handleDistrictChange} value={selectedDistrict} disabled={!selectedState}>
        <option value="">Select District</option>
        {districts.map((district, index) => (
          <option key={index} value={district}>{district}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedVillage(e.target.value)} value={selectedVillage} disabled={!selectedDistrict}>
        <option value="">Select Village</option>
        {villages.map((village, index) => (
          <option key={index} value={village}>{village}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectAddress;
