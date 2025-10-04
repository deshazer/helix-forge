import api from '@/lib/axios'

export const schwabAuthInit = () => api.get('/schwab/auth/init/')

export const schwabAccounts = () => api.get('/schwab/accounts/')

export const schwabTransactions = () => api.get('/schwab/transactions/')

export const schwabGenerateToken = (code) =>
  api.get('/schwab/token/', { params: { code } })
