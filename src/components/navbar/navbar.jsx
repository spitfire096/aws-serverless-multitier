// src/components/Navbar/Navbar.jsx

import React, { useState } from "react";
import "./navbar.css";
import amazonLogo from "../../assets/amazon_logo.png";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom"; // Import Link for navigation

const Navbar = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = useAuth();

  const signOut = async () => {
    // Remove the user from local session
    await auth.removeUser();

    // Then redirect to Cognito’s logout endpoint
    const clientId = "2rk0abf54j7on6od375mc7nbkd";
    const logoutUri = "https://main.d1ktvyh6vc45ny.amplifyapp.com/";
    const cognitoDomain =
      "https://ap-southeast-2h6ot5bgmn.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  switch (auth.activeNavigator) {
    case "signinSilent":
      return <div>Signing you in...</div>;
    case "signoutRedirect":
      return <div>Signing you out...</div>;
  }

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Oops... {auth.error.message}</div>;
  }

  const toggleResponsiveMenu = () => {
    setIsResponsive(!isResponsive);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    setIsDropdownOpen(false);
    signOut();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <a href="/"><img src={amazonLogo} alt="Company Logo" /></a>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for products..." />
        <button>Search</button>
      </div>

      <ul className={`navbar-links ${isResponsive ? "active" : ""}`}>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/cart">Cart</Link>
        </li>

        {auth.isAuthenticated && (
          <li>
            <Link to="/sell" className="sell-button">
              +
            </Link>{" "}
            {/* Sell button navigates to /sell */}
          </li>
        )}

        <li className="user-menu">
          {auth.isAuthenticated ? (
            <div className="dropdown">
              <button className="dropbtn" onClick={toggleDropdown}>
                Hello, {auth.user?.profile?.name || "User"}!
              </button>
              {isDropdownOpen && (
                <div className="dropdown-content">
                  <Link to="/profile">Profile</Link>
                  <Link to="/sold-items">Sold Items</Link>
                  <button onClick={handleSignOut}>Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => auth.signinRedirect()}>Sign In</button>
          )}
        </li>
      </ul>

      {/* Responsive Menu Toggle (optional) */}
      <button className="navbar-toggle" onClick={toggleResponsiveMenu}>
        ☰
      </button>
    </nav>
  );
};

export default Navbar;
