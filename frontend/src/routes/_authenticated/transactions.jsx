import DataTable from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import RelativeDate from '@/components/ui/hover-date'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import ExportToExcelButton from '@/components/form/ExportToExcelButton'
import { transactionColumns } from '@/components/table/transaction-columns'
import Txt from '@/components/ui/typography'
import { accountQueries, useAccounts } from '@/lib/accounts/accounts.query'
import { authQueries, useAuthState } from '@/lib/auth/auth.query'
import {
  transactionQueries,
  useImportSchwabTransactionsMutation,
  useTransactions,
} from '@/lib/transactions/transactions.query'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/transactions')({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(transactionQueries.index())
    context.queryClient.ensureQueryData(accountQueries.index())
    context.queryClient.ensureQueryData(authQueries.user())
  },
  component: TransactionsComponent,
})

function TransactionsComponent() {
  const { data: transactions } = useTransactions()
  const { data: accounts } = useAccounts()
  const { data: user } = useAuthState()

  const [accountId, setAccountId] = useState(
    accounts.find((a) => a.is_default)?.id,
  )

  const { mutateAsync: importSchwabTransactions, isPending: isImporting } =
    useImportSchwabTransactionsMutation()

  const importTransactions = async () => {
    try {
      if (!accountId) {
        return toast.error('Please select an account')
      }
      const { imported } = await importSchwabTransactions({ accountId })
      toast.success('Import Complete', {
        description: `Found ${imported} new transaction${imported !== 1 ? 's' : ''}`,
      })
    } catch (error) {
      console.error(error)
      toast.error('Error importing schwab transactions.', {
        description: getErrorMessage(error),
      })
    }
  }

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between mb-4">
        <Txt.h3>Transactions</Txt.h3>
      </div>
      <div className="inline-flex wrap items-center gap-x-2 -ml-2">
        <Select onValueChange={setAccountId} defaultValue={accountId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            {accounts?.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {a.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={importTransactions} disabled={isImporting}>
          <RefreshCw className={isImporting ? 'animate-spin' : ''} /> Sync
          Transactions
        </Button>
      </div>
      <Txt.muted>
        Last synced: <RelativeDate date={user?.transaction_sync_at} />
      </Txt.muted>
      <div className="flex items-center justify-between mt-4">
        <Txt.muted>Count: {transactions?.length || 0}</Txt.muted>
        {transactions?.length > 0 && (
          <ExportToExcelButton data={transactions} />
        )}
      </div>
      <DataTable data={transactions} columns={transactionColumns} />
    </div>
  )
}
