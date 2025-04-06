import { useState, useEffect } from "react";
import { FaGlobe, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Headerpart() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate= useNavigate();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <nav className="bg-[#2E3944] shadow-md p-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left Section: Hamburger Menu + Logo */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img src="logo.png" alt="Logo" className="h-10" />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <a href="http://localhost:5173/" className="text-white text-lg hover:text-yellow-400">
            Home
          </a>
          <a href="#" className="text-white text-lg hover:text-yellow-400">
            About Us
          </a>
          <a href="#" className="text-white text-lg hover:text-yellow-400">
            Services
          </a>
          <a href="#" className="text-white text-lg hover:text-yellow-400">
            Contact Us
          </a>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center space-x-6">
          <div className="flex items-center space-x-2 cursor-pointer">
            <FaGlobe className="text-white text-xl hover:text-yellow-400" />
            <span className="text-white text-xl hover:text-yellow-400">EN/HI</span>
          </div>
          <button className="px-4 py-2 border rounded-md text-white hover:bg-blue-500" onClick={()=> {navigate("/Register")}}>
            Register
          </button>
          <button className="px-4 py-2 border rounded-md text-white hover:bg-blue-500" onClick={()=>{navigate("/login")}}>
            Login
          </button>
          <FaUser className="text-white text-2xl cursor-pointer hover:text-yellow-400" />

          {/* Dark Mode Toggle Button (Switch) */}
          <div
            className={`w-14 h-7 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-all duration-300`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div
              className={`w-6 h-6 bg-white dark:bg-white-400 rounded-full shadow-md transform transition-transform duration-300 ${
                darkMode ? "translate-x-7" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      <div className={`fixed top-0 left-0 h-full bg-[#2E3944] w-64 shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:hidden`}>
        <button onClick={() => setMenuOpen(false)} className="text-white text-2xl absolute top-4 right-4 focus:text-yellow-400 ">
          <FaTimes />
        </button>
        
        <div className="flex flex-col items-start px-6 py-12 space-y-6">
          <a href="#" className="text-white text-lg active:text-yellow-400 focus:text-yellow-400 ">
            Home
          </a>
          <a href="#" className="text-white text-lg active:text-yellow-400 focus:text-yellow-400 ">
            About Us
          </a>
          <a href="#" className="text-white text-lg active:text-yellow-400 focus:text-yellow-400 ">
            Services
          </a>
          <a href="#" className="text-white text-lg active:text-yellow-400 focus:text-yellow-400 ">
            Contact Us
          </a>
          

          <button className="w-full px-4 py-2 border rounded-md text-white active:bg-blue-500 focus:text-yellow-400 " onClick={(()=> {navigate("/Register")})}>
            Register
          </button>

          <button className="w-full px-4 py-2 border rounded-md text-white active:bg-blue-500 focus:text-yellow-400 ">
            Login
          </button>
          <div className="flex items-center space-x-10 mt-4">
  <div className="flex items-center space-x-2 cursor-pointer">
    <FaGlobe className="text-white text-xl active:text-yellow-400 focus:text-yellow-400  "tabIndex="0" />
    <span className="text-white text-xl active:text-yellow-400 focus:text-yellow-400" tabIndex="0">EN/HI</span>
  </div>
  <FaUser className="text-white text-2xl cursor-pointer focus:text-yellow-400  active:text-yellow-400" tabIndex="0" />
</div>


          {/* Dark Mode Toggle Button (Switch) */}
          <div
            className={`w-14 h-7 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 cursor-pointer transition-all duration-300`}
            onClick={() => setDarkMode(!darkMode)}
          >
            <div
              className={`w-6 h-6 bg-white dark:bg-white-400 rounded-full shadow-md transform transition-transform duration-300 ${
                darkMode ? "translate-x-7" : "translate-x-0"
              }`}
            ></div>
          </div>
        </div>
      </div>
    </nav>
  );
}