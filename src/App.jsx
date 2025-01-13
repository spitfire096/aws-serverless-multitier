// App.jsx
import React from 'react'
import Navbar from './components/navbar/navbar'
import ProductListing from './components/products/ProductListing'

import './App.css'


const App = () => {
  return (
    <div>
      <Navbar />
      <ProductListing />
    </div>
  )
}

export default App
