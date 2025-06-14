// App.jsx
import React from "react";
import { useAuth } from "react-oidc-context";
import Navbar from "./components/navbar/navbar";
import ProductListing from "./components/products/ProductListing";
import "./App.css";
import cognitoAuthConfig from "./config/authConfig";

const App = () => {
  const auth = useAuth();

  const signOut = async () => {
    await auth.removeUser();
    const clientId = cognitoAuthConfig.client_id;
    const logoutUri = window.location.origin + "/";
    const cognitoDomain = cognitoAuthConfig.authority;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  if (auth.isLoading) return <div>Loading...</div>;
  if (auth.error) return <div>Oops... {auth.error.message}</div>;

  return (
    <div>
      <Navbar signOut={signOut} />
      <ProductListing />
    </div>
  );
};

export default App;
