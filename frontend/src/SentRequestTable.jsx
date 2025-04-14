import React, { useState } from "react";

const SentRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  // const [pdata, setpdata] = useState("");
  const handleFetchRequests = async () => {
    setLoading(true);
  
      const validateToken = async () => {
        let data2;
        const token = localStorage.getItem("token");
        console.log("Token:", token);
    
        if (!token) {
          alert("No token found");
          return;
        }
    
        try {
          const response = await fetch("http://127.0.0.1:8000/token_validation/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: token,
            }),
          });
    
          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }
    
           data2 = await response.json();
          console.log("Mobile from token validation:", data2.mobile);
          // setpdata(data2)
          // Optional: set the mobile number directly into form
          
    
        } catch (error) {
          console.error("Token validation failed:", error.message);
        }
      
     // Empty dependency array = run only once when component mounts
  
    try {
      const response = await fetch("http://127.0.0.1:8000/sent_request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_mobile: data2.mobile,
        }),
      });

      const data = await response.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.sentDate) - new Date(a.sentDate)
      );

      setRequests(sorted);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  
};
    
validateToken();
};

  const visibleRequests = showAll ? requests : requests.slice(0, 5);

  return (
    <div className="p-4 bg-white text-black">
      <button
        onClick={handleFetchRequests}
        className="px-4 py-2 bg-white text-black underline rounded mb-4"
      >
        {loading ? "Loading..." : "Show Your Sent Requests..."}
      </button>

      {showTable && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-black text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-black px-4 py-2 text-left">S.No.</th>
                <th className="border border-black px-4 py-2 text-left">Request ID</th>
                <th className="border border-black px-4 py-2 text-left">Request Type</th>
                <th className="border border-black px-4 py-2 text-left">Sent Date</th>
                <th className="border border-black px-4 py-2 text-left">Status</th>
                <th className="border border-black px-4 py-2 text-left">Receiver Mobile</th>
                <th className="border border-black px-4 py-2 text-left">Preview</th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.map((req, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border border-black px-4 py-2">{index + 1}</td>
                  <td className="border border-black px-4 py-2">{req.id}</td>
                  <td className="border border-black px-4 py-2">{req.type}</td>
                  <td className="border border-black px-4 py-2">{req.sentDate}</td>
                  <td className="border border-black px-4 py-2">{req.status}</td>
                  <td className="border border-black px-4 py-2">{req.receiver_mobile}</td>
                  <td className="border border-black px-4 py-2">
                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => setSelectedRequest(req)}
                    >
                      Preview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {requests.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {showAll ? "Show Less" : "Show More"}
              </button>
            </div>
          )}
        </div>
      )}

{selectedRequest && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-3xl relative overflow-y-auto max-h-[90vh]">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-black text-2xl font-bold"
        onClick={() => setSelectedRequest(null)}
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4 text-center">
        Request Type: {selectedRequest.type}
      </h2>

      <div className="grid grid-cols-2 gap-6">
        {/* Receiver Info Section */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Receiver Details</h3>
          <p><strong>Mobile No:</strong> {selectedRequest.receiver_mobile}</p>
          <p><strong>Response Date:</strong> {selectedRequest.sender?.response_date || "Pending"}</p>
          <p><strong>Request Price:</strong> ₹{selectedRequest.sender?.request_price || "Not Provided"}</p>
          <p><strong>Receiver Description:</strong> {selectedRequest.sender?.preview_description || "N/A"}</p>
        </div>

        {/* Purpose Section */}
        <div className="bg-gray-100 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Purpose of Request</h3>
          {selectedRequest.type === "labour" && (
            <>
              <p><strong>Work Type:</strong> {selectedRequest.sender?.workType}</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Time:</strong> {selectedRequest.sender?.workTime} {selectedRequest.sender?.workUnit}</p>
              <p><strong>Location:</strong> {selectedRequest.sender?.village}, {selectedRequest.sender?.district}, {selectedRequest.sender?.state}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
          {selectedRequest.type === "land" && (
            <>
              <p><strong>Land Size:</strong> {selectedRequest.sender?.landSize} acre(s)</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
          {selectedRequest.type === "machine" && (
            <>
              <p><strong>Machine Name:</strong> {selectedRequest.sender?.machine_name}</p>
              <p><strong>Hours:</strong> {selectedRequest.sender?.hour} hrs</p>
              <p><strong>Description:</strong> {selectedRequest.sender?.description}</p>
              <p><strong>Location:</strong> {selectedRequest.sender?.village}, {selectedRequest.sender?.district}, {selectedRequest.sender?.state}</p>
              <p><strong>Period:</strong> {selectedRequest.sender?.period_start} to {selectedRequest.sender?.period_end}</p>
            </>
          )}
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          className="px-6 py-2 bg-black text-white rounded"
          onClick={() => setSelectedRequest(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default SentRequestTable;
