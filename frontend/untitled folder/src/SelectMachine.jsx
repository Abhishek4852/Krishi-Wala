import React, { useState } from "react";
import machine_data from "./machine_data.json"; 
import SelectTractor from "./SelectTractor";

function SelectMachine({ purpose, setPurpose, 
  machineName, setMachineName }) {
    const [machineList, 
      setMachineList] = useState([]);  
    
   

    // Handle Purpose Selection
    const handlePurposeChange = (e) => {
      const selectedPurpose = e.target.value;
      setPurpose(selectedPurpose);  // Update parent state
      setMachineList(""); // Reset machine selection
      setMachineList(machine_data[selectedPurpose] || []); // Load machines based on purpose
    };
  
    return (
      <div className="text-white">
        <label className="block mt-4 ">Purpose of Machine:</label>
        <select onChange={handlePurposeChange} value={purpose} className="border p-2 w-full bg-[#2E3944] text-white">
          <option value="">Select Purpose</option>
          {Object.keys(machine_data).map((purposeName, index) => (
            <option key={index} value={purposeName}>{purposeName}</option>
          ))}
        </select>
  
        <label className="block mt-4">Machine Name:</label>
        <select 
          onChange={(e) => setMachineName(e.target.value)} 
          value={machineName||""} 
          className="border p-2 w-full bg-[#2E3944] text-white " 
          disabled={!purpose} // Disable machine selection if no purpose is selected
        >
          <option value="">Select Machine</option>
        
          {machineList && Array.isArray(machineList) ? (
          machineList.map((machine, index) => (
            <option key={index} value={machine}>{machine}</option>
          ))
        ) : null}
        </select>
      </div>
    );
  }
  
  export default SelectMachine; 