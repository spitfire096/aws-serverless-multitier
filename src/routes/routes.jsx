import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "../App";
import Profile from "../pages/page-profile";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
