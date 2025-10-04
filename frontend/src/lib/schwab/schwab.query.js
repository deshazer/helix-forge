import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  schwabAccounts,
  schwabAuthInit,
  schwabGenerateToken,
  schwabTransactions,
} from './schwab.api'
import { authQueryKeys } from '../auth/auth.query'

export const schwabQueryKeys = {
  all: [{ entity: 'schwab' }],
  authInit: () => [{ ...schwabQueryKeys.all[0], scope: 'auth-init' }],
  accounts: () => [{ ...schwabQueryKeys.all[0], scope: 'accounts' }],
  transactions: () => [{ ...schwabQueryKeys.all[0], scope: 'transactions' }],
}

export const schwabQueries = {
  authInit: () =>
    queryOptions({
      queryKey: schwabQueryKeys.authInit(),
      queryFn: schwabAuthInit,
      staleTime: 0,
    }),
  accounts: () =>
    queryOptions({
      queryKey: schwabQueryKeys.accounts(),
      queryFn: schwabAccounts,
    }),
  transactions: () =>
    queryOptions({
      queryKey: schwabQueryKeys.transactions(),
      queryFn: schwabTransactions,
    }),
}

export const useSchwabAuthInit = () =>
  useSuspenseQuery(schwabQueries.authInit())

export const useSchwabTransactions = () =>
  useSuspenseQuery(schwabQueries.transactions())

export const useSchwabGenerateTokenMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: schwabGenerateToken,
    onSuccess: () => {
      toast.success('Schwab token generated')
      return queryClient.invalidateQueries({ queryKey: authQueryKeys.user() })
    },
  })
}
