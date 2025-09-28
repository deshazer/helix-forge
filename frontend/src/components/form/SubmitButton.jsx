import { useFormContext } from '@/lib/form'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import LoadingSpinner from '../ui/loading-spinner'

export default function SubmitButton({
  children,
  mutation = {},
  className,
  ...props
}) {
  const form = useFormContext()
  return (
    <form.Subscribe
      selector={(state) => [state.canSubmit, state.isSubmitting, state.errors]}
    >
      {([canSubmit, isSubmitting, errors]) => (
        <Button
          className={cn('w-full disabled:opacity-50', className)}
          type="submit"
          disabled={
            errors.length || isSubmitting || mutation?.isPending || !canSubmit
          }
          {...props}
        >
          {isSubmitting ? <LoadingSpinner /> : children}
        </Button>
      )}
    </form.Subscribe>
  )
}
