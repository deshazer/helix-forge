import { accountColumns } from '@/components/table/account-columns'
import DataTable from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import RelativeDate from '@/components/ui/hover-date'
import Txt from '@/components/ui/typography'
import {
  accountQueries,
  useAccounts,
  useImportSchwabAccountsMutation,
} from '@/lib/accounts/accounts.query'
import { authQueries, useAuthState } from '@/lib/auth/auth.query'
import { transactionQueries } from '@/lib/transactions/transactions.query'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/accounts')({
  component: AccountsComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(accountQueries.index())
    context.queryClient.ensureQueryData(authQueries.user())
    context.queryClient.ensureQueryData(transactionQueries.index())
  },
})

function AccountsComponent() {
  const { data: accounts } = useAccounts()
  const { data: user } = useAuthState()
  const { mutateAsync: importAccounts, isPending: isImportingAccounts } =
    useImportSchwabAccountsMutation()

  const importSchwabAccounts = async () => {
    try {
      const { imported } = await importAccounts()

      const description = imported
        ? `Found ${imported} new account${imported > 1 ? 's' : ''}`
        : 'No new accounts found'

      toast.success('Import Complete', { description })
    } catch (error) {
      console.error(error)
      toast.error('Error importing schwab accounts.', {
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <Txt.h3>Accounts</Txt.h3>
        <Button onClick={importSchwabAccounts} disabled={isImportingAccounts}>
          <RefreshCw className={isImportingAccounts ? 'animate-spin' : ''} />{' '}
          Sync Schwab Accounts
        </Button>
      </div>
      <Txt.muted>
        To make changes, update your Schwab account then re-sync.
      </Txt.muted>
      <Txt.muted>
        Last synced: <RelativeDate date={user?.transaction_sync_at} />
      </Txt.muted>
      <DataTable columns={accountColumns} data={accounts} />
    </div>
  )
}
