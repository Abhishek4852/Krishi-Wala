import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

import SelectAddress from "./SelectAddress";

function BookingRequestMachine({ open, setOpen, machinedata }) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [hour, sethour] = useState("");
  const [description, setDescription] = useState("");
  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const validate = () => {
    if (!name.trim()) return alert("Please enter your name");
    if (!/^\d{10}$/.test(mobile)) return alert("Enter a valid 10-digit mobile number");
    if (!rentingPeriod.start || !rentingPeriod.end) return alert("Please select both start and end dates");
    if (!selectedState || !selectedDistrict || !selectedVillage) return alert("Please select a valid location");
    return true;
  };

  const handleSubmit = () => {
    if (validate()) {
      const requestData = {
        name,
        "sender_mobile":mobile,
        hour,
        rentingPeriod,
        location: {
          state: selectedState,
          district: selectedDistrict,
          village: selectedVillage,
        },
        description,
        "status":"pending",
        machinedata,
      };


      async function senddata(){
        try {
          const response = await fetch("http://127.0.0.1:8000/machine_request/",{
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



      console.log("Booking Request Data:", requestData);
      setOpen(false); // Close modal
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#2E3944] p-6 rounded-lg shadow-lg w-96">
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500"
              aria-label="Close"
            >
              ×
            </button>
          </Dialog.Close>

          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-xl font-semibold">Booking Request</Dialog.Title>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded p-2"
            />

            <input
              type="text"
              placeholder="Enter Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full border rounded p-2"
            />

            <div>
              <label className="block text-white mt-2">Renting Period</label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="border p-2 rounded w-1/2"
                  value={rentingPeriod.start}
                  onChange={(e) =>
                    setRentingPeriod({ ...rentingPeriod, start: e.target.value })
                  }
                />
                <input
                  type="date"
                  className="border p-2 rounded w-1/2"
                  value={rentingPeriod.end}
                  onChange={(e) =>
                    setRentingPeriod({ ...rentingPeriod, end: e.target.value })
                  }
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="How Time require in Hour ?"
              value={hour}
              onChange={(e) => sethour(e.target.value)}
              className="w-full border rounded p-2"
            />

            <SelectAddress
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedVillage={selectedVillage}
              setSelectedVillage={setSelectedVillage}
              className="space-x-2"
            />

            <textarea
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded p-2 h-24"
            />

            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              </Dialog.Close>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Send Request
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default BookingRequestMachine;
