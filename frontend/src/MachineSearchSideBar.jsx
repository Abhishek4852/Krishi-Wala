import { useState } from "react";
import { Menu, X } from "lucide-react";
import SelectAddress from "./SelectAddress";
import SelectMachine from "./SelectMachine";
import SelectTractor from "./SelectTractor";
import NavigationBar from "./NavigationBar";
import SearchMachineNavigationBar from "./SearchMachineNavigationBar";

const MachineSearchSideBar = ({ responsedata, setresponsedata }) => {
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
    if (type === "number" && Number(value) < 0) {
      alert("Hiring Cost per Acre cannot be negative.");
      return;
    }
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const applyFilters = () => {
    const filterdata = {
      selectedState,
      selectedDistrict,
      selectedVillage,
      machinePurpose: filters.machinePurpose,
      machineName: filters.machineName,
      withTractor: filters.withTractor,
      tractorBrand: filters.tractorBrand,
      tractorModel: filters.tractorModel,
      hiringCostPerAcre: filters.hiringCostPerAcre,
      hiringCostPerHour: filters.hiringCostPerHour,
    };

    console.log(filterdata);

    async function senddata() {
      try {
        const response = await fetch("https://krishi-wala.onrender.com/search_machine/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filterdata),
        });

        if (!response.ok) throw new Error(await response.text());

        const data = await response.json();
        setresponsedata(data);
        alert("Filtered applied successfully");
      } catch (error) {
        if (error.name === "TypeError") {
          alert("Network Connection failed");
          console.log("Network Error: ", error.message);
        } else {
          alert("Something went wrong");
          console.log("Other Error: ", error.message);
        }
      }
    }

    senddata();
    setIsOpen(false); // Auto close sidebar on mobile
  };
  const inputClass =
  "text-white flex flex-col text-base";
  const placeholder = "bg-white text-black rounded-xl border-gray-800 border-2 w-full";

  return (
    <>

      {/* <div className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 z-50 text-green-800 shadow-md fixed p-4 w-full top-0 left-0 z-50 ">
       
        <button
          className="md:hidden mr-3 text-green-700"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={28} />
        </button>


        <h1 className="font-bold text-green-700 text-xl sm:text-4xl">
          🌾 KrishiWala
        </h1>
      </div> */}

  <NavigationBar isOpen={isOpen} setIsOpen={setIsOpen} />


  {/* <SearchMachineNavigationBar setIsOpen={setIsOpen} /> */}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-72 min-h-full bg-green-700 text-white p-4 transition-transform border-t border-white z-30
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-white"
        >
          <X size={24} className="mt-3"/>
        </button>

        <h2 className="text-lg font-bold">Apply Filters</h2>

        <div className="mt-4">
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

        <SelectMachine
          className={inputClass}
          placeholder={placeholder}
          purpose={filters.machinePurpose}
          setPurpose={(val) =>
            setFilters((prev) => ({ ...prev, machinePurpose: val }))
          }
          machineName={filters.machineName}
          setMachineName={(val) =>
            setFilters((prev) => ({ ...prev, machineName: val }))
          }
        />

        <div className="mt-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="withTractor"
              checked={filters.withTractor}
              onChange={handleFilterChange}
              className="h-5 w-5 rounded border border-gray-400 bg-white checked:bg-green-800 checked:border-green-800 checked:text-white checked:content-['✓'] flex items-center justify-center"
            />
            With Tractor
          </label>
        </div>

        {filters.withTractor && (
          <SelectTractor
          className={inputClass}
          placeholder={placeholder}
            brand={filters.tractorBrand}
            setBrand={(val) =>
              setFilters((prev) => ({ ...prev, tractorBrand: val }))
            }
            tractorModel={filters.tractorModel}
            setTractorModel={(val) =>
              setFilters((prev) => ({ ...prev, tractorModel: val }))
            }
          />
        )}

        <div className="mt-2">
          <label className="block">Hiring Cost per Acre (₹)</label>
          <input
            type="number"
            name="hiringCostPerAcre"
            value={filters.hiringCostPerAcre}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-lg border-gray-800 border-2 w-full"
            min="0"
          />
        </div>

        <div className="mt-2">
          <label className="block">Hiring Cost per Hour (₹)</label>
          <input
            type="number"
            name="hiringCostPerHour"
            value={filters.hiringCostPerHour}
            onChange={handleFilterChange}
            className="bg-white text-black rounded-lg border-gray-800 border-2 w-full"
          />
        </div>

        <button
          onClick={applyFilters}
          className="mt-4 w-full p-2 bg-green-950 text-white rounded"
        >
          Apply Filter
        </button>
      </div>
    </>
  );
};

export default MachineSearchSideBar;
