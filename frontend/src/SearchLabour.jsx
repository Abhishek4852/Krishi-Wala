import React, { useState, useEffect } from "react";
import LabourSideBar from "./LabourSideBar";
import LabourHireRequest from "./LabourHireRequest";
import { useNavigate } from "react-router-dom";

function SearchLabour() {
  const [filters, setFilters] = useState({
    labourType: "",
    experience: "",
    dailyWage: "",
    availability: false,
  });

  const [responsedata, setresponsedata] = useState([]);
  const [labourListings, setLabourListings] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error");
  const [showHirePopup, setShowHirePopup] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);
  const navigate = useNavigate();

  const showAlert = (message, type = "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => setAlertMessage(""), 3000); // hide after 3s
  };

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
        if (!response.ok) {
          showAlert(data.error || "Invalid token. Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Token validation error:", error);
        showAlert("Something went wrong. Try logging in again.");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    verifyToken();
  }, [navigate]);

  useEffect(() => {
    if (Array.isArray(responsedata)) {
      setLabourListings(responsedata);
      console.log("land listing data ", labourListings);
    } else {
      console.error("Invalid responseData format", responsedata);
      setLabourListings([]);
    }
  }, [responsedata]);

  useEffect(() => {
    const sampleLabourData = Array(4)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        name: `Labour ${i + 1}`,
        labourType: "Construction",
        experience: `${i + 1} years`,
        dailyWage: 500 + i * 50,
        availability: i % 2 === 0,
        location: {
          state: "Madhya Pradesh",
          district: "Indore",
          village: `Village ${i + 1}`,
        },
        profilePhoto: "profilephoto.png",
      }));
    setLabourListings(sampleLabourData);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {alertMessage && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div
            className={`p-4 rounded-lg font-medium shadow-lg max-w-sm w-full text-center ${
              alertType === "error"
                ? "bg-red-200 text-red-800 border-l-4 border-red-500"
                : "bg-green-200 text-green-800 border-l-4 border-green-500"
            }`}
          >
            {alertMessage}
          </div>
        </div>
      )}

      <LabourSideBar responsedata={responsedata} setresponsedata={setresponsedata} />

      <div className="flex flex-grow">
        <div className="flex-grow p-6 overflow-y-auto max-h-screen ml-0 md:ml-72">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {labourListings.map((labour, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 text-black border-2 border-green-700 shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full"
              >
                <div className="w-full md:w-1/3 p-2">
                  <img
                    src={`https://krishi-wala.onrender.com${labour.profilePhoto}`}
                    alt="Labour"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <div className="w-full md:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{labour.name}</h3>
                    <p>
                      Type: <span className="font-semibold">{labour.labourType}</span>
                    </p>
                    <p>
                      Experience: <span className="font-semibold">{labour.experience}</span>
                    </p>
                    <p>
                      Wage: <span className="font-semibold">₹{labour.dailyWage}</span>
                    </p>
                    <p>
                      Location:{" "}
                      <span className="font-semibold">
                        {labour.location.village}, {labour.location.district}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelectedLabour(labour);
                        setShowHirePopup(true);
                      }}
                    >
                      Hire Labour
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">Contact</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showHirePopup && selectedLabour && (
        <LabourHireRequest
          labour={selectedLabour}
          open={showHirePopup}
          setOpen={setShowHirePopup}
        />
      )}
    </div>
  );
}

export default SearchLabour;
