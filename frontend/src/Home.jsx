import React from "react";
import Headerpart from "./Headerpart";
import Mainpart from "./Mainpart";
import FooterPart from "./Footerpart"; 

function Home()
{

  return (
  <>
      <Headerpart/>
      <div className='h-1 w-full'>    </div>
      <Mainpart/>
      <div>
        
      </div>
      <FooterPart/>
    </>
  );
};

export default Home;