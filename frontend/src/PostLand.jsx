import React, { useState, useEffect } from "react";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";
import { useNavigate } from "react-router-dom";
import Headerpart from "./Headerpart";
import ChatSupport from "./ChatSupport";

function PostLand() {
  const [landOwner, setLandOwner] = useState("");
  const [mobile, setMobile] = useState("");
  const [rentPrice, setRentPrice] = useState("");
  const [rentPeriod, setRentPeriod] = useState("");
  const [irrigationSource, setIrrigationSource] = useState("");
  const [extraFacilities, setExtraFacilities] = useState("");
  const [googleMapLocation, setGoogleMapLocation] = useState("");
  const [landPhotos, setLandPhotos] = useState(null);
  const [LandSize,setLandSize] = useState("")
  const [TotalRentPrice,setTotalRentPrice] = useState("")

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

  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"
  
  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 5000); // Clear after 5 sec
  };



const [userName, setUserName]=useState("")
const [UserNumber, setUserNumber] = useState("")

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("Please log in first.", "error");
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
          setUserName(data.name);
setUserNumber(data.mobile);
setLandOwner(data.name);
setMobile(data.mobile);

        } else {
          showAlert(data.error || "Invalid token. Please log in again.","error");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        showAlert("Something went wrong. Try logging in again.","error");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);


  const [addressStyles, setAddressStyles] = useState({
    districtClass: "",
    villageClass: ""
  });

  useEffect(() => {
    // Rule 1
    if (selectedState && selectedDistrict == "" && selectedVillage == "") {
      setAddressStyles({
        districtClass: "text-red-500",
        villageClass: ""
      });
    }
    // Rule 2
    else if (
      selectedState && selectedDistrict &&
      selectedDistrict !== "" &&
      selectedVillage === ""
    ) {
      setAddressStyles({
        districtClass: "",
        villageClass: "text-red-500"
      });
    }
    // Rule 3
    else if (
      selectedState && selectedDistrict !== "" && selectedVillage !== ""
    ) {
      setAddressStyles({
        districtClass: "",
        villageClass: ""
      });
    } else {
      // Default fallback (optional)
      setAddressStyles({
        districtClass: "",
        villageClass: ""
      });
    }
  }, [selectedState, selectedDistrict, selectedVillage]);



  const handleSubmit = () => {

    if (!isallfieldentered()) {
      return; // Stop here if any field is missing, alert is already shown
    }
  
    if (!isallfieldvalid()) {
      return; // Stop if validation fails, alert is already shown
    }
  


    // if(isallfieldentered()){
    //     if(isallfieldvalid()){
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
          
              console.log("my data " ,formData) /// ensuring form data collected properly 
              // registration data sent to backend django
              async function senddata() {
                try {
                  const response = await fetch("https://krishi-wala.onrender.com/post_land/", {
                    method: "POST",
                    body: formData,
                  });
              
                  const data = await response.json();
              
                  if (!response.ok) {
                    // Custom error message from backend
                    const errorMessage = data?.error?.message || "Something went wrong";
                    throw new Error(errorMessage);
                  }
              
                  console.log("data received", data);
              
                  // Proper check for success message
                 
                  
                    showAlert(data.message || "Registered successfully", 'success');
                    setTimeout(() => navigate("/"), 1500);
                    
                // Redirect after showing success alert
                 
              
                } catch (error) {
                  if (error.name === "TypeError") {
                    showAlert("Network Connection failed", "error");
                    console.log("Network Connection failed ", error.message);
                  } else {
                    showAlert(error.message || "Something went wrong", "error");
                    console.log("Other error: ", error.message);
                  }
                }
              }
              
              console.log("other error ");
            senddata();
            console.log("ERR 2 : other error ");

    //     }
    // } else {
    //   console.log("ente all field")
    //   showAlert("Please Enter all detatails","error")
    // }

    
  }
  function isallfieldentered() {
    if (!landOwner || landOwner.trim() === "") {
      showAlert("Please enter the Land Owner's name.", "error");
      return false;
    }
  
    if (!mobile || mobile.trim() === "") {
      showAlert("Please enter the Mobile Number.", "error");
      return false;
    }
  
    if (!rentPrice || rentPrice <= 0) {
      showAlert("Please enter a valid Rent Price.", "error");
      return false;
    }
  
    if (!rentPeriod || rentPeriod.trim() === "") {
      showAlert("Please select the Rent Period.", "error");
      return false;
    }
  
    if (!irrigationSource || irrigationSource.trim() === "") {
      showAlert("Please enter the Irrigation Source.", "error");
      return false;
    }
  
    if (!name || name.trim() === "") {
      showAlert("Please enter the Account Holder's Name.", "error");
      return false;
    }
  
    if (!bankName || bankName.trim() === "") {
      showAlert("Please enter the Bank Name.", "error");
      return false;
    }
  
    if (!accountNo || accountNo.trim() === "") {
      showAlert("Please enter the Account Number.", "error");
      return false;
    }
  
    if (!IFSC || IFSC.trim() === "") {
      showAlert("Please enter the IFSC Code.", "error");
      return false;
    }
  
    if (!TotalRentPrice || TotalRentPrice <= 0) {
      showAlert("Total Rent Price must be greater than 0.", "error");
      return false;
    }
  
    if (!LandSize || LandSize <= 0) {
      showAlert("Land Size must be greater than 0.", "error");
      return false;
    }
  
    // All fields are valid
    return true;
  }
  
// function isallfieldentered(){
//   console.log(landOwner)
//   console.log(mobile)
//   console.log(rentPrice)
//   console.log(rentPeriod)
//   console.log(irrigationSource)
//   console.log(name)
//   console.log(bankName)
//     return (landOwner !== ""  &&  mobile !== "" && rentPrice !== "" && rentPeriod !== "" && irrigationSource !== "" && name !== "" && bankName !== "" && accountNo !== "" && IFSC !== "" && rentPrice && TotalRentPrice > 0 && LandSize > 0 ) 
// }

// function isallfieldvalid(){
//     return (isAlpha() && validlocation() && isValidMobile() && isrentprice() && irrigationvalid() && validatebankname() && isvalidaccountno() && isvalidIFSC())
// }
function isallfieldvalid(){
  return (isAlpha() && isValidMobile() && isrentprice() && irrigationvalid() && validatebankname() && isvalidaccountno() && isvalidIFSC())
}
function isAlpha() {
  const trimmedName = name.trim();

  // This regex allows 1 to 4 words, each containing only letters
  const regex = /^[A-Za-z]+(?: [A-Za-z]+){0,3}$/;

  if (regex.test(trimmedName)) {
    return true;
  } else {
    showAlert("Please enter a valid Account holder name", "error");
    return false;
  }
}

  function isValidMobile() {
    if (/^[6-9]\d{9}$/.test(mobile) === true) {
      return true;
    } else {
      showAlert("Please enter a valid mobile number (10 digits, starting from 6-9).","error");
      return false;
    }
  }
  function validlocation() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      showAlert("Please select State, District, and Village.","error");
      return false;
    }
  }
  
  function isrentprice() {
    if (/^\d+(\.\d{1,2})?$/.test(rentPrice) && parseFloat(rentPrice) > 0) {
      return true;
    } else {
      showAlert("Please enter a valid rent price (a positive number).","error");
      return false;
    }
  }
  
  function irrigationvalid() {
    if (irrigationSource !== "Select" && irrigationSource !== "") {
      return true;
    } else {
      showAlert("Please select an irrigation source.","error");
      return false;
    }
  }
  
  function validatebankname() {
    if (/^[A-Za-z ]+$/.test(bankName)) {
      return true;
    } else {
      showAlert("Bank name must contain only alphabets and spaces.","error");
      return false;
    }
  }
  
  function isvalidaccountno() {
    if (/^\d{9,18}$/.test(accountNo)) {
      return true;
    } else {
      showAlert("Please enter a valid account number (9-18 digits).","error");
      return false;
    }
  }
  
  function isvalidIFSC() {
    if (/^[A-Za-z0-9]+$/.test(IFSC)) {
        return true;
    } else {
      showAlert("Please enter a valid IFSC code containing only letters (A-Z, a-z) and numbers.","error");
        return false;
    }
}


  const inputClass =
    "text-black flex flex-col text-base";
    const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";

  return (
    <>
    <Headerpart />
    

    {/* <ChatSupport/> */}
    <div className="max-w-6xl  mx-auto p-4">
      <div className="bg-green-100 text-black p-6 rounded-2xl mt-20 border-green-600 border-2 shadow-lg">
      {alertMessage && (
  <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
    <div className={`p-4 rounded-lg font-medium shadow-lg max-w-sm w-full text-center
      ${alertType === "error" 
        ? "bg-red-200 text-red-800 border-l-4 border-red-500" 
        : "bg-green-200 text-green-800 border-l-4 border-green-500"
      }`}>
      {alertMessage}
    </div>
  </div>
)}

        <h2 className="text-3xl font-bold mb-6 text-center text-green-900 dark:text-green-700">
          Land Registration Form
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold">Land Owner Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setLandOwner(e.target.value)}
              placeholder="Enter Land Owner Name"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Mobile Number</label>
            <input
              type="text"
              value={UserNumber}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
              className={placeholder}
            />
          </div>
  
         
  
          <div className="flex flex-col">
            <label className="font-semibold">Land Size (in acres)</label>
            <input
              type="number"
              value={LandSize}
              onChange={(e) => setLandSize(e.target.value)}
              placeholder="Enter Land Size (in acres)"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Select Irrigation Source</label>
            <select
              className={placeholder}
              value={irrigationSource}
              onChange={(e) => setIrrigationSource(e.target.value)}
            >
              <option>Select Irrigation Source</option>
              <option>River (if engine for irrigation)</option>
              <option>Canal (direct water supply, no other things needed for irrigation)</option>
              <option>Borewell and Well (if motor is needed for irrigation)</option>
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Rent Price (per month)</label>
            <input
              type="number"
              value={rentPrice}
              onChange={(e) => setRentPrice(e.target.value)}
              placeholder="Enter Rent Price (per month)"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Total Rent Price</label>
            <input
              type="number"
              value={TotalRentPrice}
              onChange={(e) => setTotalRentPrice(e.target.value)}
              placeholder="Enter Total Rent Price"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Rent Period (in months)</label>
            <input
              type="number"
              value={rentPeriod}
              onChange={(e) => setRentPeriod(e.target.value)}
              placeholder="Enter Rent Period (in months)"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Extra Facilities (if any)</label>
            <input
              type="text"
              value={extraFacilities}
              onChange={(e) => setExtraFacilities(e.target.value)}
              placeholder="Extra Facilities (if any)"
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Google Map Location</label>
            <input
              type="text"
              value={googleMapLocation}
              onChange={(e) => setGoogleMapLocation(e.target.value)}
              placeholder="Paste google map location link here..."
              className={placeholder}
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-semibold">Upload Land Photos</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="bg-white text-black p-2 rounded-xl border-gray-800 border-2"
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
            districtClass={addressStyles.districtClass}
            villageClass={addressStyles.villageClass}
          />
  
          {/* You can continue using the same wrapping for the BankDetails section */}
          <BankDetails
              name={name}
              setName={setName}
              bankName={bankName}
              setBankName={setBankName}
              accountNo={accountNo}
              setAccountNo={setAccountNo}
              IFSC={IFSC}
              setIFSC={setIFSC}
              className={inputClass}
              placeholder={placeholder}
            />
        </div>
  
        <div className="text-center mt-6">
          <button
            className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800 transition duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </>
  
  );
}

export default PostLand;
