import React, { useState, useEffect } from "react";
import Headerpart from "./Headerpart";
import { useNavigate } from "react-router-dom";

import SelectMachine from "./SelectMachine";
import SelectTractor from "./SelectTractor";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";
import ChatSupport from "./ChatSupport";

function MachineRegistration() {
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const navigate = useNavigate();

  const showAlert = (message, type = "success") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  // Bank Details
  const [bname, setbName] = useState("");
  const [bankName, setBankName] = useState("");
  const [bAccountNo, setbAccountNo] = useState("");
  const [IFSC, setIFSC] = useState("");

  const [ownerName, setOwnerName] = useState("");
  const [Mobileno, setMobileno] = useState("");
  const [specification, setSpecification] = useState("");
  const [withTractor, setWithTractor] = useState("No");
  const [tractorCompany, setTractorCompany] = useState("");
  const [tractorModel, setTractorModel] = useState("");
  const [hiringCostAcre, setHiringCostAcre] = useState(0);
  const [hiringCostHour, setHiringCostHour] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [machinePhoto, setMachinePhoto] = useState(null);

  const [machineName, setMachineName] = useState("");
  const [purpose, setPurpose] = useState("");

  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedVillage, setSelectedVillage] = useState("");

  const [userName, setUserName] = useState("");
  const [UserNumber, setUserNumber] = useState("");

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (response.ok) {
          setUserName(data.name);
          setUserNumber(data.mobile);
          setOwnerName(data.name);
          setMobileno(data.mobile);
        } else {
          showAlert(data.error || "Invalid token. Please log in again.", "error");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        showAlert("Something went wrong. Try logging in again.", "error");
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
      showAlert("Please select at least one image file.", "error");
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

        if (machinePhoto) {
          machinePhoto.forEach(file => {
            formData.append("machinePhoto", file);
          });
        }

        async function senddata() {
          try {
            const response = await fetch("https://krishi-wala.onrender.com/machine_registration/", {
              method: "POST",
              body: formData,
            });

            if (!response.ok) {
              const error = await response.text();
              throw new Error(error);
            }

            showAlert("Registered successfully", "success");
            navigate("/");
          } catch (error) {
            if (error.name === "TypeError") {
              showAlert("Network Connection failed", "error");
            } else {
              showAlert("Something went wrong", "error");
            }
          }
        }

        senddata();
      }
    } else {
      showAlert("Please enter all details.", "error");
    }
  };

  function isAllFieldEntered() {
    return ownerName && machineName && purpose && specification &&
      hiringCostAcre && hiringCostHour && quantity && Mobileno &&
      machinePhoto && machinePhoto.length > 0 && selectLoc();
  }

  function selectLoc() {
    if (selectedState && selectedDistrict && selectedVillage) {
      return true;
    } else {
      showAlert("Please select location", "error");
      return false;
    }
  }

  function isAllFieldValid() {
    return isValidName(ownerName) && isValidCost(hiringCostAcre) &&
      isValidCost(hiringCostHour) && isValidQuantity(quantity) &&
      isValidMobile(Mobileno) && validatebankname() &&
      isvalidaccountno() && isvalidIFSC();
  }

  function isValidName(value) {
    if (/^[A-Za-z\s]+$/.test(value)) return true;
    showAlert("Please enter a valid name.", "error");
    return false;
  }

  function isValidCost(value) {
    if (/^\d+(\.\d{1,2})?$/.test(value)) return true;
    showAlert("Please enter a valid cost.", "error");
    return false;
  }

  function isValidMobile(mobile) {
    if (/^[6-9]\d{9}$/.test(mobile)) return true;
    showAlert("Please enter a valid mobile number.", "error");
    return false;
  }

  function isValidQuantity(value) {
    if (/^\d+$/.test(value) && parseInt(value) > 0) return true;
    showAlert("Please enter a valid quantity.", "error");
    return false;
  }

  function validatebankname() {
    if (/^[A-Za-z ]+$/.test(bankName)) return true;
    showAlert("Bank name must contain only letters and spaces.", "error");
    return false;
  }

  function isvalidaccountno() {
    if (/^\d{9,18}$/.test(bAccountNo)) return true;
    showAlert("Please enter a valid account number (9-18 digits).", "error");
    return false;
  }

  function isvalidIFSC() {
    if (/^[A-Za-z0-9]+$/.test(IFSC)) return true;
    showAlert("Please enter a valid IFSC code.", "error");
    return false;
  }

  const inputClass =
    "text-black flex flex-col text-base";
    const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";


  return (
    <>
  <Headerpart />
  <ChatSupport/>
  <div className="max-w-6xl  mx-auto p-4">
    <div className="bg-green-100 text-black p-6 rounded-2xl mt-20 border-green-600 border-2 shadow-lg">
      

    {alertMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-sm">
          <div
            className={`p-4 rounded-lg text-center font-medium shadow-lg ${
              alertType === "error"
                ? "bg-red-200 text-red-800 border-l-4 border-red-500"
                : "bg-green-200 text-green-800 border-l-4 border-green-500"
            }`}
          >
            {alertMessage}
          </div>
        </div>
      )}




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
