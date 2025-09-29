import { Button } from '@/components/ui/button'
import Txt from '@/components/ui/typography'
import { authQueries } from '@/lib/auth/auth.query'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()

  async function getUser() {
    const user = await queryClient.fetchQuery(authQueries.user())
    setText(JSON.stringify(user, null, 2))
  }
  return (
    <div className="p-4 space-y-4">
      <Txt.h2>Settings</Txt.h2>
      <div className="flex flex-col space-y-6 w-min ">
        <Button onClick={getUser}>Get User</Button>
        <Button>Get Account</Button>
        <Button>Get Transactions</Button>
      </div>

      <pre className="flex flex-col space-y-2">
        <Txt.inlineCode className="p-4">{text || '...'}</Txt.inlineCode>
      </pre>
    </div>
  )
}
