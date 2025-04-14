import { useState, useEffect } from "react";
import { X } from "lucide-react";
import SelectAddress from "./SelectAddress";
import ProfileUpperNavigationBar from "./ProfileUpperNavigationBar";
import ChatSupport from "./ChatSupport";
import SearchUpperNav from "./SearchUpperNav";
import SearchMachineNavigationBar from "./SearchMachineNavigationBar";
import NavigationBar from "./NavigationBar";
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
    

    // setfilteredData(filters);


    // console.log("Applied Filters:", filters);
    
    
    async function senddata(){
            
      try{
        const filters = {
        selectedState,
        selectedDistrict,
        selectedVillage,
        size,
        pricePerAcre,
        period,
        irrigationSource,
      };

      console.log("filter data", filters)
      const response =  await fetch("http://127.0.0.1:8000/filter_land/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(filters)
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

  const inputClass =
    "text-white flex flex-col text-base";
    const placeholder = "bg-white text-black rounded-xl border-gray-800 border-2 w-full";

  return (
    <>
      
      
      {/* <SearchUpperNav
  isSidebarOpen={isOpen}
  setIsSidebarOpen={setIsOpen}
/> */}
     {/* <NavigationBar isOpen={isOpen} setIsOpen={setIsOpen} /> */}
    <NavigationBar setIsOpen={setIsOpen} />
   {/* <SearchMachineNavigationBar setIsOpen={setIsOpen} /> */}
      <div className="mt-16"></div>
      
      <div
  className={`fixed left-0 h-full w-64 bg-green-800 text-white p-6 shadow-lg z-40 mt-14
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} 
    md:block md:translate-x-0 z-30`}
>

        {isMobile && (
          <button onClick={() => setIsOpen(false)} className="absolute top-2 right-2 text-white">
            <X size={24} className="mt-6"/>
          </button>
        )}
        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4 text-white">
          <label className="block">Select Location</label>
          <SelectAddress
          selectedState={selectedState}
          selectedDistrict={selectedDistrict}
          selectedVillage={selectedVillage}
          setSelectedState={setSelectedState}
          setSelectedDistrict={setSelectedDistrict}
          setSelectedVillage={setSelectedVillage}
          className={inputClass}
          placeholder={placeholder}
        />
        </div>

        <div className="mt-4">
          <label className="block">Size (in acres)</label>
          <input
            type="text"
            name="size"
            value={size}
            onChange={(e)=> {setsize(e.target.value)}}
            className="bg-white text-black rounded-lg border-gray-800 border-2 w-full"
          />
        </div>

        <div className="mt-4">
          <label className="block">Price Per Acre</label>
          <input
            type="text"
            name="pricePerAcre"
            value={pricePerAcre}
            onChange={(e)=> {setpricePerAcre(e.target.value)}}
            className="bg-white text-black rounded-lg border-gray-800 border-2 w-full"
          />
        </div>
        
        <div className="mt-4">
          <label className="block">Period (in months)</label>
          <input
            type="text"
            name="period"
            value={period}
            onChange={(e)=> {setperiod(e.target.value)}}
            className="bg-white text-black rounded-lg border-gray-800 border-2 w-full"
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
                  className="h-5 w-5 rounded border border-gray-400 bg-white checked:bg-green-800 checked:border-green-800 checked:text-white checked:content-['✓'] flex items-center justify-center"
                />
                {source}
              </label>
            ))}
          </div>
        </div>

        <button onClick={applyFilters} className="mt-4 w-full p-2 bg-green-950 text-white rounded">
          Apply Filter
        </button>
      </div>
    </>
  );
}
