// main.jsx
import { AuthProvider } from "react-oidc-context";
import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";

import { BrowserRouter, Routes, Route } from "react-router";
import PageSoldItems from "./pages/page-sell-item";


const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_WsSH8Q4rB",
  client_id: "1jjcmvejg1ip99bi9vq36g1oll",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid profile",
  onSigninCallback: (_user) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

// wrap the application with AuthProvider
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/sell" element={<PageSoldItems />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);