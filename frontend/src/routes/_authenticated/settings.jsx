import { Button } from '@/components/ui/button'
import Txt from '@/components/ui/typography'
import { useAppForm } from '@/lib/form'
import {
  useSchwabAuthInit,
  useSchwabGenerateTokenMutation,
} from '@/lib/schwab/schwab.query'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute } from '@tanstack/react-router'
import { ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import z from 'zod'

export const Route = createFileRoute('/_authenticated/settings')({
  component: SettingsComponent,
})

function SettingsComponent() {
  const { data: auth } = useSchwabAuthInit()

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
        <Txt.h4>Connect to Schwab</Txt.h4>
        <Txt.muted>Note: You will have to do this every 7 days.</Txt.muted>
        <Txt.small>
          Click the button below to open a new tab to login to Schwab.
        </Txt.small>
        <Button onClick={schwabAuth}>
          Authenticate with Schwab <ExternalLink />
        </Button>
        <Txt.small>
          When you're finished approving access, you'll end up at an error page.
        </Txt.small>
        <Txt.small>
          Copy/paste whatever shows up in the URL of that error page into the
          field below and click "Generate Schwab Token".
        </Txt.small>
        <form.AppForm>
          <form.Form className="flex flex-col space-y-4  mb-12">
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
      </div>
    </div>
  )
}
