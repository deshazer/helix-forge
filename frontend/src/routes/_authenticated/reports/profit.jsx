import {
  transactionQueries,
  useTransactions,
} from '@/lib/transactions/transactions.query'
import { createFileRoute } from '@tanstack/react-router'
import OptionsPremium from '@/components/reports/OptionsPremium'
import Txt from '@/components/ui/typography'
import { ChartNoAxesCombined } from 'lucide-react'
import currency from 'currency.js'
import SectionCard from '@/components/reports/SectionCard'

export const Route = createFileRoute('/_authenticated/reports/profit')({
  component: ProfitComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(transactionQueries.index())
  },
})

function ProfitComponent() {
  const { data: allTransactions } = useTransactions()

  console.log('allTransactions TYPES', [
    ...new Set(allTransactions.map((t) => t.type)),
  ])

  const totalDividendOrInterest = allTransactions
    .filter((t) => t.type === 'DIVIDEND_OR_INTEREST')
    .reduce((total, t) => total.add(t.net_amount), currency(0))

  const totalCashReceipts = allTransactions
    .filter((t) => t.type === 'CASH_RECEIPT')
    .reduce((total, t) => total.add(t.net_amount), currency(0))

  const accountOpeningBalance = allTransactions
    .filter(
      (t) => t.type === 'TRADE' && t.asset_type === 'COLLECTIVE_INVESTMENT',
    )
    .reduce((total, t) => total.add(t.net_amount), currency(0))

  console.log('totalDividendOrInterest', totalDividendOrInterest.format())

  console.log('totalCashReceipts', totalCashReceipts.format())

  console.log('accountOpeningBalance', accountOpeningBalance.format())

  return (
    <div className="flex flex-col space-y-4">
      <Txt.h2 className="inline-flex items-center gap-2">
        <ChartNoAxesCombined size={32} /> Profit Reports
      </Txt.h2>
      <SectionCard />
      <OptionsPremium />
    </div>
  )
}
