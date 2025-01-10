// Placeholder base URL – update these once your API Gateway is deployed
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
export const createProduct = async (productData, token) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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

export const buyProduct = async (productId, token) => {
  const response = await fetch(`${BASE_URL}/products/${productId}/buy`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Failed to purchase product.");
  return response.json();
};

export const fetchPurchases = async (token) => {
  const response = await fetch(`${BASE_URL}/purchases`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch purchases.");
  return response.json();
};