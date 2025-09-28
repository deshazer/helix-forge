import { useFieldContext } from '@/lib/form'
import { cn } from '@/lib/utils'

function FieldInfo({ className }) {
  const field = useFieldContext()
  return (
    <>
      {field.state.meta.errors.length > 0 && (
        <em className={cn('text-sm text-destructive', className)}>
          {field.state.meta.errors
            .map((e) => e.message ?? e?.toString())
            .join(', ')}
        </em>
      )}
    </>
  )
}

export default FieldInfo
