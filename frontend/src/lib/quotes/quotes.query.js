import { queryOptions } from '@tanstack/react-query'
import { getPriceHistory, getQuote } from './quotes.api'

export const quoteQueryKeys = {
  all: () => [{ entity: 'quotes' }],
  quote: (symbol, filters) => [{ ...quoteQueryKeys.all[0], symbol, filters }],
  priceHistory: (symbol, filters) => [
    { ...quoteQueryKeys.all[0], symbol, filters },
  ],
}

export const quoteQueries = {
  quote: (symbol, filters) =>
    queryOptions({
      queryKey: quoteQueryKeys.quote(symbol, filters),
      queryFn: getQuote,
      staleTime: 500,
    }),
  priceHistory: (symbol, filters) =>
    queryOptions({
      queryKey: quoteQueryKeys.priceHistory(symbol, filters),
      queryFn: getPriceHistory,
      staleTime: 500,
    }),
}
