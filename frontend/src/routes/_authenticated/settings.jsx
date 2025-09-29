import { Button } from '@/components/ui/button'
import Txt from '@/components/ui/typography'
import { authQueries } from '@/lib/auth/auth.query'
import { useAppForm } from '@/lib/form'
import {
  schwabQueries,
  useSchwabAuthInit,
  useSchwabGenerateTokenMutation,
} from '@/lib/schwab/schwab.query'
import { getErrorMessage } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import z from 'zod'

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  const [text, setText] = useState('')
  const queryClient = useQueryClient()

  const { data: auth } = useSchwabAuthInit()

  async function getUser() {
    const user = await queryClient.fetchQuery(authQueries.user())
    setText(JSON.stringify(user, null, 2))
  }

  async function getAccounts() {
    try {
      const accounts = await queryClient.fetchQuery(schwabQueries.accounts())
      setText(JSON.stringify(accounts, null, 2))
    } catch (error) {
      console.error(error, getErrorMessage(error))
      toast.error('Error getting schwab accounts.', {
        description: getErrorMessage(error),
      })
    }
  }

  async function schwabAuth() {
    const url = auth?.auth_url
    if (url) {
      window.open(url)
    } else {
      toast.error('No schwab auth url found')
    }
  }

  const { mutateAsync: schwabGenerateToken } = useSchwabGenerateTokenMutation()
  const form = useAppForm({
    defaultValues: { url: '' },
    validators: {
      onSubmit: z.object({ url: z.url() }),
      onSubmitAsync: async ({ value }) => {
        try {
          const url = new URL(value?.url)
          const code = url.searchParams.get('code')

          if (code) {
            await schwabGenerateToken(code)
          } else {
            toast.error('Unable to determine code from URL.')
          }
        } catch (error) {
          console.error(error)
          toast.error('Error generating schwab token.', {
            description: getErrorMessage(error),
          })
        }
      },
    },
  })

  return (
    <div className="p-4 space-y-4">
      <Txt.h2>Settings</Txt.h2>
      <div className="flex flex-col space-y-6 w-min ">
        <Button onClick={getUser}>Get User</Button>
        <Button onClick={schwabAuth}>Schwab Auth</Button>
        <Txt.p>
          When you're finished authenticating, you'll finish at an error page.
        </Txt.p>
        <Txt.p>We want the URL of this error page!</Txt.p>
        <form.AppForm>
          <form.Form className="flex flex-col space-y-4 mt-4 mb-12">
            <form.AppField name="url" label="URL">
              {(field) => (
                <field.TextInput
                  className="min-w-md"
                  label="URL"
                  placeholder="https://127.0.0.1/?code=...&session=..."
                />
              )}
            </form.AppField>
            <form.SubmitButton>Generate Schwab Token</form.SubmitButton>
          </form.Form>
        </form.AppForm>
        <Button onClick={getAccounts}>Get Accounts</Button>
        <Button>Get Transactions</Button>
      </div>

      <pre className="flex flex-col space-y-2">
        <Txt.inlineCode className="p-4">{text || '...'}</Txt.inlineCode>
      </pre>
    </div>
  )
}
