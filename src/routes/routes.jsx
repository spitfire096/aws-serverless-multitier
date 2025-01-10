import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "../App";
import Profile from "../pages/page-profile";
import SellItem from "../pages/page-sell-item";
import SoldItems from "../pages/page-sold-items";
import PurchasesPage from "../pages/page-purchases";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/my-listings" element={<SoldItems />} />
        <Route path="/purchases" element={<PurchasesPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
