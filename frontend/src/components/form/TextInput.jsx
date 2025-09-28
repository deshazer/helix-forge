import { useFieldContext } from '@/lib/form'
import { cn } from '@/lib/utils'
import { useId } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import FieldInfo from './FieldInfo'

export default function TextInput({
  id,
  label = null,
  type = 'text',
  labelEnd = '',
  placeholder = '',
  className = '',
  readOnlyEmptyText,
  ...props
}) {
  const field = useFieldContext()
  const randomId = useId()

  return (
    <div className={cn('flex flex-col gap-y-2 w-full', className)}>
      {!!label && (
        <div className="inline-flex items-center">
          <Label htmlFor={id || field.name}>{label}</Label>
          {labelEnd}
        </div>
      )}

      <Input
        id={id || `${randomId}-${field.name}`}
        type={type}
        placeholder={placeholder}
        value={field.state.value ?? ''}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        className="bg-background w-full shadow-none"
        {...props}
      />
      {type !== 'hidden' && <FieldInfo />}
    </div>
  )
}
