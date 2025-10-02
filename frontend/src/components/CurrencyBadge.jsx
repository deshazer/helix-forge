import { cn, formatCurrency } from '@/lib/utils'
import { Badge } from './ui/badge'

const CurrencyBadge = ({ value, className }) => {
  return (
    <Badge
      className={cn(
        'text-sm',
        value > 0 ? 'bg-green-500' : 'bg-red-500 text-white',
        className,
      )}
    >
      {formatCurrency(value)}
    </Badge>
  )
}

export default CurrencyBadge
