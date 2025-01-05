import React, { useState } from 'react'
import './navbar.css'
import amazonLogo from '../../assets/amazon_logo.png'

const Navbar = () => {
  const [isResponsive, setIsResponsive] = useState(false)

  const toggleResponsiveMenu = () => {
    setIsResponsive(!isResponsive)
  }

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/"><img src={amazonLogo} alt="Company Logo" /></a>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for products..." />
        <button>Search</button>
      </div>

      <ul className={`navbar-links ${isResponsive ? 'active' : ''}`}>
        <li><a href="#">Products</a></li>
        <li><a href="#">Cart</a></li>
        <li><a href="/login">Login</a></li>
      </ul>

    </nav>
  )
}

export default Navbar
