import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import SelectAddress from "./SelectAddress";

function LabourHireRequest({ labour, open, setOpen }) {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    workTime: "",
    workUnit: "Day",
    workLocation: {},
    workType: "",
    otherWork: "",
    description: "",
  });

  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUnitChange = (unit) => {
    setFormData({ ...formData, workUnit: unit });
  };

  const handleWorkChange = (e) => {
    setFormData({ ...formData, workType: e.target.value });
  };

  const handleOtherWorkChange = (e) => {
    setFormData({ ...formData, otherWork: e.target.value });
  };

  const handleSubmit = () => {
    const { name, mobile, workTime, workUnit, workType } = formData;

    if (!name || !mobile || !rentingPeriod.start || !rentingPeriod.end || !workTime || !workUnit || !workType) {
      alert("Please fill all required fields.");
      return;
    }

    const finalLocation = {
      state: selectedState,
      district: selectedDistrict,
      village: selectedVillage,
    };

    const requestData = {
      "receiver_mobile":labour.owner_mobile,
      ...formData,
      period: rentingPeriod,
      workLocation: finalLocation,
      "status":"pending",

      workType: workType === "Other" ? formData.otherWork : workType,
    };
    async function senddata(){
      try {
        const response = await fetch("http://127.0.0.1:8000/labour_request/",{
          method:"POST",
          headers:{
            'Content-Type':"application/json"
          },
          body:JSON.stringify(requestData)
        })
        if(!response.ok){
          const error = await response.text();
          throw new Error(error)
        }
        const data = await response.json()

        console.log(data)
        alert(data.message)
      }
      catch(e){
        if(e.name === "TypeError" )
          alert("Connection failed")
        else {
          alert("something went wrong")
          console.log(e.message)
        }
      }
    }
senddata();
 alert("request sent")
    // console.log("Hiring Request:", requestData);
    // console.log(labour.owner_mobile)
    setOpen(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2E3944] p-6 rounded-lg shadow-lg w-96">
          <Dialog.Close asChild>
            <button className="absolute top-3 right-3 text-black text-xl font-bold hover:text-red-600" aria-label="Close">
              ×
            </button>
          </Dialog.Close>

          <h2 className="text-xl font-bold mb-4 text-white">Labour Hiring Request</h2>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          />

          <input
            type="number"
            name="mobile"
            placeholder="Enter mobile number"
            value={formData.mobile}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          />
           <label className="block text-white mt-2"> Select Working Period</label>
          <div className="flex space-x-2 mb-3">
          
            <input
              type="date"
              className="border p-2 rounded w-1/2"
              value={rentingPeriod.start}
              onChange={(e) => setRentingPeriod({ ...rentingPeriod, start: e.target.value })}
              placeholder="Start date"
            />
            <input
              type="date"
              className="border p-2 rounded w-1/2"
              value={rentingPeriod.end}
              onChange={(e) => setRentingPeriod({ ...rentingPeriod, end: e.target.value })}
              placeholder="End date"
            />
          </div>

          <input
            type="number"
            name="workTime"
            placeholder="Enter work duration (in number)"
            value={formData.workTime}
            onChange={handleChange}
            className="border p-2 w-full mb-3 rounded"
          />

          <div className="flex items-center gap-4 mb-3 text-white">
            <label className="flex items-center">
              <input type="radio" name="unit" checked={formData.workUnit === "Day"} onChange={() => handleUnitChange("Day")} className="mr-2" />
              Day
            </label>
            <label className="flex items-center">
              <input type="radio" name="unit" checked={formData.workUnit === "Hour"} onChange={() => handleUnitChange("Hour")} className="mr-2" />
              Hour
            </label>
          </div>

          <SelectAddress
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedVillage={selectedVillage}
            setSelectedVillage={setSelectedVillage}
            className="space-x-2 mb-4"
          />

          <select
            value={formData.workType}
            onChange={handleWorkChange}
            className="border p-2 w-full mb-3 bg-[#2E3944] rounded"
          >
            <option value="">-- Select Work Type --</option>
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

          {formData.workType === "Other" && (
            <input
              type="text"
              value={formData.otherWork}
              onChange={handleOtherWorkChange}
              placeholder="Specify other work"
              className="border p-2 w-full mb-3 rounded"
            />
          )}
          <label className="block mt-2">Description (Optional)</label>
          <textarea 
  name="description"
  className="w-full border p-2 rounded"
  value={formData.description}
  onChange={handleChange}
/>
          <div className="flex justify-end gap-2 pt-4">
            <Dialog.Close asChild>
              <button className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
            </Dialog.Close>
            <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default LabourHireRequest;
