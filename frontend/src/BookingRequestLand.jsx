import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";

const BookingRequestLand = ({ isOpen, onClose, landData }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [landSize, setLandSize] = useState("");
  const [rentingPeriod, setRentingPeriod] = useState({ start: "", end: "" });
  const [description, setDescription] = useState("");

  const validateForm = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    if (!nameRegex.test(name)) {
      alert("Name should not contain numbers or special characters.");
      return false;
    }
    if (!mobileRegex.test(mobile)) {
      alert("Mobile number should be 10 digits and start with 6 or higher.");
      return false;
    }
    if (!landSize || landSize <= 0) {
      alert("Please enter a valid land size.");
      return false;
    }
    if (!rentingPeriod.start || !rentingPeriod.end) {
      alert("Please select a valid renting period.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const LandRequest = {
        name,
        "sender_mobile":mobile,
        landSize,
        rentingPeriod,
        description,
        "receiver_mobile":landData.owner_mobile,
        "status":"pending",
        "land_id":landData.land_id,
      };


      async function senddata(){
        try {
          const response = await fetch("http://127.0.0.1:8000/land_request/",{
            method:"POST",
            headers:{
              'Content-Type':"application/json"
            },
            body:JSON.stringify(LandRequest)
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


      console.log("Land Request Submitted:", LandRequest);
      onClose(); // Close the dialog after successful submission
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-100 text-black border-green-600 border-2 shadow-lg p-6 rounded-lg w-96">

            {/* ❌ Close Button */}
          <Dialog.Close asChild>
            <button
              className="absolute top-3 right-3 text-white text-2xl font-bold hover:text-red-500"
              aria-label="Close"
            >
              ×
            </button>
          </Dialog.Close>
          <Dialog.Title className="text-lg font-bold">Booking Request</Dialog.Title>
          <div className="mt-4">
            <label className="block">Enter Your Name</label>
            <input
              type="text"
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <label className="block mt-2">Enter Mobile No</label>
            <input
              type="number"
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />

            <label className="block mt-2">Enter Land Size (acres)</label>
            <input
              type="number"
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              value={landSize}
              onChange={(e) => setLandSize(e.target.value)}
            />

            <label className="block mt-2">Renting Period</label>
            <div className="flex space-x-2">
              <input
                type="date"
                className="bg-gray-400 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={rentingPeriod.start}
                onChange={(e) => setRentingPeriod({ ...rentingPeriod, start: e.target.value })}
              />
              <input
                type="date"
                className="bg-gray-400 text-black rounded-xl p-2 border-gray-800 border-2 w-full"
                value={rentingPeriod.end}
                onChange={(e) => setRentingPeriod({ ...rentingPeriod, end: e.target.value })}
              />
            </div>

            <label className="block mt-2">Description (Optional)</label>
            <textarea
              className="bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              </Dialog.Close>
              <button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition duration-200">
                Send Request
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default BookingRequestLand;
