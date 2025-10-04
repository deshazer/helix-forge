import api from '@/lib/axios'

export const getAccounts = () => api.get('/accounts/')

export const getAccount = ({ queryKey: [{ account_id }] }) =>
  api.get(`/accounts/${account_id}/`)

export const updateAccount = ({ accountId, ...data }) =>
  api.put(`/accounts/${accountId}/`, data)

export const importSchwabAccounts = () => api.post('/accounts/import/')
