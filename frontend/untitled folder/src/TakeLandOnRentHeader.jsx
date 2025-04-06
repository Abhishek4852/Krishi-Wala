import { useState, useEffect } from "react";
import { X } from "lucide-react";
import SelectAddress from "./SelectAddress";

export default function TakeLandOnRentHeader({
  selectedState,
  setSelectedState,
  selectedDistrict,
  setSelectedDistrict,
  selectedVillage,
  setSelectedVillage,
  size,
  setsize,
  pricePerAcre,
  setpricePerAcre,
  period,
  setperiod,
  irrigationSource,
  setirrigationSource,
  filteredData,
  setfilteredData,
  setresponseData,
}) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize(); // Run initially
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  const  applyFilters = () => {
    const filters = {
      selectedState,
      selectedDistrict,
      selectedVillage,
      size,
      pricePerAcre,
      period,
      irrigationSource,
    };

    setfilteredData(filters);


    // console.log("Applied Filters:", filters);
    console.log(filteredData)
    async function senddata(){
            
      try{
      const response =  await fetch("http://127.0.0.1:8000/filter_land/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(filteredData)
        })
        
        if(!response.ok){
            const error = await response.text();
          throw new Error(error);
        }
      const data = await response.json();
      //  console.log(data);
       setresponseData(data)
       alert("Filtered applied successfully")
      //  navigate("/Login");

      }
      catch(error){
        if(error.name === "TypeError"){
          alert("Network Connection failed")
        console.log("Network Connection failed ",error.message);
        }else{ 
          alert("Something went wrong")
         console.log("other error ",error.message);
      }}
      
         
    }
  
  senddata();
  

    setIsOpen(false);
  };

  return (
    <>
      <nav className="bg-[#2E3944] shadow-md p-4 fixed w-full top-0 left-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img src="logo.png" alt="Logo" className="h-10" />
            {isMobile && (
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="bg-[#2E3944] text-white p-2  rounded border border-white" style={{ backgroundColor: "#2E3944" }}
              >
                Apply Filter
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white px-3 py-1 rounded w-32 sm:w-1/2 md:w-2/3 outline-none border border-white placeholder-white"
            />
          </div>
        </div>
      </nav>

      <div className="mt-16"></div>

      <div
  className={`fixed top-16 pt-0 mt-1.5 left-0 w-64 min-h-full bg-gray-800 text-white p-4 transition-transform border-t border-white
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} 
    md:block md:translate-x-0 z-30`}
>

        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-white">
            <X size={24} />
          </button>
        )}
        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4 text-white">
          <label className="block">Select Location</label>
          <SelectAddress
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            className="text-white bg-[#2E3944]"
          />
        </div>

        <div className="mt-4">
          <label className="block">Size (in acres)</label>
          <input
            type="text"
            name="size"
            value={size}
            onChange={(e)=> {setsize(e.target.value)}}
            className="w-full p-2 text-black rounded bg-white h-6"
          />
        </div>

        <div className="mt-4">
          <label className="block">Price Per Acre</label>
          <input
            type="text"
            name="pricePerAcre"
            value={pricePerAcre}
            onChange={(e)=> {setpricePerAcre(e.target.value)}}
            className="w-full p-2 text-black rounded bg-white h-6"
          />
        </div>

        <div className="mt-4">
          <label className="block">Period (in months)</label>
          <input
            type="text"
            name="period"
            value={period}
            onChange={(e)=> {setperiod(e.target.value)}}
            className="w-full p-2 text-black rounded bg-white h-6"
          />
        </div>

        <div className="mt-4">
          <label className="block">Irrigation Source</label>
          <div className="flex flex-col">
            {["Canal", "Borewell", "River", "Rainwater"].map((source) => (
              <label key={source} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={irrigationSource.includes(source)}
                  onChange={(e) => {
                    setirrigationSource((prev) => {
                      const updatedSet = new Set(prev);
                      e.target.checked ? updatedSet.add(source) : updatedSet.delete(source);
                      return [...updatedSet];
                    });
                  }}
                  className="form-checkbox"
                />
                {source}
              </label>
            ))}
          </div>
        </div>

        <button onClick={applyFilters} className="mt-4 w-full p-2 bg-[#2E3944] text-white rounded">
          Apply Filter
        </button>
      </div>
    </>
  );
}
