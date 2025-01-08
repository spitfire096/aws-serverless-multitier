// main.jsx
import { AuthProvider } from "react-oidc-context";
import ReactDOM from "react-dom/client";
import React from "react";

// routes
import AppRoutes from "./routes/routes";

// Auth config
import cognitoAuthConfig from "./config/authConfig";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <AppRoutes />
    </AuthProvider>
  </React.StrictMode>
);
