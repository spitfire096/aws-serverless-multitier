import React from "react";
import "./page-login.css";
import ComponentLogin from "../components/login/login";
import Navbar from "../components/navbar/navbar";

const PageLogin = () => {
  return (
    <div>
        <Navbar />
        <div className="page-login-layout">
            <div className="component-login-container">
                <ComponentLogin />
            </div>
        </div>
    </div>
  );
}

export default PageLogin;