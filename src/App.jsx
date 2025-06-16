// App.jsx
import React from "react";
import { useAuth } from "react-oidc-context";
import Navbar from "./components/navbar/navbar";
import ProductListing from "./components/products/ProductListing";
import "./App.css";
import cognitoAuthConfig from "./config/authConfig";

const App = () => {
  const auth = useAuth();

  const clientId = cognitoAuthConfig.client_id;
  const logoutUri = "https://d84l1y8p4kdic.cloudfront.net"; // Must match your registered sign-out URI
  const cognitoDomain = cognitoAuthConfig.authority; // Replace with your actual domain

  const signOutRedirect = () => {
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Encountering error... {auth.error.message}</div>;

  if (auth.isAuthenticated) {
    return (
      <div>
        <Navbar signOut={signOutRedirect} />
        <ProductListing />
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>
        <button onClick={signOutRedirect}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
    </div>
  );
};

export default App;
