import api from '@/lib/axios'

export const csrf = () => api.get('/csrf/')

export const refreshToken = ({ signal }) =>
  api.post('/token/refresh/', { signal })
export const isAuthenticated = () => api.post('/authenticated/')

// code 422 Unprocessable Entity is returned by auth methods that fail backend validation
// e.g. bad login credentials, signing up with an email already in use, expired password reset token, etc
export async function login(value) {
  await csrf()
  return api.post('/login/', value)
}

export async function logout() {
  return api.post('/logout/')
}

export async function signUp(value) {
  return api.post('/register/', value)
}

// export async function forgotPassword(value) {
//   await csrf()
//   return axios.post('/forgot-password', value)
// }
//
// export async function resetPassword(value) {
//   await csrf()
//   return axios.post('/reset-password', value)
// }
//
// export async function sendVerificationEmail() {
//   await csrf()
//   return axios.post('/email/verification-notification')
// }
//
// export async function updateProfile(value) {
//   await csrf()
//   return axios.put('/user/profile', value)
// }

export const nullAuthUser = { isAuthenticated: false, user: null }

export async function getAuthUser({ signal }) {
  return api.get('/whoami/', { signal })
}
