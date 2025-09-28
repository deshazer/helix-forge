import { Button } from '@/components/ui/button'
import axios from '@/lib/axios'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_authenticated/home')({ component: RouteComponent })

function RouteComponent() {
  const navigate = useNavigate()

  const logout = async () => {
    try {
      await axios.post('/logout/')
      toast.success('Logout successful')
      navigate({ to: '/login' })
    } catch (error) {
      if (
        error?.response?.status === 401 &&
        error?.response?.data?.code === 'token_not_valid'
      ) {
        toast.success('Logout successful')
        navigate({ to: '/login' })
        return
      }
      toast.error('Logout failed')
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col gap-y-4 w-full py-3 px-8 bg-card justify-end">
      <Button className="w-min" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}
