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

export default cognitoAuthConfig;
