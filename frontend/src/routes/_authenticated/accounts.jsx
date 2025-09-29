import DataTable from '@/components/table/DataTable'
import { Button } from '@/components/ui/button'
import Txt from '@/components/ui/typography'
import {
  useAccounts,
  useImportSchwabAccountsMutation,
} from '@/lib/accounts/accounts.query'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { toast } from 'sonner'
import { accountColumns } from '@/components/table/account-columns'

export const Route = createFileRoute('/_authenticated/accounts')({
  component: AccountsComponent,
})

function AccountsComponent() {
  const { data: accounts } = useAccounts()
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
          Import Schwab Accounts
        </Button>
      </div>
      <DataTable columns={accountColumns} data={accounts} />
    </div>
  )
}
