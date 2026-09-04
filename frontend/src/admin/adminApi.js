import axios from 'axios'

// Mirrors the hardcoded base URL from src/api.js exactly
const ADMIN_BASE_URL = 'http://localhost:8000/nutriflow'

const adminApi = axios.create({
  baseURL: ADMIN_BASE_URL,
})

// Separate localStorage key from customer token ('nutriflow_token') to
// avoid session collisions if the same browser has both sessions open
export const getAdminToken = () => localStorage.getItem('nutriflow_admin_token')

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default adminApi
