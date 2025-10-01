import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

// Mock data for the chart - you would replace with actual historical data
const chartData = [
  { time: '9:30', price: 441.52 },
  { time: '10:00', price: 442.1 },
  { time: '10:30', price: 443.25 },
  { time: '11:00', price: 442.8 },
  { time: '11:30', price: 443.5 },
  { time: '12:00', price: 444.0 },
  { time: '12:30', price: 443.3 },
  { time: '13:00', price: 444.72 },
  { time: '13:30', price: 444.5 },
  { time: '14:00', price: 445.0 },
  { time: '14:30', price: 443.12 },
  { time: '15:00', price: 442.8 },
  { time: '15:30', price: 442.2 },
]

const StockDisplay = ({ data }) => {
  if (!data || !data?.quote) return null

  const [symbol] = Object.keys(data.quote) || []
  const stock = data.quote[symbol]

  if (!stock) return null

  const isPositive = stock.quote.netPercentChange >= 0
  const chartColor = isPositive ? '#10b981' : '#ef4444'

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
                ${stock.quote.lastPrice.toFixed(2)}
              </span>
              <span
                className={`text-lg ${isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {isPositive ? '+' : ''}
                {stock.quote.netChange.toFixed(2)} ({isPositive ? '+' : ''}
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
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
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
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  formatter={(value) => [`$${value}`, 'Price']}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Line
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
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Market Cap</p>
              <p className="font-medium">Calculated separately</p>
            </div>
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
              <p className="text-gray-600">Avg Volume</p>
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
