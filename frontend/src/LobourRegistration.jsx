import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Headerpart from "./Headerpart";
import SelectAddress from "./SelectAddress";
import BankDetails from "./BankDetails";
import ChatSupport from "./ChatSupport";

function LabourRegistration() {
  const navigate =useNavigate();


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
            setName(userName)
            setMobile(UserNumber)
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
  

  // BankDetails 
 



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

        async function senddata() {
          try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("mobile", mobile);
            formData.append("selectedState", selectedState);
            formData.append("selectedDistrict", selectedDistrict);
            formData.append("selectedVillage", selectedVillage);
            formData.append("workType", workType === "Other" ? otherWork : workType);
            formData.append("price", price);
            formData.append("priceType", priceType);
            formData.append("age", age);
            formData.append("gender", gender);
            formData.append("experience", experience);
            formData.append("bname", bname);
            formData.append("bankName", bankName);
            formData.append("bAccountNo", bAccountNo);
            formData.append("IFSC", IFSC);
        

            console.log(formData)
            // Append the profile image (Ensure formData1 contains the file object)
            if (formData1.avatar) {
              formData.append("avatar", formData1.avatar);
            }
        
            const response = await fetch("https://krishi-wala.onrender.com/labour_registration/", {
              method: "POST",
              body: formData, // No need for headers, Fetch auto-sets `multipart/form-data`
            });
        
            
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
       
        // alert("Data submitted successfully");
        // console.log(formData)
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
// const handleAvatarChange = (e) => {
//   const file = e.target.files[0];
//   if (file) {
//       setFormData1((prevData) => ({ ...prevData, avatar: file }));
//   }
// };




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

const inputClass =
    "text-black flex flex-col text-base";
    const placeholder = "bg-white text-black rounded-xl p-2 border-gray-800 border-2 w-full";
  return (
    <>
    <Headerpart />
    <ChatSupport/>
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-green-100 text-black p-6 rounded-2xl border-green-600 border-2 shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-900 dark:text-green-700">
          Labour Registration Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold">Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter Name"
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Mobile Number</label>
            <input
              type="text"
              value={UserNumber}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter Mobile Number"
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Work Type</label>
            <select
              value={workType}
              onChange={handleWorkChange}
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            >
              <option>Select Work Type</option>
              <option>Electrician</option>
              <option>Plumber</option>
              <option>Painter</option>
              <option>Labour</option>
              <option>Other</option>
            </select>
          </div>

          {workType === "Other" && (
            <div className="flex flex-col">
              <label className="font-semibold">Other Work</label>
              <input
                type="text"
                value={otherWork}
                onChange={handleOtherWorkChange}
                placeholder="Specify other work"
                className="bg-white p-2 border-2 border-gray-800 rounded-xl"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="font-semibold">Enter Wage</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter Price"
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Select Wage scale</label>
            <select
              value={priceType}
              onChange={(e) => setPriceType(e.target.value)}
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            >
              <option>Per Day</option>
              <option>Per Hour</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Age</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter Age"
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            >
              <option>Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Experience (in years)</label>
            <input
              type="number"
              value={experience}
              onChange={(e) => setexperience(e.target.value)}
              placeholder="Enter Experience"
              className="bg-white p-2 border-2 border-gray-800 rounded-xl"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold">Upload Profile Photo</label>
            <input
              type="file"
              onChange={(e) => setFormData1({ avatar: e.target.files[0] })}
              className="bg-white text-black p-2 rounded-xl border-gray-800 border-2"
            />
          </div>

          {/* Location Component */}
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

          {/* Bank Details */}
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

export default LabourRegistration;