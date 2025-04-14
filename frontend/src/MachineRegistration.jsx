import React, { useState , useEffect } from "react";
import Headerpart from "./Headerpart";
import { useNavigate } from "react-router-dom";

import SelectMachine from "./SelectMachine";
import SelectTractor from "./SelectTractor";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";
import ChatSupport from "./ChatSupport";


function MachineRegistration() {

   // BankDetails 
   const [bname, setbName] = useState("");
   const [bankName, setBankName] = useState("");
   const [bAccountNo, setbAccountNo] = useState("");
   const [IFSC, setIFSC] = useState("");



  const [ownerName, setOwnerName] = useState("");
  const [Mobileno ,setMobileno] =useState("");
 const navigate = useNavigate()
  const [specification, setSpecification] = useState("");
  const [withTractor, setWithTractor] = useState("No");
  const [tractorCompany, setTractorCompany] = useState("");
  const [tractorModel, setTractorModel] = useState("");
  const [hiringCostAcre, setHiringCostAcre] = useState(0);
  const [hiringCostHour, setHiringCostHour] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [machinePhoto, setMachinePhoto] = useState(null);

  //Selected machine name or purpose
  const [machineName, setMachineName] = useState("");
  const [purpose, setPurpose] = useState("");

  ////Location Handling
     const [selectedState, setSelectedState] = useState("");
      const [selectedDistrict, setSelectedDistrict] = useState("");
      const [selectedVillage, setSelectedVillage] = useState("");

      const [userName, setUserName]=useState("")
      const [UserNumber, setUserNumber] = useState("")
      
        useEffect(() => {
          const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
              alert("Please log in first.");
              navigate("/login");
              return;
            }
      
            try {
              const response = await fetch("https://krishi-wala.onrender.com/token_validation/", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
              });
      
              const data = await response.json();
              console.log(data)
              if (response.ok) {
                setUserName(data.name); // Set name from response
                setUserNumber(data.mobile); // Set number from response

                setOwnerName(userName)
                setMobileno(UserNumber)

              } else {
                alert(data.error || "Invalid token. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
              }
            } catch (error) {
              console.error("Token validation error:", error);
              alert("Something went wrong. Try logging in again.");
              localStorage.removeItem("token");
              navigate("/login");
            }
          };
      
          verifyToken();
        }, [navigate]);
      


      const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter(file => file.type.startsWith("image/"));
      
        if (validImages.length === 0) {
          alert("Please select at least one image file.");
          e.target.value = "";
          return;
        }
        
        setMachinePhoto(validImages);  
      };
  

  const handleSubmit = () => {
    if (isAllFieldEntered()) {
   
      if (isAllFieldValid()) {
       
        const formData = new FormData();
formData.append("ownerName", ownerName);

formData.append("Mobileno", String(Mobileno));
formData.append("selectedState", selectedState);
formData.append("selectedDistrict", selectedDistrict);
formData.append("selectedVillage", selectedVillage);
formData.append("machineName", machineName);
formData.append("purpose", purpose);
formData.append("specification", specification);
formData.append("withTractor", withTractor);
if (withTractor === "Yes") {
    formData.append("tractorCompany", tractorCompany);
    formData.append("tractorModel", tractorModel);
}
formData.append("hiringCostAcre", hiringCostAcre);
formData.append("hiringCostHour", hiringCostHour);
formData.append("quantity", quantity);
formData.append("bname", bname);
formData.append("bankName", bankName);
formData.append("bAccountNo", bAccountNo);
formData.append("IFSC", IFSC);
console.log(formData , "fort")
// Append images properly
if (machinePhoto) {
    [...machinePhoto].forEach((file, index) => {
        formData.append(`machinePhoto`, file); 
    });
}
        // alert(" Data Submitted Successfully", formData);
        console.log(formData);

        async function senddata(){
            
          try{
          const response =  await fetch("https://krishi-wala.onrender.com/machine_registration/",
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
      alert("Please enter all details.");
    }
  };



  function isAllFieldEntered() {
    return ownerName && machineName && purpose && specification && hiringCostAcre && hiringCostHour && quantity &&    Mobileno.trim() &&
    machinePhoto !== null && machinePhoto.length > 0 && selectLoc();

  }
function selectLoc(){
  if(selectedState && selectedDistrict && selectedVillage){
    return true;
  }
  else{
    alert("plese select location")
    return false;
  }
}
  function isAllFieldValid() {
    return isValidName(ownerName) && isValidCost(hiringCostAcre) && isValidCost(hiringCostHour) && isValidQuantity(quantity) && isValidMobile(Mobileno)&& validatebankname() && isvalidaccountno() && isvalidIFSC();
  }

  function isValidName(value) {
    if (/^[A-Za-z\s]+$/.test(value)) {
      return true;
    } else {
      alert("Please enter a valid name.");
      return false;
    }
  }


  function isValidCost(value) {
    if (/^\d+(\.\d{1,2})?$/.test(value)) {
      return true;
    } else {
      alert("Please enter a valid cost.");
      return false;
    }
  }
  function isValidMobile(Mobileno) {
    if (/^[6-9]\d{9}$/.test(String(Mobileno))) {
        return true;
    } else {
        alert("Please enter a valid mobile number (10 digits, starting from 6-9).");
        return false;
    }
}


  
  
  function isValidQuantity(value) {
    if (/^\d+$/.test(value) && parseInt(value) > 0) {
      return true;
    } else {
      alert("Please enter a valid quantity.");
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
  const inputClass =
    "text-black flex flex-col text-base";
    const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";


  return (
    <>
  <Headerpart />
  <ChatSupport/>
  <div className="max-w-6xl mx-auto p-4">
    <div className="bg-green-100 text-black p-6 rounded-2xl border-green-600 border-2 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-green-900">
        Machine Registration Form
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={inputClass}>
          <label>Owner Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setOwnerName(e.target.value)}
            className={placeholder}
            placeholder="Enter Owner's Full Name"
          />
        </div>

        <div className={inputClass}>
          <label>Mobile Number</label>
          <input
            type="number"
            value={UserNumber}
            onChange={(e) => setMobileno(e.target.value)}
            className={placeholder}
            placeholder="Enter Mobile Number"
          />
        </div>
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


     
          
          <SelectMachine
            machineName={machineName}
            setMachineName={setMachineName}
            purpose={purpose}
            setPurpose={setPurpose}
            className={inputClass}
            placeholder={placeholder}
          />
      

        <div className={inputClass}>
          <label>Specification (e.g., Capacity)</label>
          <input
            type="text"
            value={specification}
            onChange={(e) => setSpecification(e.target.value)}
            className={placeholder}
            placeholder="Enter specification details"
          />
        </div>

       
        <div className={inputClass}>
          <label>Hiring Cost Per Acre</label>
          <input
            type="number"
            value={hiringCostAcre}
            onChange={(e) => setHiringCostAcre(e.target.value)}
            className={placeholder}
            placeholder="Enter cost per acre"
          />
        </div>

        <div className={inputClass}>
          <label>Hiring Cost Per Hour</label>
          <input
            type="number"
            value={hiringCostHour}
            onChange={(e) => setHiringCostHour(e.target.value)}
            className={placeholder}
            placeholder="Enter cost per hour"
          />
        </div>

        <div className={inputClass}>
          <label>Quantity of Equipment</label>
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={placeholder}
            placeholder="Enter quantity"
          />
        </div>
        
       

       

        

        <div className={inputClass}>
          <label>
            Upload Machine Photos
            <span className="text-red-500 ml-1">*</span>
            <span className="text-sm text-gray-600 ml-2">
              (Image size should be less than 5MB)
            </span>
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 rounded bg-white text-black"
          />
        </div>
        <div className={inputClass}>
          <label>With Tractor</label>
          <select
            value={withTractor}
            onChange={(e) => setWithTractor(e.target.value)}
            className={`${placeholder} bg-white`}
          >
            <option>No</option>
            <option>Yes</option>
          </select>
          </div>

        {withTractor === "Yes" && (
          <>
            <div className={inputClass}>
              <label>Tractor Company & Model</label>
              <SelectTractor
                brand={tractorCompany}
                setBrand={setTractorCompany}
                tractorModel={tractorModel}
                setTractorModel={setTractorModel}
                className={inputClass}
                placeholder={placeholder}
              />
            </div>

            {tractorModel && (
              <div className={inputClass}>
                <p className="text-green-900 font-medium">
                  Selected Tractor Model: {tractorModel}
                </p>
              </div>
            )}
          </>
        )}
         
         <BankDetails
          name={bname}
          setName={setbName}
          bankName={bankName}
          setBankName={setBankName}
          accountNo={bAccountNo}
          setAccountNo={setbAccountNo}
          IFSC={IFSC}
          setIFSC={setIFSC}
          className={inputClass}
          placeholder={placeholder}
        />



      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition"
        >
          Register Machine
        </button>
      </div>
    </div>
  </div>
</>

  );
}

export default MachineRegistration;
