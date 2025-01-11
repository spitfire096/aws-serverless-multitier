// src/services/apiService.jsx
const BASE_URL = "https://n0ahn6cxe9.execute-api.ap-southeast-2.amazonaws.com/prod";

// --------------------  USER APIS -------------------- //
export const syncUserInfo = async (userInfo) => {
  const response = await fetch(`${BASE_URL}/syncUser`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo),
  });
  if (!response.ok) throw new Error("Sync failed");
  return response.json();
};

export const fetchUserProfile = async (userSub) => {
  const response = await fetch(`${BASE_URL}/profile?sub=${userSub}`);
  if (!response.ok) throw new Error("Network response was not ok");
  return response.json();
};

export const updateUserProfile = async (userSub, profileData) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sub: userSub, ...profileData }),
  });
  if (!response.ok) throw new Error("Update failed");
  return response.json();
};

// --------------------  PRODUCT APIS -------------------- //
export const createProduct = async (productData) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error("Failed to list the product.");
  return response.json();
};

export const fetchProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/products?${query}`);
  if (!response.ok) throw new Error("Failed to fetch products.");
  return response.json();
};

/**
 * @param {string} productId
 * @param {string} userSub
 * Buy a product by passing in the productId and the user's Cognito sub.
 */
export const buyProduct = async (productId, userSub) => {
  const response = await fetch(`${BASE_URL}/buyProduct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productId, userSub }),
  });
  if (!response.ok) throw new Error("Failed to buy product.");
  return response.json();
};

/**
 * @param {string} userSub
 * Fetch all purchases for a given userSub
 */
export const fetchPurchases = async (userSub) => {
  const response = await fetch(`${BASE_URL}/purchases?userSub=${userSub}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to fetch purchases.");
  return response.json();
};

// --------------------  USER PRODUCTS API -------------------- //
export const fetchUserProducts = async (sellerSub) => {
  const response = await fetch(`${BASE_URL}/products?seller_sub=${encodeURIComponent(sellerSub)}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch user products.");
  }
  return response.json();
};
