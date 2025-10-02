import { getErrorMessage } from '@/lib/utils'
import { useEffect } from 'react'
import { toast } from 'sonner'

const useToastQueryError = (error, message) => {
  useEffect(() => {
    if (error) {
      console.error(error)
      toast.error(message ?? 'Unexpected Error', {
        description: getErrorMessage(error),
      })
    }
  }, [error])
}

export default useToastQueryError
