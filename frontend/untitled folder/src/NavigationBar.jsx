import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function NavigationBar({ isOpen, setIsOpen }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize(); // Run initially
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav className="bg-[#2E3944] shadow-md p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src="logo.png" alt="Logo" className="h-10" />
          {isMobile && (
            <button
              onClick={() => setIsOpen((prev) => !prev)}
              className="bg-[#2E3944] text-white p-2 rounded border border-[#2E3944]"
        
            >
              Apply Filter
            </button>
          )}
        </div>
        <div className="flex justify-end">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-700 text-white px-3 py-1 rounded w-32 sm:w-1/2 md:w-2/3 outline-none border border-white placeholder-white"
          />
        </div>
      </div>
    </nav>
  );
}