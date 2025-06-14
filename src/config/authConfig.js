// authConfig.js
import { syncUserInfo } from "../services/apiService";  // Import your new service

const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_4I5lqgViI/.well-known/jwks.json",
  client_id: "us-east-1_4I5lqgViI",
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: "code",
  scope: "email openid profile",
  onSigninCallback: async (_user) => {
    try {
      // Sync user info with your backend
      await syncUserInfo({
        sub: _user.profile.sub,
        email: _user.profile.email,
        name: _user.profile.name,
      });
    } catch (error) {
      console.error('Error syncing user info:', error);
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export default cognitoAuthConfig;
