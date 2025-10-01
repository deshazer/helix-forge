import SearchInput from '@/components/form/SearchInput'
import { Button } from '@/components/ui/button'
import Txt from '@/components/ui/typography'
import { quoteQueries } from '@/lib/quotes/quotes.query'
import { getErrorMessage } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import ExportToExcelButton from '@/components/form/ExportToExcelButton'
import StockDisplay from '@/components/StockDisplay'

export const Route = createFileRoute('/_authenticated/reports/quotes')({
  component: QuotesComponent,
})

function QuotesComponent() {
  const [search, setSearch] = useState('')
  const [results, setResults] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const queryClient = useQueryClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsPending(true)
      const response = await queryClient.fetchQuery(
        quoteQueries.quote(search, { price_history: '1D' }),
      )
      setResults(response)
      console.log(response)
      if (response?.quote?.errors) {
        toast.error('Error fetching quotes', {
          description: response.quote.errors[0]?.title,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error('Error fetching quotes', {
        description: getErrorMessage(error),
      })
    } finally {
      setIsPending(false)
    }
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
          setValue={setSearch}
          className="max-w-md"
          placeholder="Enter symbol"
          autoFocus
        />
        <Button disabled={!search || isPending}>Go</Button>
      </form>

      <StockDisplay data={results} symbol={search.toUpperCase()} />

      {!!results && (
        <div>
          <ExportToExcelButton data={results?.price_history?.candles}>
            Export Price History
          </ExportToExcelButton>
        </div>
      )}
    </div>
  )
}
