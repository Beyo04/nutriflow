import axios from 'axios'

export const API_BASE_URL = 'http://localhost:8000/nutriflow/auth'

/**
 * Fetch authenticated user profile
 * GET /nutriflow/auth/profile
 */
export const fetchUserProfile = async (token) => {
  const authToken = token || localStorage.getItem('nutriflow_token')
  if (!authToken) throw new Error('No authentication token found')

  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  })
  return response.data
}
