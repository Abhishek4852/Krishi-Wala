import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerpart from './Headerpart';
import { FaGoogle, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { MdLockOutline, MdPersonOutline } from 'react-icons/md';

function Login() {
  const [mobile, setMobile] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function isAllFieldEntered() {
    return mobile !== "" && pass !== "";
  }

  function isAllFieldValid() {
    return true;
  }

  async function check() {
    if (isAllFieldEntered()) {
      if (isAllFieldValid()) {
        const formdata = {
          fmobile: mobile,
          fpass: pass,
        };

        try {
          const response = await fetch("https://krishi-wala.onrender.com/login/", {
            method: "POST",
            headers: {
              'Content-Type': "application/json"
            },
            body: JSON.stringify(formdata)
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
          }

          const data = await response.json();
          alert(data.message);
          localStorage.setItem("token", data.token);
          navigate("/");
        } catch (e) {
          alert(e.name === "TypeError" ? "Connection failed" : "Something went wrong");
          console.error(e);
        }
      }
    } else {
      alert("Please enter all details");
    }
  }

  //.........................
  useEffect(() => {
    const inputs = document.querySelectorAll('input');

    inputs.forEach((input) => {
      setTimeout(() => {
        input.style.backgroundColor = 'white';
        input.style.color = 'black';
        input.style.boxShadow = '0 0 0 1000px white inset';
        input.style.webkitTextFillColor = 'black';
      }, 100);
    });
  }, []);
  

  return (
    <>
     
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200   text-green-700  px-4   ">
        <form className="w-full max-w-4xl bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-2xl">
          {/* Left Section */}
          <div className="w-full md:w-1/2 border-green-700 border-4 bg-green-700 text-white flex flex-col items-center justify-center p-8 md:p-10 text-center ">
  <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center justify-center gap-2">
    <span className="text-4xl">🌾</span> KrishiWala
  </h2>
</div>


          {/* Right Section */}
          <div className="w-full md:w-1/2   border-green-700 border-0 p-8 md:p-10">

            <h1 className="text-2xl md:text-3xl font-bold text-center  mb-6 ">Login</h1>
            
<h1 className= "text-left ml-5 font-bold">  User Name </h1>
            <div className="relative mb-4 border-2 rounded-3xl  border-green-700">
            
            <MdPersonOutline className="absolute right-4 top-3.5 text-xl" />
            <input
  type="number"
  placeholder="Enter your mobile number "
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  className="w-full py-3  autofill:bg-white text-center rounded-full px-5 pr-14  text-base appearance-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
/>

              
            </div>
            <h1 className= "text-left ml-5 font-bold">  Password </h1>
            <div className="relative mb-4 border-2 rounded-full  border-green-700">
          
            <input
  type="password"
  placeholder="Password"
  value={pass}
  onChange={(e) => setPass(e.target.value)}
  className="w-full bg-red-100 autofill:bg-white
py-3 text-center rounded-full px-5 pr-14  text-base  text-black"
/>

              <MdLockOutline className="absolute right-4 top-3.5  text-xl" />
            </div>
          
            <button
              type="button"
              onClick={check}
              className="bg-green-700 hover:bg-green-800 transition duration-300 w-full h-12 text-white rounded-full  font-bold  mb-4"
            >
              Login
            </button>
           
            <p className="text-sm text-center mb-4 text-gray-800 ">
  Don't have an account?{' '}
  <span
    onClick={() => navigate("/register")}
    className="font-semibold  text-green-800 font-boldunderline cursor-pointer"
  >
    Register
  </span>
</p>    
          </div>
        </form>
      </div>
    </>
  );
}

export default Login;