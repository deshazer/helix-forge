import { exportToExcel, getErrorMessage } from '@/lib/utils'
import { FileDown } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

const ExportToExcelButton = ({
  children,
  className,
  loader,
  icon = true,
  data = [],
  filename = '',
  ...props
}) => {
  if ((!data || data.length === 0) && !loader) {
    return null
  }
  return (
    <Button
      className={className}
      variant="outline"
      onClick={async () => {
        if (loader && typeof loader === 'function') {
          try {
            const loadedData = await Promise.resolve(loader())
            if (!loadedData || loadedData.length === 0) {
              throw new Error('No data found.')
            }
            if (!Array.isArray(loadedData)) {
              throw new Error('Price history is not correctly formatted.')
            }
            return exportToExcel(loadedData, filename)
          } catch (error) {
            console.error(error)
            toast.error('Error loading data.', {
              description: getErrorMessage(error),
            })
          }
        } else {
          exportToExcel(data, filename)
        }
      }}
      {...props}
    >
      {icon && <FileDown />}
      {children ?? 'Export to Excel'}
    </Button>
  )
}

export default ExportToExcelButton
