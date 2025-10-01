import { cn } from '@/lib/utils'
import { Search, XIcon } from 'lucide-react'
import { useRef } from 'react'
import { Input } from '../ui/input'

const SearchInput = ({
  value,
  setValue,
  onClear,
  onChange,
  autoFocus,
  className = '',
  placeholder,
}) => {
  const inputRef = useRef(null)
  onChange ??= (e) => setValue(e.target.value)
  onClear ??= () => {
    setValue('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', className)} role={'relative'}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50 h-4 w-4" />
      <Input
        ref={inputRef}
        className="pl-9"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
      />
      {!!value && (
        <XIcon
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 active:opacity-80 h-4 w-4"
        />
      )}
    </div>
  )
}

export default SearchInput
