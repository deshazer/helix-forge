import api from '../axios'

export const getTransactions = ({ queryKey: [{ filters }] }) =>
  api.get('/transactions/', { params: filters })

export const getTransaction = ({ queryKey: [{ transactionId }] }) =>
  api.get(`/transactions/${transactionId}`)

export const importTransactions = (filters) =>
  api.post('/transactions/import/', { ...filters })
