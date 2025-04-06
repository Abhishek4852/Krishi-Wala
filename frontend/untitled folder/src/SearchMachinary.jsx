import React, { useState, useEffect } from "react";
import MachineSearchSideBar from "./MachineSearchSideBar";
import TakeLandOnRent from "./TakeLandOnRent";
function SearchMachinary() {
 
  const [machineryListings, setMachineryListings] = useState([]);
  const [responsedata, setresponsedata]= useState()

  useEffect(() => {
    const sampleMachineryData = Array(8).fill().map((_, i) => ({
      id: i + 1,
      machineName: `Machine ${i + 1}`,
      machinePurpose: "Tilling",
      withTractor: i % 2 === 0,
      tractorBrand: "Mahindra",
      tractorModel: `Model ${i + 1}`,
      hiringCostPerAcre: 500 + i * 50,
      hiringCostPerHour: 200 + i * 20,
      location: {
        state: "Madhya Pradesh",
        district: "Indore",
        village: `Village ${i + 1}`,
      },
      machinePhotos: ["harvester.jpeg", "harvester2.jpeg"],
    }));
    setMachineryListings(sampleMachineryData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <MachineSearchSideBar
  responsedata={responsedata}
  setresponsedata={setresponsedata}      
      />

      <div className="flex flex-grow">
        <div className="hidden md:block w-72 bg-gray-800 text-white p-4">

        </div>

        <div className="flex-grow p-6 overflow-y-auto max-h-screen">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {machineryListings.map((machine, index) => (
              <div key={index} className="bg-gray-800 shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full">
                <div className="w-full md:w-1/2 relative overflow-hidden">
                  <div className="flex overflow-x-scroll space-x-2 p-2 scrollbar-hide">
                    {machine.machinePhotos.map((photo, idx) => (
                      <img key={idx} src={`/images/${photo}`} alt="Machine" className="w-full h-56 object-cover rounded-lg"/>
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{machine.machineName}</h3>
                    <p>Purpose: <span className="font-semibold">{machine.machinePurpose}</span></p>
                    <p>Cost per Acre: <span className="font-semibold">₹{machine.hiringCostPerAcre}</span></p>
                    <p>Cost per Hour: <span className="font-semibold">₹{machine.hiringCostPerHour}</span></p>
                    <p>Location: <span className="font-semibold">{machine.location.village}, {machine.location.district}</span></p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button className="bg-green-600 text-white px-3 py-1 rounded">Book</button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
   
  );
}

export default SearchMachinary;