import React, { useState } from "react";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";
import { useNavigate } from "react-router-dom";
import Headerpart from "./Headerpart";

function PostLand() {
  const [landOwner, setLandOwner] = useState("");
  const [mobile, setMobile] = useState("");
  const [rentPrice, setRentPrice] = useState(0);
  const [rentPeriod, setRentPeriod] = useState(0);
  const [irrigationSource, setIrrigationSource] = useState("");
  const [extraFacilities, setExtraFacilities] = useState("");
  const [googleMapLocation, setGoogleMapLocation] = useState("");
  const [landPhotos, setLandPhotos] = useState(null);
  const [LandSize,setLandSize] = useState(0)
  const [TotalRentPrice,setTotalRentPrice] = useState(0)

  // State for address selection
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  // State for bank details
  const [name, setName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [IFSC, setIFSC] = useState("");
 const navigate = useNavigate()
  const handleFileChange = (event) => {
    setLandPhotos(event.target.files);
  };

  const handleSubmit = () => {

    if(isallfieldentered()){
        if(isallfieldvalid()){
          const formData = new FormData();
    
          // Append land details
          formData.append("landOwner", landOwner);
          formData.append("mobile", mobile);
          formData.append("selectedState", selectedState);
          formData.append("selectedDistrict", selectedDistrict);
          formData.append("selectedVillage", selectedVillage);
          formData.append("rentPrice", rentPrice);
          formData.append("TotalRentPrice", TotalRentPrice);
          formData.append("LandSize", LandSize);
          formData.append("rentPeriod", rentPeriod);
          formData.append("irrigationSource", irrigationSource);
          formData.append("extraFacilities", extraFacilities);
          formData.append("googleMapLocation", googleMapLocation);
          formData.append("bankDetails[name]", name);
          formData.append("bankDetails[bankName]", bankName);
          formData.append("bankDetails[accountNo]", accountNo);
          formData.append("bankDetails[IFSC]", IFSC);
      
          // Append images
          if (landPhotos) {
            for (let i = 0; i < landPhotos.length; i++) {
              formData.append("landPhotos", landPhotos[i]); // Append actual file
            }
          }
          
              console.log(formData) /// ensuring form data collected properly 
              // registration data sent to backend django
              async function senddata(){
              
                try{
                const response =  await fetch("http://127.0.0.1:8000/post_land/",
                  {
                    method:"POST",
                    
                    body:formData
                  })
                  
                  if(!response.ok){
                      const error = await response.text();
                    throw new Error(error);
                  }
                const data = await response.json();
                 console.log(data);
                 alert("registered successfully")
                 navigate("/");
  
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
        }
    } else {
        alert("Please Enter all detatails")
    }

    
  }

function isallfieldentered(){
    return (landOwner !== ""  &&  mobile !== "" && rentPrice !== "" && rentPeriod !== "" && irrigationSource !== "" && name !== "" && bankName !== "" && accountNo !== "" && IFSC !== "" && rentPrice > 0 && TotalRentPrice > 0 && LandSize > 0 ) 
}

function isallfieldvalid(){
    return (isAlpha() && validlocation() && isValidMobile() && isrentprice() && irrigationvalid() && validatebankname() && isvalidaccountno() && isvalidIFSC())
}

function isAlpha() {
    if (/^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name) && /^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(landOwner) ) {
      return true;
    } else {
      alert("Please enter a valid name");
      return false;
    }
  }

  function isValidMobile() {
    if (/^[6-9]\d{9}$/.test(mobile) === true) {
      return true;
    } else {
      alert("Please enter a valid mobile number (10 digits, starting from 6-9).");
      return false;
    }
  }
  function validlocation() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      alert("Please select State, District, and Village.");
      return false;
    }
  }
  
  function isrentprice() {
    if (/^\d+(\.\d{1,2})?$/.test(rentPrice) && parseFloat(rentPrice) > 0) {
      return true;
    } else {
      alert("Please enter a valid rent price (a positive number).");
      return false;
    }
  }
  
  function irrigationvalid() {
    if (irrigationSource !== "Select" && irrigationSource !== "") {
      return true;
    } else {
      alert("Please select an irrigation source.");
      return false;
    }
  }
  
  function validatebankname() {
    if (/^[A-Za-z ]+$/.test(bankName)) {
      return true;
    } else {
      alert("Bank name must contain only alphabets and spaces.");
      return false;
    }
  }
  
  function isvalidaccountno() {
    if (/^\d{9,18}$/.test(accountNo)) {
      return true;
    } else {
      alert("Please enter a valid account number (9-18 digits).");
      return false;
    }
  }
  
  function isvalidIFSC() {
    if (/^[A-Za-z0-9]+$/.test(IFSC)) {
        return true;
    } else {
        alert("Please enter a valid IFSC code containing only letters (A-Z, a-z) and numbers.");
        return false;
    }
}


  return (
    <>
   <Headerpart />
<div className="bg-white min-h-screen flex justify-center items-center p-4">
  <div className="bg-gray-800 text-white p-6 mt-20 rounded-2xl w-full max-w-md sm:w-1/3">
    <div className="text-2xl font-bold text-center">Land Registration Form</div>

    <div className="mt-6">
      <label htmlFor="name">Enter Land Owner Name <span className="text-red-500">*</span></label>
      <input
        type="text"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={landOwner}
        onChange={(e) => setLandOwner(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <p>Select Land Location <span className="text-red-500">*</span></p>
      <SelectAddress
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
        selectedVillage={selectedVillage}
        setSelectedVillage={setSelectedVillage}
      />
    </div>

    <div className="mt-4">
      <label>Enter Mobile No. <span className="text-red-500">*</span></label>
      <input
        type="number"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <label>Enter Land Size in Acre <span className="text-red-500">*</span></label>
      <input
        type="number"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={LandSize}
        onChange={(e) => setLandSize(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <label>Enter Total Land Renting Price <span className="text-red-500">*</span></label>
      <input
        type="number"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={TotalRentPrice}
        onChange={(e) => setTotalRentPrice(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <label>Enter Rent Price per Acre <span className="text-red-500">*</span></label>
      <input
        type="number"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={rentPrice}
        onChange={(e) => setRentPrice(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <label>Enter Renting Period in Months <span className="text-red-500">*</span></label>
      <input
        type="number"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={rentPeriod}
        onChange={(e) => setRentPeriod(e.target.value)}
      />
      <span className="text-white text-sm">(ex: 1,2,3...)</span>
    </div>

    <div className="mt-4">
      <label>Select Irrigation Source <span className="text-red-500">*</span></label>
      <select
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={irrigationSource}
        onChange={(e) => setIrrigationSource(e.target.value)}
      >
        <option>Select</option>
        <option>River (if engine for irrigation)</option>
        <option>Canal (direct water supply, no other things needed for irrigation)</option>
        <option>Borewell and Well (if motor is needed for irrigation)</option>
      </select>
    </div>

    <div className="mt-4">
      <label>Extra Facilities Provided by You <span className="text-red-500">*</span></label>
      <input
        type="text"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={extraFacilities}
        onChange={(e) => setExtraFacilities(e.target.value)}
      />
    </div>

    <div className="mt-4">
      <BankDetails
        name={name}
        setName={setName}
        bankName={bankName}
        setBankName={setBankName}
        accountNo={accountNo}
        setAccountNo={setAccountNo}
        IFSC={IFSC}
        setIFSC={setIFSC}
      />
    </div>

    <div className="mt-4">
      <label>Paste Google Map Land Location</label>
      <input
        type="url"
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        value={googleMapLocation}
        onChange={(e) => setGoogleMapLocation(e.target.value)}
      />
      <p className="text-sm">How you find location?</p>
    </div>

    <div className="mt-4">
      <label>Upload Land Photos</label>
      <input
        type="file"
        multiple
        className="text-white bg-gray-800 border p-2 w-full rounded-md"
        onChange={handleFileChange}
      />
    </div>

    <div className="mt-6 flex justify-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md" onClick={handleSubmit}>
        Save Details
      </button>
    </div>
  </div>
</div>


    </>
  );
}

export default PostLand;
