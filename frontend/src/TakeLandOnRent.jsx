import React, { useState, useEffect } from "react";
import TakeLandOnRentHeader from "./TakeLandOnRentHeader";
import BookingRequestLand from "./BookingRequestLand";
// import { use } from "react";

function TakeLandOnRent() {
  // State variables for filters
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");
  const [size, setsize] = useState(0)
  const [pricePerAcre, setpricePerAcre] = useState(0)
  const [period, setperiod] = useState(0);
  const [irrigationSource, setirrigationSource] = useState([]);
  const [filteredData, setfilteredData] = useState();
  const [responseData , setresponseData] = useState()


// Booking Request state
const [selectedLand, setSelectedLand] = useState(null);
const [isBookingOpen, setIsBookingOpen] = useState(false);

  // State to store fetched product data
  const [landListings, setLandListings] = useState([]);
  useEffect(() => {
    if (Array.isArray(responseData)) {
      setLandListings(responseData);
      console.log("land listing data ",landListings)
    } else {
      console.error("Invalid responseData format", responseData);
      setLandListings([]);
    }
  }, [responseData]);
  
  

  // Sample API Response (for Testing)
  useEffect(() => {
    const sampleData = Array(6).fill().map((_, i) => ({
      id: i + 1,
      size: 5 + i,
      period: 12 + i,
      pricePerAcre: 15000 + i * 1000,
      irrigationSource: ["Canal", "Borewell"],
      extraFacilities: "Electricity, Storage",
      location: {
        state: "Madhya Pradesh",
        district: "Indore",
        village: `Village ${i + 1}`,
      },
      landPhotos: [
        "land1.png","land2.png"
      ],
    }));
    setLandListings(sampleData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <TakeLandOnRentHeader
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
        size={size}
        setsize={setsize}
        pricePerAcre={pricePerAcre}
        setpricePerAcre={setpricePerAcre}
        period={period}
        setperiod={setperiod}
        irrigationSource={irrigationSource}
        setirrigationSource={setirrigationSource}
        filteredData={filteredData}
        setfilteredData={setfilteredData}
        setresponseData={setresponseData}
        

      />

      
        {/* Main Content Area with Scrollbar */}
        <div className="flex-grow p-6 overflow-y-auto max-h-screen flex-col md:ml-64 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {landListings.map((land, index) => (
              <div key={index} className="bg-[#2E3944] shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full">
                
                {/* Left Side - Image Slider */}
                <div className="w-full md:w-1/2 relative overflow-hidden">
                  <div className="flex overflow-x-scroll space-x-2 p-2 scrollbar-hide">
                    {land.images?.map((photo, idx) => (
                  <img 
                    key={idx}  
                    src={`data:image/jpeg;base64,${photo}`}  
                    alt="Land" 
                    className="w-full h-56 object-cover rounded-lg"
                  />
                ))}
                  </div>
                </div>

                {/* Right Side - Details */}
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{land.village}, {land.district}</h3>
                    <p>Size: <span className="font-semibold">{land.LandSize} acres</span></p>
                    <p>Price: <span className="font-semibold">₹{land.RentPricePerAcre }/acre</span></p>
                    <p>Period: <span className="font-semibold">{land.rentPeriod} months</span></p>
                    <p>Irrigation: <span className="font-semibold">{Array.isArray(land.irrigationSource) ? land.irrigationSource.join(", ") : land.irrigationSource}</span></p>
                    <p>Facilities: <span className="font-semibold">{land.extraFacilities}</span></p>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-between mt-4">
                  <button onClick={() => { setSelectedLand(land); setIsBookingOpen(true); }} className="bg-green-600 text-white px-3 py-1 rounded">Book request</button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        </div>

        {/* Render BookingRequest */}
      {isBookingOpen && <BookingRequestLand isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} landData={selectedLand} />}
      </div>
    // </div>
  );
}

export default TakeLandOnRent;
