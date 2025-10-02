import { transactionQueries } from '@/lib/transactions/transactions.query'
import { createFileRoute } from '@tanstack/react-router'
import OptionsPremium from '@/components/reports/OptionsPremium'
import Txt from '@/components/ui/typography'
import { ChartNoAxesCombined } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/reports/profit')({
  component: ProfitComponent,
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(transactionQueries.index())
  },
})

function ProfitComponent() {
  return (
    <div className="flex flex-col space-y-4">
      <Txt.h2 className="inline-flex items-center gap-2">
        <ChartNoAxesCombined size={32} /> Profit Reports
      </Txt.h2>
      <OptionsPremium />
    </div>
  )
}
