import CurrencyBadge from '@/components/CurrencyBadge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import Txt from '@/components/ui/typography'
import { useTransactions } from '@/lib/transactions/transactions.query'
import money from 'currency.js'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'

const OptionsPremium = () => {
  const { data: allTransactions } = useTransactions()

  const [showRunningTotal, setShowRunningTotal] = useState(true)
  const [showDailyNet, setShowDailyNet] = useState(true)

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
      dailySum[t.day].net_amount = money(dailySum[t.day].net_amount).add(
        t.net_amount,
      ).value
    }
  })
  let total = money(0)
  const dailyOptionsData = Object.values(dailySum).map((t) => {
    total = total.add(t.net_amount)
    return { day: t.day, daily_net: t.net_amount, total: total.value }
  })

  console.log('dailyOptionsData', dailyOptionsData)

  const totalReturn = dailyOptionsData.reduce(
    (acc, curr) => acc + curr.daily_net,
    0,
  )

  const totalFees = optionsTransactions.reduce(
    (acc, curr) => acc + curr.total_fees,
    0,
  )

  const averageDailyReturn = money(totalReturn).divide(
    dailyOptionsData.length,
  ).value
  const averageDailyGross = money(totalReturn)
    .subtract(totalFees)
    .divide(dailyOptionsData.length).value
  const averageDailyFees = money(totalFees).divide(
    dailyOptionsData.length,
  ).value

  const totalGross = money(totalReturn).subtract(totalFees) // fees is already negative

  const chartConfig = {
    daily_net: {
      label: 'Daily Net',
      color: 'var(--chart-3)',
      onLegendClick: () => setShowDailyNet((prev) => !prev),
    },
    total: {
      label: 'Running Total',
      color: 'var(--chart-1)',
      onLegendClick: () => setShowRunningTotal((prev) => !prev),
    },
  }

  return (
    <div className="flex flex-col space-y-4">
      <div>
        <Card>
          <CardHeader className="flex flex-col gap-2 space-y-0 border-b pb-5 ">
            <CardTitle className="text-lg">Daily Options Premium </CardTitle>
            <div>
              <Txt.muted>Click on the legend to show/hide lines</Txt.muted>
            </div>
          </CardHeader>
          <CardContent className="flex-col px-2 pt-4 sm:px-6 sm:pt-6 space-y-6">
            <ChartContainer
              config={chartConfig}
              className="w-full min-h-[250px]"
            >
              <AreaChart data={dailyOptionsData}>
                <defs>
                  <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-total)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-total)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>

                  <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-daily_net)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-daily_net)"
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
                  tickFormatter={(value) => money(value).format()}
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
                      formatter={(value, name) => (
                        <>
                          <div
                            className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-(--color-bg)"
                            style={{ '--color-bg': `var(--color-${name})` }}
                          />
                          <span className="text-muted-foreground">
                            {chartConfig[name]?.label || name}
                          </span>
                          <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                            {money(value).format()}
                          </div>
                        </>
                      )}
                    />
                  }
                />
                <Area
                  dataKey="total"
                  hide={!showRunningTotal}
                  stroke="var(--chart-2)"
                  name="total"
                  fill="url(#fillTotal)"
                  type="monotone"
                />
                <Area
                  dataKey="daily_net"
                  hide={!showDailyNet}
                  name="daily_net"
                  stroke="var(--chart-1)"
                  fill="url(#fillNet)"
                  type="monotone"
                />
                <ChartLegend content={<ChartLegendContent />} />
              </AreaChart>
            </ChartContainer>

            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Average Daily Return:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={averageDailyReturn} />
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Average Daily Gross:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={averageDailyGross} />
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Average Daily Fees:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={averageDailyFees} />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Total Return:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={totalReturn} />
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Total Gross:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={totalGross} />
                </div>
              </div>
              <div className="flex-col space-y-2">
                <div>
                  <Txt.muted>Total Fees:</Txt.muted>
                </div>
                <div>
                  <CurrencyBadge value={totalFees} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default OptionsPremium
