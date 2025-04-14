import React, { useState, useEffect } from "react";
import ProfileUpperNavigationBar from "./ProfileUpperNavigationBar";
import ProfileSidebar from "./ProfileSideBar";
import SentRequestTable from "./SentRequestTable";
import ReceivedRequestTable from "./ReceivedRequestTable";
import PreviewedRequestTable from "./PreviewedRequestTable";
import ChatSupport from "./ChatSupport";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [userName, setUserName] = useState(""); // Will be set from token data
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

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

        if (response.ok) {
          setUserName(data.name || "User"); // use name from response
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


  return (
    <>
      <ProfileUpperNavigationBar />

      {/* Sidebar */}
      <ProfileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
      />

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 pt-24 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-8">

          {/* Animated Greeting Section */}
          <motion.div
            className="col-span-full   rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.h2
              className="text-3xl font-semibold text-orange-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              👋 Hello, {userName}!
            </motion.h2>

            <motion.p
              className="text-gray-600 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              Welcome back to KrishiWala <span className="text-green-600 font-medium">Smart Farming Dashboard</span>.
            </motion.p>
          </motion.div>

          {/* Card Sections */}
          


{/* <div className="bg-blue-200 shadow-md rounded-2xl p-8 w-full md:w-[350px] h-auto hover:shadow-2xl transition mx-auto mb-6">
  <h3 className="text-2xl font-bold text-gray-800">
    <span className="text-4xl mr-2">👷‍♀</span> Labour Profile
  </h3>
  <p className="text-base text-gray-700 mt-4">Manage your labour profiles</p>
</div>

<div className="bg-pink-200 shadow-md rounded-2xl p-8 w-full md:w-[350px] hover:shadow-2xl transition mx-auto mb-6">
  <h3 className="text-2xl font-bold text-gray-800">
    <span className="text-4xl mr-2">🚜</span> Your Machinery
  </h3>
  <p className="text-base text-gray-700 mt-4">Check and track your equipment</p>
</div>

<div className="bg-green-200 shadow-md rounded-2xl p-8 w-full md:w-[350px] hover:shadow-2xl transition mx-auto mb-6">
  <h3 className="text-2xl font-bold text-gray-800">
    <span className="text-4xl mr-2">🌱</span> Your Land
  </h3>
  <p className="text-base text-gray-700 mt-4">View and update your land records</p>
</div> */}


          {/* Requests Section */}
          <div className="col-span-full bg-white shadow-md rounded-2xl p-6">
            <h3 className="text-2xl font-bold text-green-700 mb-4">📥 Requests Overview</h3>
            <div className="space-y-6">
              <ReceivedRequestTable />
              <SentRequestTable />
              <PreviewedRequestTable />
            </div>
          </div>

          {/* Chat Support - Full Width */}
          <div className="col-span-full">
            <ChatSupport />
          </div>

          {/* Bookings & Transactions */}
         
        </div>
      </div>
    </>
  );
};

export default ProfilePage;