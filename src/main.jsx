// main.jsx
import { AuthProvider} from "react-oidc-context";
import App from "./App";
import ReactDOM from "react-dom/client";
import React from "react";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_H6ot5bgmn",
  client_id: "2rk0abf54j7on6od375mc7nbkd",
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
      <App />
    </AuthProvider>
  </React.StrictMode>
);