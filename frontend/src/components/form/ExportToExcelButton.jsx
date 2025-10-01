import { exportToExcel } from '@/lib/utils'
import { FileDown } from 'lucide-react'
import { Button } from '../ui/button'

const ExportToExcelButton = ({
  children,
  className,
  icon = true,
  data = [],
  filename = '',
  ...props
}) => {
  if (!data || data.length === 0) {
    return null
  }
  return (
    <Button
      className={className}
      variant="outline"
      onClick={() => {
        exportToExcel(data, filename)
      }}
      {...props}
    >
      {icon && <FileDown />}
      {children ?? 'Export to Excel'}
    </Button>
  )
}

export default ExportToExcelButton
