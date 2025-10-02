import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import dayjs from 'dayjs'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const StockDisplay = ({ data }) => {
  if (!data || !data?.quote) return null

  if (data.quote?.errors) {
    return <div className="text-red-500">{data.quote.errors[0].title}</div>
  }

  const [symbol] = Object.keys(data.quote) || []
  const stock = data.quote[symbol]

  if (!stock) return null

  const isPositive = stock.quote.netPercentChange >= 0
  const chartColor = isPositive ? '#10b981' : '#ef4444'

  const priceHistory = data?.price_history?.candles || []

  const formattedPriceHistory = priceHistory
    ?.filter((candle) => dayjs(candle.datetime))
    ?.map((candle) => ({
      time: dayjs(candle.datetime).format('h:mm A'),
      price: candle.close,
    }))

  // console.log('formattedPriceHistory', formattedPriceHistory)

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="p-6">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">
                {stock.reference.description}
              </h1>
              <Badge variant="secondary" className="ml-2">
                {stock.reference.exchangeName}: {stock.symbol}
              </Badge>
            </div>
            <p className="text-gray-600">
              Real-time Data • {stock.reference.exchangeName}
            </p>
          </div>
        </div>

        {/* Price and Change Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold">
                {formatCurrency(stock.quote.lastPrice)}
              </span>
              <span
                className={`text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {isPositive ? '+' : ''}
                {formatCurrency(stock.quote.netChange)} ({isPositive ? '+' : ''}
                {stock.quote.netPercentChange.toFixed(2)}%)
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Previous Close</p>
                  <p className="font-medium">
                    ${stock.quote.closePrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Open</p>
                  <p className="font-medium">
                    ${stock.quote.openPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Day's Range</p>
                  <p className="font-medium">
                    ${stock.quote.lowPrice.toFixed(2)} - $
                    {stock.quote.highPrice.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">52 Week Range</p>
                  <p className="font-medium">
                    ${stock.quote['52WeekLow'].toFixed(2)} - $
                    {stock.quote['52WeekHigh'].toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Volume</p>
                  <p className="font-medium">
                    {stock.quote.totalVolume.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">P/E Ratio</p>
                  <p className="font-medium">
                    {stock.fundamental.peRatio.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}

          {priceHistory.length > 0 && (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedPriceHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['dataMin - 1', 'dataMax + 1']}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Price']}
                    labelFormatter={(label) => (
                      <span className="text-black">Time: {label}</span>
                    )}
                  />
                  <Line
                    label={() => 'Price'}
                    type="monotone"
                    dataKey="price"
                    stroke={chartColor}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: chartColor }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">EPS</p>
              <p className="font-medium">${stock.fundamental.eps.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600">Dividend Yield</p>
              <p className="font-medium">
                {stock.fundamental.divYield.toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-gray-600">Next Ex Date</p>
              <p className="font-medium">
                {dayjs(stock.fundamental.nextDivExDate).format('MM/DD/YYYY')}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Avg 10-Day Volume</p>
              <p className="font-medium">
                {stock.fundamental.avg10DaysVolume.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default StockDisplay
