import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { authQueryKeys } from '../auth/auth.query'
import {
  getAccount,
  getAccounts,
  importSchwabAccounts,
  updateAccount,
} from './accounts.api'

export const accountQueryKeys = {
  all: [{ entity: 'accounts' }],
  index: (filters) => [{ ...accountQueryKeys.all[0], scope: 'index', filters }],
  show: (accountId) => [
    { ...accountQueryKeys.all[0], scope: 'show', accountId },
  ],
}

const ACCOUNT_STALE_TIME = 1000 * 60 * 5 // 5 minutes

export const accountQueries = {
  index: (filters) =>
    queryOptions({
      queryKey: accountQueryKeys.index(filters),
      queryFn: getAccounts,
      staleTime: ACCOUNT_STALE_TIME,
      gcTime: ACCOUNT_STALE_TIME * 2,
    }),
  show: (accountId) =>
    queryOptions({
      queryKey: accountQueryKeys.show(accountId),
      queryFn: getAccount,
    }),
}

export const useAccounts = (filters) =>
  useSuspenseQuery(accountQueries.index(filters))

export const useAccount = (accountId) =>
  useSuspenseQuery(accountQueries.index(accountId))

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: authQueryKeys.user() }),
        queryClient.invalidateQueries({ queryKey: accountQueryKeys.all }),
      ]),
  })
}

export const useImportSchwabAccountsMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: importSchwabAccounts,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountQueryKeys.all }),
  })
}
