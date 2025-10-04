import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { authQueryKeys } from '../auth/auth.query'
import {
  getTransaction,
  getTransactions,
  importTransactions,
} from './transactions.api'

export const transactionQueryKeys = {
  all: [{ entity: 'transactions' }],
  index: (filters) => [
    { ...transactionQueryKeys.all[0], scope: 'index', filters },
  ],
  show: (transactionId) => [
    { ...transactionQueryKeys.all[0], scope: 'show', transactionId },
  ],
}

export const transactionQueries = {
  index: (filters) =>
    queryOptions({
      queryKey: transactionQueryKeys.index(filters),
      queryFn: getTransactions,
      staleTime: Infinity, // you have to re-sync to get more transactions anyway
    }),
  show: (transactionId) =>
    queryOptions({
      queryKey: transactionQueryKeys.show(transactionId),
      queryFn: getTransaction,
    }),
}

export const useTransactions = (filters) =>
  useSuspenseQuery(transactionQueries.index(filters))

export const useTransaction = (transactionId) =>
  useSuspenseQuery(transactionQueries.index(transactionId))

export const useImportSchwabTransactionsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importTransactions,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.user() }),
        queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all }),
      ]),
  })
}
