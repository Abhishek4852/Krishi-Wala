import React, { useState } from "react";

const SentRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false); // For "Show More" / "Show Less"

  const handleFetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/sent_request/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender_mobile: "8103817747", // Replace with dynamic sender mobile if needed
        }),
      });

      const data = await response.json();

      // Sort by date descending (recent first)
      const sorted = [...data].sort((a, b) => new Date(b.sentDate) - new Date(a.sentDate));

      setRequests(sorted);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleIgnore = (id) => {
    console.log("Ignored Request ID:", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  // Conditionally sliced requests for 5-recent toggle
  const visibleRequests = showAll ? requests : requests.slice(0, 5);

  return (
    <div className="p-4 bg-white text-black">
      <button
        onClick={handleFetchRequests}
        className="px-4 py-2 bg-white text-black rounded underline mb-4"
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
                <th className="border border-black px-4 py-2 text-left">Ignore</th>
              </tr>
            </thead>
            <tbody>
              {visibleRequests.map((req, index) => (
                <tr key={req.id} className="hover:bg-gray-50">
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
                  <td className="border border-black px-4 py-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleIgnore(req.id)}
                    >
                      Ignore
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
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Request Details</h2>
            {Object.entries(selectedRequest.sender).map(([key, value]) => (
              <p key={key}>
                <strong>{key}:</strong> {value}
              </p>
            ))}
            <button
              className="mt-4 bg-black text-white px-4 py-2 rounded"
              onClick={() => setSelectedRequest(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentRequestTable;
