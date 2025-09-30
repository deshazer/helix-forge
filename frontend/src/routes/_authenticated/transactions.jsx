import DataTable from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import Txt from '@/components/ui/typography'
import { accountQueries, useAccounts } from '@/lib/accounts/accounts.query'
import {
  transactionQueries,
  useImportSchwabTransactionsMutation,
  useTransactions,
} from '@/lib/transactions/transactions.query'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { transactionColumns } from '@/components/table/transaction-columns'
import XLSX from 'xlsx'
import { FileDown } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/transactions')({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(transactionQueries.index())
    context.queryClient.ensureQueryData(accountQueries.index())
  },
  component: TransactionsComponent,
})

function TransactionsComponent() {
  const { data: transactions } = useTransactions()
  const { data: accounts } = useAccounts()

  const [accountId, setAccountId] = useState('')

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

  // TODO: Improve this using https://docs.sheetjs.com/docs
  const exportToExcel = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(transactions)
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions')
    XLSX.writeFile(wb, `transactions-${Date.now()}.xlsx`)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <Txt.h3>Transactions</Txt.h3>
        <Button onClick={importTransactions} disabled={isImporting}>
          Sync Transactions
        </Button>
      </div>
      <Select
        onValueChange={setAccountId}
        defaultValue={accounts.find((a) => a.is_default)?.id}
      >
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
      <div className="flex items-center justify-between">
        <Txt.muted>Count: {transactions?.length || 0}</Txt.muted>
        {transactions?.length > 0 && (
          <Button variant="outline" onClick={exportToExcel}>
            <FileDown /> Export to Excel
          </Button>
        )}
      </div>
      <DataTable data={transactions} columns={transactionColumns} />
    </div>
  )
}
