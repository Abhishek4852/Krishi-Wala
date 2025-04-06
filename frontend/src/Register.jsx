import React from 'react'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import Headerpart from './Headerpart';



function Register() {
    const [name , setname]= useState("");
    const [mobile , setmobile]= useState("");
    const [email , setemail]= useState("");
    const [pass , setpass]= useState("");
    const [cnf_pass , setcnf_pass]= useState("");
    const navigate = useNavigate();
function check(){
//  
  if(isAllFieldEntered()){
    if(isAllFieldValid()){
        const formdata = {
          fname:name,
          fmobile:mobile,
          femail:email,
          fpass:pass,
        }
        console.log(formdata) /// ensuring form data collected properly 
            // registration data sent to backend django
            async function senddata(){
            
              try{
              const response =  await fetch("http://127.0.0.1:8000/",
                {
                  method:"POST",
                  headers:{
                    "Content-Type":"application/json"
                  },
                  body:JSON.stringify(formdata)
                })
                
                if(!response.ok){
                    const error = await response.text();
                  throw new Error(error);
                }
              const data = await response.json();
               console.log(data);
               alert("registered successfully")
               navigate("/Login");

              }
              catch(error){
                if(error.name === "TypeError"){
                  alert("Network Connection failed")
                console.log("Network Connection failed ",error.message);
                }else{ 
                  alert("Something went wrong")
                 console.log("other error ",error.message);
              }}
              
                 
            }
          
          senddata();
    
     
   


    } 
  }
  else {
    alert("Please enter all details");
  }
}   

function isAllFieldValid(){
  if(isAlpha() && isValidMobile() && isValidEmail() && isValidPassword() && matchpass()){
    return true;
  }
  else{
   return false;
  }
}

// Function for checking name
function isAlpha() {
  if (/^[A-Za-z]+( [A-Za-z]+){0,3}$/.test(name)) {
    return true;
  } else {
    alert("Please enter a valid name (only alphabets, with at most 3 spaces).");
    return false;
  }
}

// Function for checking mobile number
function isValidMobile() {
  if (/^[6-9]\d{9}$/.test(mobile) === true) {
    return true;
  } else {
    alert("Please enter a valid mobile number (10 digits, starting from 6-9).");
    return false;
  }
}

// Function for email validation
function isValidEmail() {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(email) === true) {
    return true;
  } else {
    alert("Please enter a valid email address.");
    return false;
  }
}

// Function for password validation
function isValidPassword() {
  // Check if password length is between 9 and 15
  if (pass.length < 9 || pass.length > 15) {
    alert("Password must be greater than 8 and less than 16 characters.");
    return false;
  }

  // Check if password contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]*$/;
  if (!passwordRegex.test(pass)) {
    alert("Please enter a valid password containing at least one letter and one number. Special characters are allowed.");
    return false;
  }

  return true;
}

function matchpass(){
  if (pass == cnf_pass){
    return true;
  }
  else{
    alert("please enter same password")
    return false;
  }
}

// for checking isAllfield entered or not
function isAllFieldEntered(){
   return ( name !== "" && mobile !== "" && email !== "" && pass !== "" && cnf_pass !== "") 
}



  return (
    <>  
    <Headerpart/>
    <div className="m-auto h-full w-400px  flex flex-wrap flex-col border-solid
     border-black   text-white" >


    
<div className="flex justify-center flex-nowrap text-white *:">    

<img src="/wefwdslogo.png" alt="Krishi Wala Logo" class="w-80 h-20 m-auto flex-shrink-0" />
</div>

        <br/>
    <div className=" min-h-3/4  w-96  m-auto flex flex-wrap flex-col  rounded-xl bg-[#2E3944]">

   
        <div className="text-white m-auto text-4xl font-bold mt-6 "> Register
        </div>
        <br/>
         <div className='ml-6 mr-6'>
         <span className="text-red-500">*</span>
            <label for="name" className="text-white" >Enter Full Name</label> <br/>
            <input type="text" id="name" name="name" class="text-white bg-[#2E3944] border p-2 w-full" onChange={(e)=>{setname(e.target.value)}} required ></input>
         </div>
         <br/>
         <div className='ml-6 mr-6'>
         <span className="text-red-500">*</span>
         <label for="mobile" className="text-white">Mobile No.</label> <br/>
        <input type="text" id="mobile" name="mobile" className="text-white bg-[#2E3944] border p-2 w-full" onChange={(e)=>{setmobile(e.target.value)}}></input>
         </div>
         <br/>
         <div className='ml-6 mr-6'>
         <span className="text-red-500">*</span>
            <label for="emain" className="text-white">Enter Email ID</label> <br/>
            <input type="text" id="email" name="email" className="text-white bg-[#2E3944] border p-2 w-full"onChange={(e)=>{setemail(e.target.value)}}></input>
         </div>
         <br/>
         <div className='ml-6 mr-6'>
         <span className="text-red-500">*</span>
         <label for="password" className="text-white">Password</label>   <br/> 
        <input type="password" id="password" name="password" className="text-white bg-[#2E3944] border p-2 w-full"onChange={(e)=>{setpass(e.target.value)}}></input>
         </div>
         <br/>
         <div className='ml-6 mr-6'>
         <span className="text-red-500">*</span>
         <label for="cnf_password" className="text-white">Confirm Password</label> <br/>
        <input type="password" id="cnf_password" name="cnf_password" className="text-white bg-[#2E3944] border p-2 w-full" onChange={(e)=>{setcnf_pass(e.target.value)}}></input>
         </div>
         <br/>
        <div className='ml-6 mr-6 flex justify-center'>
        <button type='submit' className="text-white mt-2 w-1/2 mb-6 bg-blue-600 py-2 rounded-md" onClick={check}>Register</button>      
       </div>
       
        <button onClick={()=>{navigate("/Login")}} className= 'bg-[#2e3944] mb-6 text-white px-4 py-2 rounded ' >Already Registered ?</button>
   
     
    </div>
    </div>
    <div className='h-40 w-full'>    </div>
    </>
  )
}

export default Register
