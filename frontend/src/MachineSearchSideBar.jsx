import { useState } from "react";
import { Menu, X } from "lucide-react";
import SelectAddress from "./SelectAddress";
import SelectMachine from "./SelectMachine";
import SelectTractor from "./SelectTractor";
import NavigationBar from "./NavigationBar";

const MachineSearchSideBar = ({
    responsedata,
    setresponsedata
  }) => {
const [selectedState, setSelectedState] = useState("");
const [selectedDistrict, setSelectedDistrict] = useState("");
const [selectedVillage, setSelectedVillage] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
        machinePurpose: "",
        machineName: "",
        withTractor: false,
        tractorBrand: "",
        tractorModel: "",
        hiringCostPerAcre: "",
        hiringCostPerHour: "",
  });
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "number") {
      const numericValue = Number(value);
  
      if (numericValue < 0) {
        alert("Hiring Cost per Acre cannot be negative.");
        return; // Prevent state update for negative values
      }
    }

    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const applyFilters = () => {
    // console.log("Applied Filters:", filters);
    // console.log(selectedState)
    // console.log(selectedDistrict)
    // console.log(selectedVillage)
 

    const filterdata = {
        selectedState,
        selectedDistrict,
        selectedVillage,
       "machinePurpose": filters.machinePurpose,
       "machineName": filters.machineName,
        "withTractor":filters.withTractor,
       " tractorBrand": filters.tractorBrand,
       " tractorModel": filters.tractorModel,
       " hiringCostPerAcre": filters.hiringCostPerAcre,
       "hiringCostPerHour": filters.hiringCostPerHour,
    }
    console.log(filterdata)

    async function senddata(){
            
      try{
      const response =  await fetch("http://127.0.0.1:8000/search_machine/",
        {
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(filterdata)
        })
        
        if(!response.ok){
            const error = await response.text();
          throw new Error(error);
        }
      const data = await response.json();
      setresponsedata(data)

       console.log(responsedata);
       alert("filtered applied successfully")
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
      <NavigationBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="mt-16"></div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-72 min-h-full bg-gray-800 text-white p-4 transition-transform border-t border-white z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white"
        >
          <X size={24} />
        </button>

        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4">
          <label className="block">Select Location</label>
          <SelectAddress
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            className="bg-[#2E3944] text-white"
          />
        </div>

        <SelectMachine
          purpose={filters.machinePurpose}
          setPurpose={(val) => setFilters((prev) => ({ ...prev, machinePurpose: val }))}
        // setPurpose={setFilters.machinePurpose}
          machineName={filters.machineName}
          setMachineName={(val) => setFilters((prev) => ({ ...prev, machineName: val }))}
        />

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="withTractor"
              checked={filters.withTractor}
              onChange={handleFilterChange}
              className="text-black"
            />
            With Tractor
          </label>
        </div>

        {filters.withTractor && (
          <SelectTractor
            brand={filters.tractorBrand}
            setBrand={(val) => setFilters((prev) => ({ ...prev, tractorBrand: val }))}
            tractorModel={filters.tractorModel}
            setTractorModel={(val) => setFilters((prev) => ({ ...prev, tractorModel: val }))}
          />
        )}

        <div className="mt-2">
          <label className="block" >Hiring Cost per Acre (₹)</label>
          <input
            type="number"
            name="hiringCostPerAcre"
            value={filters.hiringCostPerAcre}
            onChange={handleFilterChange}
            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white" 
            min="0"
          />
        </div>

        <div className="mt-2">
          <label className="block ">Hiring Cost per Hour (₹)</label>
          <input
            type="number"
            name="hiringCostPerHour"
            value={filters.hiringCostPerHour}
            onChange={handleFilterChange}
            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white"
          />
        </div>

        <button
          onClick={applyFilters}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded"
        >
          Apply Filter
        </button>
      </div>

      {/* Filter Toggle Button */}
      
    </>
  );
};

export default MachineSearchSideBar