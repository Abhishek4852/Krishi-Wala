import React, { useState, useEffect } from "react";
import MachineSearchSideBar from "./MachineSearchSideBar";
import BookingRequestMachine from "./BookingRequestMachine";

function SearchMachinary() {
  const [responsedata, setresponsedata] = useState();
  const [filters, setFilters] = useState({
    machinePurpose: "",
    machineName: "",
    withTractor: false,
    tractorBrand: "",
    tractorModel: "",
    hiringCostPerAcre: 0,
    hiringCostPerHour: 0,
  });
  const [machinedata, setmachinedata] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [machineryListings, setMachineryListings] = useState([]);

  useEffect(() => {
    if (Array.isArray(responsedata)) {
      setMachineryListings(responsedata);
      console.log("land listing data ", machineryListings);
    } else {
      console.error("Invalid responseData format", responsedata);
      setMachineryListings([]);
    }
  }, [responsedata]);

  useEffect(() => {
    const sampleMachineryData = Array(2)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        machineName: `Machine ${i + 1}`,
        machinePurpose: "Tilling",
        withTractor: i % 2 === 0,
        tractorBrand: "Mahindra",
        tractorModel: `Model ${i + 1}`,
        hiringCostPerAcre: 500 + i * 50,
        hiringCostPerHour: 200 + i * 20,
        location: {
          state: "Madhya Pradesh",
          district: "Indore",
          village: `Village ${i + 1}`,
        },
        machinePhotos: ["harvaster.png", "harvester2.jpeg"],
      }));
    setMachineryListings(sampleMachineryData);
  }, []);

  return (
    <div className="flex pt-16">
      {/* Sidebar (always visible on large screen) */}
      {/* <div className="hidden md:block fixed md:w-72 h-screen overflow-y-auto bg-white shadow-md z-10"> */}
        <MachineSearchSideBar
          responsedata={responsedata}
          setresponsedata={setresponsedata}
        />
      {/* </div> */}

      {/* Main content */}
      <div className="flex flex-col w-full md:ml-72 min-h-screen">
        {/* Navbar placeholder (assumed to be globally rendered above) */}

        {/* Cards Section */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            {machineryListings.map((machine, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 text-black border-2 border-green-700 shadow-lg rounded-lg flex flex-col md:flex-row overflow-hidden w-full"
              >
                <div className="w-full md:w-1/2 relative overflow-hidden">
                  <div className="flex overflow-x-scroll space-x-2 p-2 scrollbar-hide">
                    {machine.machinePhotos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={`${photo}`}
                        alt="Machine"
                        className="w-full h-56 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{machine.machineName}</h3>
                    <p>
                      Purpose:{" "}
                      <span className="font-semibold">
                        {machine.machinePurpose}
                      </span>
                    </p>
                    <p>
                      Cost per Acre:{" "}
                      <span className="font-semibold">
                        ₹{machine.hiringCostPerAcre}
                      </span>
                    </p>
                    <p>
                      Cost per Hour:{" "}
                      <span className="font-semibold">
                        ₹{machine.hiringCostPerHour}
                      </span>
                    </p>
                    <p>
                      Location:{" "}
                      <span className="font-semibold">
                        {machine.location.village}, {machine.location.district}
                      </span>
                    </p>
                    <p>
                      With Tractor:{" "}
                      <span className="font-semibold">
                        {machine.withTractor ? "Yes" : "No"}
                      </span>
                    </p>
                    {machine.withTractor && (
                      <>
                        <p>
                          Tractor Brand:{" "}
                          <span className="font-semibold">
                            {machine.tractorBrand}
                          </span>
                        </p>
                        <p>
                          Tractor Model:{" "}
                          <span className="font-semibold">
                            {machine.tractorModel}
                          </span>
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between mt-4">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setShowBookingForm(true);
                        setmachinedata(machine);
                      }}
                    >
                      Booking Request
                    </button>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Modal */}
        {showBookingForm && machinedata && (
          <BookingRequestMachine
            open={showBookingForm}
            setOpen={setShowBookingForm}
            machinedata={machinedata}
          />
        )}
      </div>
    </div>
  );
}

export default SearchMachinary;
