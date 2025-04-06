import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Headerpart from "./Headerpart";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";

function LabourRegistration() {
  const navigate =useNavigate();

  // BankDetails 
  const [bname, setbName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bAccountNo, setbAccountNo] = useState("");
  const [IFSC, setIFSC] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [workType, setWorkType] = useState("");
  const [otherWork, setOtherWork] = useState("");
  const [price, setPrice] = useState(0);
  const [priceType, setPriceType] = useState("Per Day");
  



// bad me banai hai inke data db me save krna hai
  const [formData1,setFormData1] =useState("");
  const [age, setAge]= useState(0)
  const [gender,setGender]= useState("")
  const [experience,setexperience]= useState(0)



  //Location Handling
   const [selectedState, setSelectedState] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedVillage, setSelectedVillage] = useState("");


  const handleWorkChange = (e) => {
    setWorkType(e.target.value);
    if (e.target.value !== "Other") {
      setOtherWork(""); // Clear field if "Other" is not selected
    }
  };

  const handleOtherWorkChange = (e) => {
    const value = e.target.value;
    if (/^[A-Za-z\s]+$/.test(value) || value === "") {
      setOtherWork(value);
    } else {
      alert("Please enter only letters and spaces.");
    }
  };

  const handleSubmit = () => {
    if (name && mobile && location && (workType !== "Other" || otherWork) && price && age && gender && experience)  {
       
      if(isAllFieldValid()){

        const formData = {

          name,
          mobile,
          selectedState,
          selectedDistrict,
          selectedVillage,
          workType: workType === "Other" ? otherWork : workType,
          price,
          priceType,
          formData1,
          age,
          gender,
          experience,
          bname,
          bankName,
          bAccountNo,
          IFSC
        };

        async function senddata(){
            
          try{
          const response =  await fetch("http://127.0.0.1:8000/labour_registration/",
            {
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify(formData)
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
       
        alert("Data submitted successfully");
        console.log(formData)
        // console.log(formData1)
      }

      
    } else {
      alert("Please fill in all fields.");
    }
  };

 function isAllFieldValid(){
    return (isAlpha() && validlocation() && isValidMobile() && validatebankname() && isvalidaccountno() && isvalidIFSC() && isPrice() && isage() && isexperience() )

 } 
 function isAlpha() {
  if (/^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name) && /^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(bname) ) {
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
function validatebankname() {
    if (/^[A-Za-z ]+$/.test(bankName)) {
      return true;
    } else {
      alert("Bank name must contain only alphabets and spaces.");
      return false;
    }
  }
  
  function isvalidaccountno() {
    if (/^\d{9,18}$/.test(bAccountNo)) {
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

function isPrice() {
  if (/^\d+(\.\d{1,2})?$/.test(price) && parseFloat(price) > 0) {
    return true;
  } else {
    alert("Please enter a valid rent price (a positive number).");
    return false;
  }
}
const handleAvatarChange = (e) => {
  const file = e.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
          setFormData1((prevData) => ({ ...prevData, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
  }
};

function isage(){
  if(age >= 18 && age <= 60)
    return true
  else{
    alert("enter valid age")
    return false;
  }

}
function isexperience(){
if(experience >= 0 && experience <= 40)
  return true;
else{
  alert("enter valid experience")
  return false
}
}
  return (
    <>
    <Headerpart/>
    
    <div className="p-6 bg-[#2E3944] border-gray-400 mt-10 rounded-xl max-w-md mx-auto border border- shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Labour Registration Form</h2>
      <div className="text-center mb-4">
                    
                    <div className="w-24 h-24 mx-auto rounded-full border overflow-hidden flex items-center justify-center bg-gray-700 ">
                        {formData1.avatar ? <img src={formData1.avatar} alt="Avatar" className="w-full h-full object-cover" /> : <span className="text-gray-400">No Image</span>}
                    </div>
                    <label htmlFor="avatar-upload" className="block text-white mb-2">profile picture</label>
                    <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarChange} className="mt-2 text-white" />
                </div>
      <label className="block mt-4">Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">Mobile Number:</label>
      <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4 text-white">Age:</label>
    <input
      type="number"
      value={age}
      onChange={(e) => {
        setAge(e.target.value)
      //  const newAge = e.target.value;
    //   setAge(newAge); 
    // Validate age while updating
      }}
      className="border p-2 w-full text-white bg-[#2E3944]"
    />
     
     <div>

<label className="block mt-4">Gender:</label>

<div className="flex gap-4">
    <label className="flex items-center">
        <input 
            type="radio" 
            value="Male" 
            checked={gender === "Male"} 
            onChange={(e) => setGender(e.target.value)} 
            className="mr-2"
        />
        Male
    </label>

    <label className="flex items-center">
        <input 
            type="radio" 
            value="Female" 
            checked={gender === "Female"} 
            onChange={(e) => setGender(e.target.value)} 
            className="mr-2"
        />
        Female
    </label>
</div>
</div>

      <div className=" mt-5 ">
            
    <span className="">Select Location :</span>
        
        
            <SelectAddress
              selectedState={selectedState}
              setSelectedState={setSelectedState}
              selectedDistrict={selectedDistrict}
              setSelectedDistrict={setSelectedDistrict}
              selectedVillage={selectedVillage}
              setSelectedVillage={setSelectedVillage}
              className="text-white"
            />
           
          </div>


      <label className="block mt-4 bg-[#2E3944]  border-gray-400">Select Work:</label>
      <select value={workType} onChange={handleWorkChange} className="border p-2 w-full bg-[#2E3944]  border-gray-400">
        <option value="">-- Select Work --</option>
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

      {workType === "Other" && (
        <div className="mt-4">
          <label className="block">Specify Other Work:</label>
          <input
            type="text"
            value={otherWork}
            onChange={handleOtherWorkChange}
            className="border p-2 w-full"
            placeholder="Enter work name"
          />
        </div>
      )}
       <label className="block mt-4">How Much Experience(in year) Do you Have ? </label>
      <input type="number" value={experience} onChange={(e) => setexperience(e.target.value)} className="border p-2 w-full" />

      <label className="block mt-4">Enter your wage and select the payment duration.</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-2 w-full" />

      <div className="flex gap-4 mt-2">
        <button className={`p-2 w-1/2 ${priceType === "Per Day" ? "bg-blue-500 text-white" : "bg-gray-600"}`} onClick={() => setPriceType("Per Day")}>
          Per Day
        </button>
        <button className={`p-2 w-1/2 ${priceType === "Per Hour" ? "bg-blue-500 text-white" : "bg-gray-600"}`} onClick={() => setPriceType("Per Hour")}>
          Per Hour
        </button>
      </div>

      {/* <label className="block mt-4">Account Information:</label>
      <input type="text" value={accountInfo} onChange={(e) => setAccountInfo(e.target.value)} className="border p-2 w-full" /> */}

      < BankDetails 
       name={bname} setName={setbName} 
       bankName={bankName} setBankName={setBankName} 
       accountNo={bAccountNo} setAccountNo={setbAccountNo} 
       IFSC={IFSC} setIFSC={setIFSC} 
      />
        


        <div className="mt-6 flex justify-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md" onClick={handleSubmit}>
        Save Details
      </button>
    </div>



      
    </div>
    <div className='h-10 w-full'>    </div>
    </>
  );
}

export default LabourRegistration;