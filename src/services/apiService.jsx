// src/services/apiService.js
import { getAccessToken } from './authService' // We'll create this next

import axios from 'axios'

const API_BASE_URL = 'https://your-api-domain.com/api' // Replace with your actual API base URL

// GET /products
export const fetchProducts = async () => {
  const response = await axios.get(`${API_BASE_URL}/products`)
  return response.data
}

// POST /products/{productId}/buy
export const buyProduct = async (productId) => {
  const token = await getAccessToken()
  const response = await axios.put(
    `${API_BASE_URL}/products/${productId}/buy`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

// GET /products?sellerId={userId}
export const fetchUserProducts = async (sellerId) => {
  const token = await getAccessToken()
  const response = await axios.get(`${API_BASE_URL}/products`, {
    params: { sellerId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

// Additional API methods can be added here
