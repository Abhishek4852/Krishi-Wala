import { Home, MessageSquare, LogOut } from "lucide-react";

function ProfileSidebar({ sidebarOpen, setSidebarOpen, isMobile, user }) {
  return (
    <>
      {/* Overlay for Mobile */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          isMobile
            ? `fixed top-0 left-0 h-full w-64 bg-gray-900 text-white mt-10 p-6 shadow-lg transform transition-transform duration-300 z-50 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`
            : `fixed left-0 h-full w-64 bg-gray-900 text-white p-6 shadow-lg z-40 mt-14 ${
                sidebarOpen ? "" : "hidden"
              }`
        }`}
      >
        {/* Close button only on mobile */}
        {isMobile && (
          <button
            className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-md"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        )}

        {/* Profile Section */}
        <div className="flex flex-col items-center gap-3 mt-8 border-b border-gray-600 pb-4">
          <img
            src={user?.image || "default-avatar.jpg"}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border-2 border-white object-cover"
          />
          <span className="text-lg font-semibold">
            {user?.name || "Guest User"}
          </span>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex flex-col gap-6">
          <a href="#" className="flex items-center gap-3 hover:text-gray-300">
            <Home size={24} />
            <span>Home</span>
          </a>

          <a href="#" className="flex items-center gap-3 hover:text-gray-300">
            <MessageSquare size={24} />
            <span>Chat Support</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-3 text-red-500 hover:text-red-400"
          >
            <LogOut size={24} />
            <span>Logout</span>
          </a>
        </div>
      </div>
    </>
  );
}

export default ProfileSidebar;