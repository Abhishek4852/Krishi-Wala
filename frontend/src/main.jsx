// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import { BrowserRouter } from "react-router-dom";
// import Login from './login.jsx'
// import Register from './Register.jsx'
import App from "./App";
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
