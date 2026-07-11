import api from '../services/api'

export async function loginWithGoogle(googleToken, saveAuthData, setLoading) {
  setLoading(true)
  try {
    const response = await api.post('/auth/google-signin', { token: googleToken })
    const { token: userToken, user: userData } = response.data
    saveAuthData(userData, userToken)
    return userData
  } finally {
    setLoading(false)
  }
}

//Frontend sends Google token to /api/auth/google-signin
// Backend verifies token with Google
// Backend finds/creates user and returns your app's JWT
// Frontend stores token and user data, redirects to dashboard