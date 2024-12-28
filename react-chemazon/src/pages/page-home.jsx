// page-home.jsx
import React from 'react';
import Navbar from '../components/navbar/navbar';
import Sidebar from '../components/sidebar/sidebar';
import ProductListing from '../components/products/ProductListing';
import './page-home.css'; 

const Home = () => {
  return (
    <div>
      <Navbar />
      <div className="page-layout">
        <Sidebar />
        <ProductListing />
      </div>
    </div>
  );
};

export default Home;
