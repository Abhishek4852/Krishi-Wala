import { useState } from "react";
import { Menu, X } from "lucide-react";
import SelectAddress from "./SelectAddress";
import NavigationBar from "./NavigationBar";

const LabourSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    workType: "",
    otherWork: "",
    experienceLevel: "",
    wagePerDay: "",
    wagePerHour: "",
    selectedState: "",
    selectedDistrict: "",
    selectedVillage: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleLocationChange = (name, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    console.log("Applied Filters:", filters);
    setIsOpen(false);
  };

  return (
    <>
      <NavigationBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="mt-16"></div>

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 w-64 min-h-full bg-gray-800 text-white p-4 transition-transform border-t border-white z-30
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
            selectedState={filters.selectedState}
            setSelectedState={(value) => handleLocationChange("selectedState", value)}
            selectedDistrict={filters.selectedDistrict}
            setSelectedDistrict={(value) => handleLocationChange("selectedDistrict", value)}
            selectedVillage={filters.selectedVillage}
            setSelectedVillage={(value) => handleLocationChange("selectedVillage", value)}
            className="bg-[#2E3944] text-white"
          />
        </div>

        <div className="mt-4">
          <label className="block">Work Type</label>
          <select
            name="workType"
            value={filters.workType}
            onChange={handleFilterChange}
            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white"
          >
            <option value="">Select Work Type</option>
            <option value="Ploughing">Ploughing</option>
            <option value="Sowing">Sowing</option>
            <option value="Weeding">Weeding</option>
            <option value="Harvesting">Harvesting</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Threshing">Threshing</option>
            <option value="Fertilizer Spraying">Fertilizer Spraying</option>
            <option value="Pesticide Spraying">Pesticide Spraying</option>
            <option value="Crop Transportation">Crop Transportation</option>
            <option value="Cattle Rearing">Cattle Rearing</option>
            <option value="Seed Treatment">Seed Treatment</option>
            <option value="Land Leveling">Land Leveling</option>
            <option value="Drip Irrigation Setup">Drip Irrigation Setup</option>
            <option value="Organic Farming">Organic Farming</option>
            <option value="Vermicomposting">Vermicomposting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {filters.workType === "Other" && (
          <div className="mt-4">
            <label className="block">Specify Other Work:</label>
            <input
              type="text"
              name="otherWork"
              value={filters.otherWork}
              onChange={handleFilterChange}
              className="border p-2 w-full bg-gray-700 text-white"
              placeholder="Enter work name"
            />
          </div>
        )}

        <div className="mt-4">
          <label className="block">Experience Level</label>
          <select
            name="experienceLevel"
            value={filters.experienceLevel}
            onChange={handleFilterChange}
            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white"
          >
            <option value="">Select Experience</option>
            <option value="Beginner">Beginner(0 year)</option>
            <option value="Intermediate">Intermediate (1-3 year)</option>
            <option value="Expert">Expert (3-5 year +)</option>
          </select>
        </div>

        <div className="mt-2">
          <label className="block">Wage per Day (₹)</label>
          <input
            type="number"
            name="wagePerDay"
            value={filters.wagePerDay}
            onChange={handleFilterChange}
            className="w-full p-1 rounded border border-gray-300 bg-gray-700 text-white"
          />
        </div>

        <div className="mt-2">
          <label className="block">Wage per Hour (₹)</label>
          <input
            type="number"
            name="wagePerHour"
            value={filters.wagePerHour}
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
    </>
  );
};

export default LabourSideBar;