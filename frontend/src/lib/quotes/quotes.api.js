import api from '../axios'

export const getQuote = async ({ queryKey }) => {
  const [{ symbol, filters = {} }] = queryKey
  return await api.get(`/quotes/${symbol}/`, { params: { ...filters } })
}

export const getPriceHistory = async ({ queryKey }) => {
  const [{ symbol, filters = {} }] = queryKey
  return await api.get(`/price_history/${symbol}/`, { params: { ...filters } })
}
