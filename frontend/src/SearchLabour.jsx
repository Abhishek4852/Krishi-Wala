import React, { useState, useEffect } from "react";
import LabourSideBar from "./LabourSideBar";
import LabourHireRequest from "./LabourHireRequest";
function SearchLabour() {
  // const [selectedState, setSelectedState] = useState("");
  // const [selectedDistrict, setSelectedDistrict] = useState("");
  // const [selectedVillage, setSelectedVillage] = useState("");
  const [filters, setFilters] = useState({
    labourType: "",
    experience: "",
    dailyWage: "",
    availability: false,
  });
  const [responsedata, setresponsedata]= useState([])
  const [labourListings, setLabourListings] = useState([]);


  const [showHirePopup, setShowHirePopup] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  
  useEffect(() => {
    if (Array.isArray(responsedata)) {
      setLabourListings(responsedata);
      console.log("land listing data ",labourListings)
    } else {
      console.error("Invalid responseData format", responsedata);
      setLabourListings([]);
    }
  }, [responsedata]);


  useEffect(() => {
    const sampleLabourData = Array(8).fill().map((_, i) => ({
      id: i + 1,
      name: `Labour ${i + 1}`,
      labourType: "Construction",
      experience: `${i + 1} years`,
      dailyWage: 500 + i * 50,
      availability: i % 2 === 0,
      location: {
        state: "Madhya Pradesh",
        district: "Indore",
        village: `Village ${i + 1}`,
      },
      profilePhoto: "labour.jpeg",
    }));
    setLabourListings(sampleLabourData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <LabourSideBar
      
        responsedata={responsedata}
        setresponsedata={setresponsedata}
      />

      <div className="flex flex-grow">
        {/* <div className="hidden md:block w-96 bg-gray-800 text-white p-4">
          {/* <h2 className="text-lg font-bold">Filters Applied</h2>
          <ul>
            {selectedState && <li>State: {selectedState}</li>}
            {selectedDistrict && <li>District: {selectedDistrict}</li>}
            {selectedVillage && <li>Village: {selectedVillage}</li>}
            {filters.labourType && <li>Type: {filters.labourType}</li>}
            {filters.experience && <li>Experience: {filters.experience}</li>}
            {filters.dailyWage && <li>Wage: ₹{filters.dailyWage}</li>}
            {filters.availability && <li>Available</li>}
          </ul> */}
        {/* </div> */} 

        <div className="flex-grow p-6 overflow-y-auto max-h-screen ml-0 md:ml-72">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labourListings.map((labour, index) => (
              <div key={index} className="bg-gray-800 shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full">
                <div className="w-full md:w-1/3 p-2">
                  <img src={`http://127.0.0.1:8000${labour.profilePhoto}`} alt="Labour" className="w-full h-40 object-cover rounded-lg"/>
                </div>
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{labour.name}</h3>
                    <p>Type: <span className="font-semibold">{labour.labourType}</span></p>
                    <p>Experience: <span className="font-semibold">{labour.experience}</span></p>
                    <p>Wage: <span className="font-semibold">₹{labour.dailyWage}</span></p>
                    <p>Location: <span className="font-semibold">{labour.location.village}, {labour.location.district}</span></p>
                  </div>
                  <div className="flex justify-between mt-4">
                   <button
  className="bg-green-600 text-white px-3 py-1 rounded"
  onClick={() => {
    setSelectedLabour(labour);
    setShowHirePopup(true);
  }}
>
  Hire Labour
</button>

                    <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showHirePopup && selectedLabour && (
  <LabourHireRequest
    labour={selectedLabour}
    open={showHirePopup}
    setOpen={setShowHirePopup}
  />
)}


    </div>
  );
}

export default SearchLabour;