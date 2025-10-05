import Axios from 'axios'
import { csrf } from './auth/auth.api'

const api = Axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
})

let isRefreshing = false
let refreshPromise = null
let authRedirectInProgress = false // guard to avoid multiple navigations
const queue = []

// Optional: app-level redirect (e.g., TanStack Router). If not set, we hard-redirect.
let onAuthFailureRedirect = null

export const setAuthFailureRedirect = (fn) => {
  onAuthFailureRedirect = typeof fn === 'function' ? fn : null
}

function hardRedirectToLogin() {
  if (authRedirectInProgress) return
  authRedirectInProgress = true

  const next = window.location.pathname + window.location.search
  const url = `/login?next=${encodeURIComponent(next)}`
  // Use replace so the back button doesn’t return to a broken page.
  window.location.replace(url)
}

function redirectToLogin() {
  // Prefer app-provided router redirect; otherwise do a hard redirect.
  if (authRedirectInProgress) return
  try {
    if (onAuthFailureRedirect) {
      authRedirectInProgress = true
      onAuthFailureRedirect()
      return
    }
  } catch (_) {
    // fall through to hard redirect if the router throws
  }
  hardRedirectToLogin()
}

// Flush queued requests (after refresh outcome)
function flushQueue(error) {
  while (queue.length) {
    const { resolve, reject } = queue.shift()
    if (error) reject(error)
    else resolve()
  }
}

async function doRefresh() {
  // Mark this request so the interceptor can identify it.
  const cfg = { method: 'POST', url: '/token/refresh/', _isRefresh: true }
  return api.request(cfg)
}

api.interceptors.response.use(
  (response) => response?.data,
  (error) => detectLoggedOutResponse(error),
)

// Our session expires after a while, and usually the first way we will notice
// is via a 401 (or possibly 419) error.
export const detectLoggedOutResponse = async (error) => {
  const originalRequest = error.config || {}

  // If not a 401, pass through.
  if (!error.response || error.response.status !== 401) {
    if (error?.response?.status === 419) {
      await csrf()
    }
    return Promise.reject(error)
  }

  // If the 401 came from the refresh call itself → redirect to login immediately.
  if (originalRequest._isRefresh) {
    redirectToLogin()
    // Reject after triggering redirect. The page will navigate away.
    return Promise.reject(error)
  }

  // Prevent infinite loops.
  if (originalRequest._retry) {
    redirectToLogin()
    return Promise.reject(error)
  }
  originalRequest._retry = true

  // Single-flight refresh; everyone else queues up.
  if (!isRefreshing) {
    isRefreshing = true
    refreshPromise = doRefresh()
      .then(() => {
        isRefreshing = false
        flushQueue() // wake queued requests to retry
      })
      .catch((refreshErr) => {
        isRefreshing = false
        // Trigger redirect BEFORE rejecting the queue so navigation wins the race.
        redirectToLogin()
        flushQueue(refreshErr)
      })
  }

  // Wait for the shared refresh, then retry or fail.
  return new Promise((resolve, reject) => {
    queue.push({
      resolve: () => {
        api.request(originalRequest).then(resolve).catch(reject)
      },
      reject: (err) => {
        reject(err)
      },
    })

    if (!refreshPromise) {
      // Shouldn't happen, but safety net.
      reject(error)
    }
  })
}

export default api
