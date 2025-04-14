import React from "react";
import { useNavigate } from "react-router-dom";
import ChatSupport from "./ChatSupport";

const cardData = [
  { image: "postland.webp", text: "Post Land", link: "/PostLand" },
  { image: "postland.webp", text: "Search Land", link: "/TakeLandOnRent" },
  { image: "postland.webp", text: "Post Machinery", link: "/MachineRegistration" },
  { image: "postland.webp", text: "Search Machinery", link: "/SearchMachinary" },
  { image: "postland.webp", text: "Labour Registration", link: "/LabourRegistration" },
  { image: "postland.webp", text: "Search Labour", link: "/SearchLabour" },
];

const Mainpart = () => {
  const navigate = useNavigate();

  const handleClick = async (link) => {
    try {
      const token = localStorage.getItem("token");
       
      // console.log("token data => ", token)

      if (!token) {
        alert("You need to log in first!");
        navigate("/login");
        return;
      }

      // Verify token (if necessary)
      const response = await fetch("http://127.0.0.1:8000/token_validation/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({"token":`${token}`})
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message)
        navigate(link);
      } else {
        alert(data.error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6  bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
      <div className="mt-10 bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
      <div className="text-2xl text-black flex flex-wrap w-full justify-evenly mb-10">
  <button
    onClick={() => handleClick("/PostLand")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Land Registration
  </button>

  <button
    onClick={() => handleClick("/TakeLandOnRent")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Search Land
  </button>

  <button
    onClick={() => handleClick("/MachineRegistration")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Machine Registration
  </button>

  <button
    onClick={() => handleClick("/SearchMachinary")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Search Machine
  </button>

  <button
    onClick={() => handleClick("/LabourRegistration")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Labour Registration
  </button>

  <button
    onClick={() => handleClick("/SearchLabour")}
    className="bg-gradient-to-br from-green-100 via-green-50 to-green-200 border-b-4 border-green-700 text-green-900 hover:bg-blue-700 hover:text-black font-semibold py-2 px-4 rounded-full m-2 shadow-md transition-all duration-300 ease-linear"
  >
    Search Labour
  </button>
</div>

<img
  src="imh.png"
  alt="Main Image"
  className="w-full max-w-4xl h-auto object-cover rounded-lg shadow-md mx-auto my-6"
/>

</div>
      {/* First Row (3 Cards) */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
        {cardData.slice(0, 3).map((card, index) => (
          <Card key={index} image={card.image} text={card.text} handleClick={() => handleClick(card.link)} />
        ))}
      </div> */}

      {/* Second Row (3 Cards) */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {cardData.slice(3, 6).map((card, index) => (
          <Card key={index} image={card.image} text={card.text} handleClick={() => handleClick(card.link)} />
        ))}
      </div> */}
      <ChatSupport/>
    </div>
  );
};

const Card = ({ image, text, handleClick }) => {
  return (
    <div className="relative w-[clamp(250px,45vmin,500px)] aspect-[4/3] rounded-2xl overflow-hidden text-black transform-gpu">
      <img
        src={image}
        alt={text}
        className="w-full h-full object-cover transition-transform duration-200 hover:scale-[1.25] hover:-rotate-5"
      />
     
      <div className="absolute bottom-0 left-0 w-full bg-neutral-300 backdrop-blur-md p-4 flex flex-col gap-2 h-[30%] justify-center">
        <button
          className="relative overflow-hidden text-[calc(45vmin*0.065)] text-white px-4 py-2 rounded-lg bg-[#2E3944] transition-all duration-300 ease-in-out group"
          onClick={handleClick} // Now correctly calling the function
        >
          <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-700 translate-x-[-100%] group-hover:translate-x-0 transition-all duration-300 ease-in-out"></span>
          <span className="relative z-10">{text}</span>
        </button>
      </div>
      <div className="absolute bottom-[30%] right-6 aspect-square w-[calc(45vmin*0.15)] bg-white/50 backdrop-blur-md rounded-md flex items-center justify-center transition-transform duration-200 hover:translate-y-[-40%]">
        <svg
          viewBox="0 0 448 512"
          className="w-1/2 text-[#2E3944]"
          fill="currentColor"
        >
          <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
        </svg>
      </div>
    </div>
  );
};

export default Mainpart;
