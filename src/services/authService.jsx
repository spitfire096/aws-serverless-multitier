// src/services/authService.js
import { useAuth } from 'react-oidc-context'

let authInstance = null

export const setAuthInstance = (auth) => {
  authInstance = auth
}

export const getAccessToken = async () => {
  if (!authInstance) {
    throw new Error('Auth instance not set')
  }

  if (authInstance.isAuthenticated) {
    return authInstance.user.access_token
  } else {
    throw new Error('User is not authenticated')
  }
}
