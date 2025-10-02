import ExportToExcelButton from '@/components/form/ExportToExcelButton'
import SearchInput from '@/components/form/SearchInput'
import StockDisplay from '@/components/StockDisplay'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/ui/loading-spinner'
import Txt from '@/components/ui/typography'
import useToastQueryError from '@/hooks/useToastQueryError'
import { quoteQueries } from '@/lib/quotes/quotes.query'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'
import { useState } from 'react'
import z from 'zod'

dayjs.extend(utc)
dayjs.extend(timezone)

export const Route = createFileRoute('/_authenticated/reports/quotes')({
  validateSearch: z.object({ symbol: z.string().optional() }),
  loaderDeps: ({ search: { symbol } }) => ({ symbol }),
  loader: async ({ context, deps: { symbol } }) => {
    if (symbol) {
      await context.queryClient.ensureQueryData(
        quoteQueries.quote(symbol, {
          price_history: '5m',
          start_datetime: dayjs()
            .subtract(1, 'day')
            .startOf('day')
            .toISOString(),
          end_datetime: dayjs().endOf('day').toISOString(),
        }),
      )
    }
  },
  component: QuotesComponent,
})

function QuotesComponent() {
  const navigate = useNavigate({ from: Route.fullPath })
  const { symbol } = Route.useSearch()
  const [search, setSearch] = useState(symbol || '')
  const [results, setResults] = useState(null)
  const {
    data: quote,
    refetch,
    error,
    isFetching,
  } = useQuery({
    ...quoteQueries.quote(symbol, {
      price_history: '5m',
      start_datetime: dayjs().subtract(1, 'day').startOf('day').toISOString(),
      end_datetime: dayjs().endOf('day').toISOString(),
    }),
    enabled: Boolean(symbol),
  })

  quote && console.log('results', quote)

  useToastQueryError(error, 'Error getting quote')

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (search && search !== symbol) {
      return navigate({ search: { symbol: search } })
    }

    refetch()
  }

  return (
    <div className="flex flex-col space-y-4">
      <Txt.h3>Quotes</Txt.h3>
      <form
        onSubmit={handleSubmit}
        className="inline-flex items-center gap-x-2"
      >
        <SearchInput
          value={search}
          setValue={(s) => setSearch(s?.toUpperCase())}
          className="max-w-md"
          placeholder="Enter symbol"
          autoFocus
        />
        <Button disabled={!search || isFetching}>
          {isFetching ? <LoadingSpinner /> : 'Go'}
        </Button>
      </form>

      <StockDisplay data={quote} symbol={search.toUpperCase()} />

      {!!quote && (
        <div>
          <ExportToExcelButton data={quote?.price_history?.candles}>
            Export Price History
          </ExportToExcelButton>
        </div>
      )}
    </div>
  )
}
