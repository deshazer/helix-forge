import { cn } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/loading-spinner'

const DefaultPending = ({ className }) => {
  return (
    <div className={cn('flex items-center justify-center h-screen', className)}>
      <div className="inline-flex items-center px-4 py-2 text-lg font-semibold">
        <LoadingSpinner />
        <span className="ml-2">Loading...</span>
      </div>
    </div>
  )
}

export default DefaultPending
