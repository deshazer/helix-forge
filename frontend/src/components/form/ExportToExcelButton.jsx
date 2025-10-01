import { exportToExcel } from '@/lib/utils'
import { FileDown } from 'lucide-react'
import { Button } from '../ui/button'

const ExportToExcelButton = ({
  children,
  className,
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
      {children ?? (
        <>
          <FileDown /> Export to Excel
        </>
      )}
    </Button>
  )
}

export default ExportToExcelButton
