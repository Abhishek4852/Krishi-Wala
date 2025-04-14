import { useState, useEffect } from "react";
import { FaGlobe, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { X, Menu, Home } from "lucide-react";
export default function Headerpart() {
  // const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // // Theme setup
  // useEffect(() => {
  //   if (darkMode) {
  //     document.documentElement.classList.add("dark");
  //     localStorage.setItem("theme", "dark");
  //   } else {
  //     document.documentElement.classList.remove("dark");
  //     localStorage.setItem("theme", "light");
  //   }
  // }, [darkMode]);

  // Token validation and fetch user data
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
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

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setUserData(data); // set user data if token is valid
      } catch (error) {
        console.error("Token validation failed:", error.message);
        setUserData(null); // in case of error, clear userData
      }
    };

    validateToken();
  }, []);

  return (
    <nav className="bg-gradient-to-br from-green-600 to-green-800 border-b-4 border-green-700 text-green-800 shadow-md p-4 w-full top-0 left-0 z-50 ">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo & Menu */}
        <div className="flex items-center space-x-4">
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <h1 className="font-bold text-white text-4xl sm:text-5xl">🌾 KrishiWala</h1>
        </div>

        {/* Center: Nav links (Desktop) */}
        <div className="hidden md:flex space-x-6 font-semibold text-white ml-5">

          {/* <a href="/" className="hover:text-yellow-600 transition duration-200">Home</a> */}
          {/* <a href="#" className="hover:text-yellow-600 transition duration-200">About Us</a> */}
          {/* <a href="#" className="hover:text-yellow-600 transition duration-200">Services</a>
          <a href="#" className="hover:text-yellow-600 transition duration-200">Contact Us</a> */}
        </div>
          
        {/* Right: Buttons or User Name */}
        <div className="hidden md:flex items-center space-x-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1 text-white hover:text-green-900  hover:bg-green-300 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
        >
          <Home size={20} />
          <span className="font-semibold">Home</span>
        </button>
          {userData ? (
            <>
            <FaUser
                className="text-white text-2xl cursor-pointer hover:text-yellow-500"
                onClick={() => navigate("/profilepage")}
              > </FaUser>
             <a href="/profilepage">   <p className="font-semibold text-white text-lg"> {userData.name}</p>   </a>
             
            </>
          ) : (
            <>
              <button
                className="px-4 py-2 bg-green-800 border border-green-600 text-white font-semibold rounded-full hover:bg-green-200 transition"
                onClick={() => navigate("/Register")}
              >
                Register
              </button>
              <button
                className="px-4 py-2 bg-green-800 border border-green-600 text-white font-semibold rounded-full hover:bg-green-200 transition"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 h-full bg-green-800 w-64 shadow-lg transform ${menuOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:hidden z-50`}>
        <button onClick={() => setMenuOpen(false)} className="text-white text-2xl absolute top-4 right-4">
          <FaTimes />
        </button>
        
        <div className="flex flex-col items-start px-6 py-12 space-y-6 text-white">
          <a href="/" className="hover:text-yellow-300 text-lg">Home</a>
          <a href="#" className="hover:text-yellow-300 text-lg">About Us</a>
          {/* <a href="#" className="hover:text-yellow-300 text-lg">Services</a>
          <a href="#" className="hover:text-yellow-300 text-lg">Contact Us</a> */}

          {userData ? (
            <span className="text-lg font-bold text-yellow-300"> {userData.name}</span>
          ) : (
            <>
              <button
                className="w-full px-4 py-2 bg-white text-white font-bold rounded-full hover:bg-yellow-100"
                onClick={() => {
                  navigate("/Register");
                  setMenuOpen(false);
                }}
              >
                Register
              </button>
              <button
                className="w-full px-4 py-2 bg-white text-white font-bold rounded-full hover:bg-yellow-100"
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
