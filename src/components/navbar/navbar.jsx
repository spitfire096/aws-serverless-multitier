import React, { useState } from "react";
import "./navbar.css";
import amazonLogo from "../../assets/amazon_logo.png";
import { useAuth } from "react-oidc-context";

// Intercept the passed signOut method from app.jsx
const Navbar = () => {
  const [isResponsive, setIsResponsive] = useState(false);
  const auth = useAuth();

  const signOut = async () => {
    // Remove the user from local session
    await auth.removeUser();
    
    // Then redirect to Cognito’s logout endpoint
    const clientId = "2rk0abf54j7on6od375mc7nbkd";
    const logoutUri = "https://main.d1ktvyh6vc45ny.amplifyapp.com/";
    const cognitoDomain = "https://ap-southeast-2h6ot5bgmn.auth.ap-southeast-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
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

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={amazonLogo} alt="Company Logo" />
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search for products..." />
        <button>Search</button>
      </div>

      <ul className={`navbar-links ${isResponsive ? "active" : ""}`}>
        <li><a href="#">Products</a></li>
        <li><a href="#">Cart</a></li>
        <li>
          {auth.isAuthenticated ? (
            <button onClick={signOut}>Sign out</button> // change sign in button to sign out
          ) : (
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;