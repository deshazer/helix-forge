import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Txt from '@/components/ui/typography'
import {
  transactionQueries,
  useTransactions,
} from '@/lib/transactions/transactions.query'
import { cn, formatCurrency } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

dayjs.extend(utc)
dayjs.extend(timezone)

export const Route = createFileRoute('/_authenticated/reports/options')({
  component: OptionsPremiumComponent,
  loader: async ({ context }) => {
    context.queryClient.ensureQueryData(transactionQueries.index())
  },
})

function OptionsPremiumComponent() {
  const { data: allTransactions } = useTransactions()

  console.log('allTransactions', allTransactions)

  const chartConfig = { net_amount: { label: 'Net' } }

  const optionsTransactions = allTransactions
    .filter((t) => t?.asset_type === 'OPTION')
    .toSorted((a, b) => dayjs(a.time).unix() - dayjs(b.time).unix())
    .map((t) => {
      return {
        ...t,
        time: dayjs(t.time).format(),
        day: dayjs(t.time).format('MM/DD/YYYY'),
        created_at: dayjs(t.created_at).format(),
        updated_at: dayjs(t.updated_at).format(),
      }
    })

  console.log('optionsTransactions', optionsTransactions)

  const dailySum = {}

  optionsTransactions.forEach((t) => {
    if (!dailySum[t.day]) {
      dailySum[t.day] = { day: t.day, net_amount: t.net_amount }
    } else {
      dailySum[t.day].net_amount += t.net_amount
    }
  })

  const formattedOptionsData = Object.values(dailySum).map((d) => {
    return { ...d }
  })

  console.log('formattedOptionsData', formattedOptionsData)

  const totalReturn = formattedOptionsData.reduce(
    (acc, curr) => acc + curr.net_amount,
    0,
  )

  const totalFees = optionsTransactions.reduce(
    (acc, curr) => acc + curr.total_fees,
    0,
  )

  const averageDailyReturn = totalReturn / formattedOptionsData.length

  const totalGross = totalReturn - totalFees

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <Txt.h3>Options Premium</Txt.h3>
      </div>
      <div>
        <Card>
          <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
            <CardTitle>Daily Net Premium </CardTitle>
          </CardHeader>
          <CardContent className="flex-col px-2 pt-4 sm:px-6 sm:pt-6 space-y-6">
            <ChartContainer
              config={chartConfig}
              className="w-full min-h-[250px]"
            >
              <AreaChart data={formattedOptionsData}>
                <defs>
                  <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--chart-3)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <YAxis
                  tickLine={true}
                  axisLine={true}
                  tickMargin={8}
                  width={60}
                  tickFormatter={(value) => formatCurrency(value)}
                />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => dayjs(value).format('M/D')}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(label) => dayjs(label).format('ddd M/D')}
                      formatter={(value) => (
                        <div className="inline-flex items-center justify-between w-full">
                          <div className="[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3">
                            <div className="h-2 w-2 shrink-0 rounded-[2px] bg-chart-3"></div>
                            Net
                          </div>
                          <div className="font-medium">
                            {formatCurrency(value)}
                          </div>
                        </div>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="net_amount"
                  stroke="var(--chart-3)"
                  fill="url(#fillNet)"
                  type="monotone"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>

            <div className="flex items-center justify-between">
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Average Daily Return:</Txt.muted>{' '}
                </div>
                <div>
                  <Badge
                    className={cn(
                      'text-sm',
                      averageDailyReturn > 0
                        ? 'bg-green-500'
                        : 'bg-red-500 text-white',
                    )}
                  >
                    {formatCurrency(averageDailyReturn)}
                  </Badge>
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Gross:</Txt.muted>{' '}
                </div>
                <div>
                  <Badge
                    className={cn(
                      'text-sm',
                      totalGross > 0 ? 'bg-green-500' : 'bg-red-500 text-white',
                    )}
                  >
                    {formatCurrency(totalGross)}
                  </Badge>
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Fees:</Txt.muted>{' '}
                </div>
                <div>
                  <Badge className="text-sm bg-red-500 text-white">
                    {formatCurrency(totalFees)}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted className="text-md">Total Return:</Txt.muted>{' '}
                </div>
                <div>
                  <Badge
                    className={cn(
                      'text-md',
                      totalReturn > 0
                        ? 'bg-green-500'
                        : 'bg-red-500 text-white',
                    )}
                  >
                    {formatCurrency(totalReturn)}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
