import { getErrorMessage } from '@/lib/utils'
import LogoIcon from '@/components/logo/LogoIcon'
import Txt from '@/components/ui/typography'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '../ui/button'

const DefaultError = ({ error, reset }) => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-y-4 h-screen items-center justify-center mx-auto max-w-2xl py-4">
      <div className="flex items-center gap-x-4">
        <LogoIcon className="size-12 flex-none fill-primary" />
        <Txt.h1>Uh oh</Txt.h1>
      </div>
      <Txt.h3>An error has occurred.</Txt.h3>
      <Txt.inlineCode className="max-w-lg overflow-auto">
        Error: {getErrorMessage(error)}
      </Txt.inlineCode>
      <Button
        onClick={() => {
          reset?.()
          navigate({ to: '/' })
        }}
      >
        Go Back
      </Button>
    </div>
  )
}

export default DefaultError
