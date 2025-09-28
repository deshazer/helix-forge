import { useFormContext } from '@/lib/form'

export default function Form({ children, ...props }) {
  const form = useFormContext()

  const handleSubmit = (e) => {
    e.preventDefault()
    e.stopPropagation()
    form.handleSubmit()
  }

  return (
    <form onSubmit={handleSubmit} {...props}>
      {children}
    </form>
  )
}
