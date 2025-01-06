// App.jsx
import React from 'react'
import Navbar from './components/navbar/navbar'
import ProductListing from './components/products/ProductListing'
import { Routes, Route } from 'react-router-dom'
import SellItem from './pages/page-sell-item'

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProductListing />} />
        <Route path="/sell" element={<SellItem />} />
      </Routes>
    </>
  )
}

export default App
