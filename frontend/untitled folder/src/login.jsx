import React from 'react'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Mediator from './Mediator';
import Headerpart from './Headerpart';

function Login() {
    const [mobile,setmobile] = useState("");
    const [pass,setpass] = useState("");
    const navigate = useNavigate();
    const [token,settoken] = useState();

function check(){
    if(isAllFieldEntered()){
        if(isAllFieldValid()){
            const formdata = {
              fmobile:mobile,
              fpass:pass,
            }

              async function senddata(){
              try {
                const response = await fetch("http://127.0.0.1:8000/login/",{
                  method:"POST",
                  headers:{
                    'Content-Type':"application/json"
                  },
                  body:JSON.stringify(formdata)
                })
                if(!response.ok){
                  const error = await response.text();
                  throw new Error(error)
                }
                const data = await response.json()

                console.log(data)
                alert(data.message)
                alert(data.token)
                settoken(data.token)
                localStorage.setItem("token",data.token)
                navigate("/")
              }
              catch(e){
                if(e.name === "TypeError" )
                  alert("Connection failed")
                else {
                  alert("something went wrong")
                  console.log(e.message)
                }
              }
            }
senddata();
         console.log(formdata)
         
    
        } 
      }
      else {
        alert("Please enter all details");
      }
}
function isAllFieldEntered(){
    return (mobile !== "" && pass !== "") 
 }
 function isAllFieldValid(){
    return (isValidMobile() && isValidPassword() )  //
  }
  function isValidMobile() {
    if (/^[6-9]\d{9}$/.test(mobile) === true) {
      return true;
    } else {
      alert("Please enter a valid mobile number (10 digits, starting from 6-9).");
      return false;
    }
  }

  function isValidPassword() {
    // Check if password length is between 9 and 15
    if (pass.length < 9 || pass.length > 15) {
      alert("Wrong Password");
      return false;
    }
  
    // Check if password contains at least one letter and one number
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&()_+{}\[\]:;<>,.?~\\/-]{9,15}$/;
    
    if (!passwordRegex.test(pass)) {
      alert("Wrong Password");
      return false;
    }
  
    return true;
  }
  

  return (
    <>  
    <Headerpart/>
    <div className='h-10 w-full'>    </div>
    <div className='min-h-0 w-96  mt-50 flex flex-col flex-wrap m-auto bg-[#2E3944]  rounded-xl'>
      <h1 className='self-center text-3xl mt-10 text-white font-bold' >Login</h1>  

        <div className='m-auto text-white mt-8'>
        <span className="text-red-500">*</span>
         <label htmlFor="mobile" className='text-white'> Enter Mobile No.</label>
         <input type="number" className='text-white bg-[#2E3944] border p-2 w-full ' onChange={(e)=>{setmobile(e.target.value)}} />
        </div>
        <br/>
        <div className='m-auto text-black'>
        <span className="text-red-500">*</span>
         <label htmlFor="mobile" className='text-white'> Enter password.</label>
         <input type="text" className='text-white bg-[#2E3944] border p-2 w-full ' onChange={(e)=>{setpass(e.target.value)}} />
        </div>
        <br/>
        <br/>
        <div className='m-auto'>
        <button className='text-white mt-2 w-24 mb-6 m-auto bg-blue-600 py-2 rounded-md' onClick={check}> Login </button>
        </div>
        <div className='ml-6 mr-6 mb-4 bg-[#2E3944]'>
        <button onClick={()=>{navigate("/")}} className= 'bg-[#2E3944] text-white px-4 py-2 rounded' >Create Account ? </button>
       </div>
      
    </div>
    <div className='h-96 w-full'>    </div>
    

   
    </>
    
    
  )
}

export default Login