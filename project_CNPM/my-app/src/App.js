import React from "react";
import "./App.scss";
import Header from "./components/Header/Header";
import toast, { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
const App = () => {
  return (
    <>
      <div className="app-container">
        <div className="header-container">
          <Header></Header>
        </div>
        <div className="main-container">
          <div className="sidenav-container"></div>
          <div className="app-content">
            <Outlet></Outlet>
            <Toaster position="top-right" reverseOrder={false} />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
