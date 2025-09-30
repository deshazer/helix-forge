import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip'
import Txt from './typography'

const RelativeDate = ({ date, className }) => {
  const parsed = dayjs(date)
  if (parsed.isValid()) {
    return (
      <Tooltip delayDuration={250}>
        <TooltipTrigger>
          <Txt.link className={cn(className)}>{parsed.fromNow()}</Txt.link>
        </TooltipTrigger>
        <TooltipContent className="text-center">
          <Txt.small>{parsed.format('ddd, MMM D, YYYY, h:mm A')}</Txt.small>
        </TooltipContent>
      </Tooltip>
    )
  }
  return <span className={cn(className)}>Unknown</span>
}

export default RelativeDate
