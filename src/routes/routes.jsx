import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import App from "../App";
import SellItem from "../pages/page-sell-item";
import SoldItems from "../pages/page-sold-items";
import ProductsPage from "../pages/pages-products";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/sold-items" element={<SoldItems />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
