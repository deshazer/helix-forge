import Txt from '@/components/ui/typography'
import { schwabQueries, useSchwabTransactions } from '@/lib/schwab/schwab.query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/transactions')({
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(schwabQueries.transactions())
  },
  component: TransactionsComponent,
})

function TransactionsComponent() {
  const { data: response } = useSchwabTransactions()

  const transactions = response.transactions
    .filter((t) => t.type === 'TRADE')
    .filter((t) =>
      t.transferItems.some((i) => i.instrument.assetType === 'OPTION'),
    )
    .toSorted((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .map(({ transferItems, ...t }) => ({
      ...t,

      totalFees: transferItems.reduce(
        (acc, i) =>
          i.instrument.assetType === 'CURRENCY' ? acc + i.amount : acc,
        0,
      ),
      transferItems,
    }))
  return (
    <div>
      <Txt.h3>Transactions</Txt.h3>
      <Txt.muted>Count: {transactions.length}</Txt.muted>
      <pre>{JSON.stringify(transactions, null, 2)}</pre>
    </div>
  )
}
