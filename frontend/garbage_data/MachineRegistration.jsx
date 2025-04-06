import React, { useState } from "react";
import Headerpart from "./Headerpart";
// import { useNavigate } from "react-router-dom";
// import machine_data from "./machine_data.json";
// import SelectMachine from "./SelectMachine";
// import SelectTractor from "./SelectTractor";
import SelectAddress from "./SelectAddress";

function MachineRegistration() {
  const [ownerName, setOwnerName] = useState("");
  const [specification, setSpecification] = useState("");
  const [withTractor, setWithTractor] = useState("No");
  const [tractorCompany, setTractorCompany] = useState("");
  const [tractorModel, setTractorModel] = useState("");
  const [hiringCostAcre, setHiringCostAcre] = useState("");
  const [hiringCostHour, setHiringCostHour] = useState("");
  const [quantity, setQuantity] = useState("");
  const [machinePhoto, setMachinePhoto] = useState(null);

  //Selected machine name or purpose
  const [machineName, setMachineName] = useState("");
  const [purpose, setPurpose] = useState("");

  ////Location Handling
     const [selectedState, setSelectedState] = useState("");
      const [selectedDistrict, setSelectedDistrict] = useState("");
      const [selectedVillage, setSelectedVillage] = useState("");

  const handleFileChange = (event) => {
    setMachinePhoto(event.target.files);
  };
  

  const handleSubmit = () => {
    if (isAllFieldEntered()) {
      if (isAllFieldValid()) {
        const formData = {
          ownerName,
          machineName,
          purpose,
          specification,
          withTractor,
          ...(withTractor === "Yes" && {
            tractorCompany,
            tractorModel,
          }),
          hiringCostAcre,
          hiringCostHour,
          quantity,
          machinePhoto: machinePhoto ? [...machinePhoto].map((file) => file.name) : [],
        };
        alert(" Data Submitted Successfully", formData);
      }
    } else {
      alert("Please enter all details.");
    }
  };



  function isAllFieldEntered() {
    return ownerName && machineName && purpose && specification && hiringCostAcre && hiringCostHour && quantity;
  }

  function isAllFieldValid() {
    return isValidName(ownerName) && isValidName(machineName) && isValidCost(hiringCostAcre) && isValidCost(hiringCostHour) && isValidQuantity(quantity);
  }

  function isValidName(value) {
    if (/^[A-Za-z\s]+$/.test(value)) {
      return true;
    } else {
      alert("Please enter a valid name.");
      return false;
    }
  }

  function isValidCost(value) {
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
      return true;
    } else {
      alert("Please enter a valid cost.");
      return false;
    }
  }

  function isValidQuantity(value) {
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      return true;
    } else {
      alert("Please enter a valid quantity.");
      return false;
    }
  }

  return (
    <>
   <Headerpart/>
    <div className="p-6  bg-[#2E3944]  mt-30 rounded-xl max-w-xl mx-auto border border-gray-400 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Machine Registration Form</h2>

      <label className="block mt-4">Owner Name:</label>
      <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="border p-2 w-full" />

  <div className=" mt-5 ">
            
    <span className="">Select Location :</span>
      <SelectAddress
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedVillage={selectedVillage}
              setSelectedVillage={setSelectedVillage}
            />
           
          </div>


      <SelectMachine
          machineName={machineName}
          setMachineName={setMachineName}
          purpose={purpose}
          setPurpose={setPurpose}
        />

      <label className="block mt-4">Specification (e.g., Capacity):</label>
      <input type="text" value={specification} onChange={(e) => setSpecification(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">With Tractor:</label>
      <select value={withTractor} onChange={(e) => setWithTractor(e.target.value)} className="border p-2 w-full bg-[#2E3944] text-white">
        <option>No</option>
        <option>Yes</option>
      </select>

      {withTractor === "Yes" && (
        <>
          <label className="block mt-4 text-white">Tractor Company:</label>
          <SelectTractor 
            brand={tractorCompany} 
            setBrand={setTractorCompany} 
            tractorModel={tractorModel} 
            setTractorModel={setTractorModel} 
          />
          {tractorModel && <p className="text-white mt-4">Selected: {tractorModel}</p>}
        </>
      )}
      <label className="block mt-4">Hiring Cost Per Acre:</label>
      <input type="text" value={hiringCostAcre} onChange={(e) => setHiringCostAcre(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">Hiring Cost Per Hour:</label>
      <input type="text" value={hiringCostHour} onChange={(e) => setHiringCostHour(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">Quantity of Equipment:</label>
      <input type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">Upload Machine Photo:</label>
      <input type="file" multiple onChange={handleFileChange} className="border p-2 w-full" />

      <button className="bg-blue-500 text-white p-2 mt-4 w-full" onClick={handleSubmit}>
        Save Details
      </button>
    </div>
    </>
  );
}

export default MachineRegistration;