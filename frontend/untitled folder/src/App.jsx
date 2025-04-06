import { Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./login";
import SelectAddress from "./SelectAddress";
import PostLand from "./PostLand";
import BankDetails from "./BankDetails";
import Headerpart from "./Headerpart";
import Sidebar from "./Sidebar";



import TakeLandOnRent from "./TakeLandOnRent";
import TakeLandOnRentHeader from "./TakeLandOnRentHeader";
import Home from "./Home";
import LabourRegistration from "./LobourRegistration";
import MachineRegistration from "./MachineRegistration";
import SearchMachinary from "./SearchMachinary";
import SearchLabour from "./SearchLabour";



function App() {
  return (
    <Routes>
      <Route path="/" element= {<Home />} />
      <Route path="/Register" element={<Register />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/SelectAddress" element= {<SelectAddress />} />
      <Route path="/PostLand" element= {<PostLand />} />
      <Route path="/BankDetails" element= {<BankDetails />} />
      <Route path="/Headerpart" element= {<Headerpart />} />
      <Route path="/Sidebar" element= {<Sidebar />} />
      <Route path="/TakeLandOnRent" element= {<TakeLandOnRent />} />
     
      <Route path="/TakeLandOnRentHeader" element= {<TakeLandOnRentHeader />} />
      <Route path="/LabourRegistration" element= {<LabourRegistration />} />
      <Route path="/MachineRegistration" element= {<MachineRegistration />} />
      <Route path="/SearchMachinary" element= {<SearchMachinary />} />
      <Route path="/SearchLabour" element= {<SearchLabour />} />
     
    </Routes>
  );
}

export default App;