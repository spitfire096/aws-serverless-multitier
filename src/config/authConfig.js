// authConfig.js
import { syncUserInfo } from "../services/apiService";  // Import your new service

const cognitoAuthConfig = {
  UserPoolId: "us-east-1_4I5lqgViI",
  ClientId: "Y33suk9pe7clu7sjvcdilfl84ft", // Replace with your App Client ID
  AppWebDomain: "us-east-14i5lqgvii.auth.us-east-1.amazoncognito.com", // Replace with your Cognito domain
  RedirectUriSignIn: import.meta.env.VITE_REDIRECT_URI,
  RedirectUriSignOut: import.meta.env.VITE_REDIRECT_URI,
  TokenScopesArray: ["openid", "email", "profile"],
  AdvancedSecurityDataCollectionFlag: false,
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
