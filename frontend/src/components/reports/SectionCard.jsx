import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useTransactions } from '@/lib/transactions/transactions.query'
import { IconTrendingUp } from '@tabler/icons-react'
import currency from 'currency.js'

const SectionCard = () => {
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Cash In</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalCashReceipts.format()}
          </CardTitle>
          {/* <CardAction> */}
          {/*   <Badge variant="outline"> */}
          {/*     <IconTrendingUp /> */}
          {/**/}
          {/*   </Badge> */}
          {/* </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          {/* <div className="text-muted-foreground"> */}
          {/*   Visitors for the last 6 months */}
          {/* </div> */}
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Dividend/Interest</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalDividendOrInterest.format()}
          </CardTitle>
          {/* <CardAction> */}
          {/*   <Badge variant="outline"> */}
          {/*     <IconTrendingUp /> */}
          {/**/}
          {/*   </Badge> */}
          {/* </CardAction> */}
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          {/* <div className="text-muted-foreground"> */}
          {/*   Visitors for the last 6 months */}
          {/* </div> */}
        </CardFooter>
      </Card>
    </div>
  )
}

export default SectionCard
