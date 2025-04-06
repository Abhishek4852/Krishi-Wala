import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import ProfileSidebar from "./ProfileSidebar";

function ProfileUpperNavigationBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {/* Sidebar */}
      <ProfileSidebar
  sidebarOpen={isMobile ? isSidebarOpen : true}
  setSidebarOpen={setIsSidebarOpen}
  isMobile={isMobile}
  user={{
    name: "Geetanshi Jain",
    image: "/geetanshi-profile.jpg"
  }}
/>


      {/* Top Navbar */}
      <nav className="bg-[#2E3944] p-3 fixed w-full top-0 left-0 z-50 shadow-md ml-0 md:ml-0">
        <div className="container mx-auto flex items-center justify-between">
          {/* Left Side */}
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setIsSidebarOpen(true)}>
                <Menu className="text-white" size={28} />
              </button>
            )}
            {!isMobile && (
              <>
                <img src="logo.png" alt="Logo" className="h-8" />
                <span className="text-white font-bold text-lg">Dashboard</span>
              </>
            )}
          </div>

          {/* Right Side - Profile Info */}
          <div className="flex items-center gap-2">
            <img
              src="profile-avatar.jpg"
              alt="User Avatar"
              className="w-9 h-9 rounded-full border-2 border-white"
            />
            <span className="text-white font-medium text-sm sm:text-base">
              Geetanshi Jain
            </span>
          </div>
        </div>
      </nav>
    </>
  );
}

export default ProfileUpperNavigationBar;