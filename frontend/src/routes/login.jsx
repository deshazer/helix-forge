import Logo from '@/components/logo/Logo'
import { useLoginMutation } from '@/lib/auth/auth.query'
import { useAppForm } from '@/lib/form'
import { getErrorMessage } from '@/lib/utils'
import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import z from 'zod'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

export const Route = createFileRoute('/login')({ component: LoginComponent })

function LoginComponent() {
  const { mutateAsync: login } = useLoginMutation()
  const form = useAppForm({
    defaultValues: { email: '', password: '' },
    validators: {
      onSubmit: z.object({
        email: z.email('Invalid email'),
        password: z
          .string('Password is required')
          .min(8, 'Minimum 8 characters'),
      }),
      onSubmitAsync: async ({ value }) => {
        try {
          await login(value)
        } catch (error) {
          console.log(error)
          toast.error('Login failed', { description: getErrorMessage(error) })
        }
      },
    },
  })

  return (
    <div className="flex flex-col space-y-8 justify-center items-center h-screen">
      <Link to="/">
        <Logo />
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form.Form className="flex flex-col gap-4 min-w-[350px]">
              <form.AppField name="email">
                {(field) => (
                  <field.TextInput
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                  />
                )}
              </form.AppField>
              <form.AppField name="password">
                {(field) => (
                  <field.TextInput
                    type="password"
                    placeholder="Password"
                    autoComplete="password"
                  />
                )}
              </form.AppField>
              <form.SubmitButton>Login</form.SubmitButton>
            </form.Form>
          </form.AppForm>
        </CardContent>
      </Card>
    </div>
  )
}
