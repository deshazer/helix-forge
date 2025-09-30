import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import RelativeDate from '@/components/ui/hover-date'
import Txt from '@/components/ui/typography'
import { authQueries, useAuthState } from '@/lib/auth/auth.query'
import { createFileRoute, Link } from '@tanstack/react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AlertCircleIcon, ChartSpline, ShieldCheck } from 'lucide-react'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/_authenticated/home')({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(authQueries.user())
  },
  component: HomeComponent,
})

function HomeComponent() {
  const { data: user } = useAuthState()

  const expirationDate = dayjs(user?.refresh_token_expires_at)
  const hasExpired = dayjs().isAfter(expirationDate)
  const isTokenValid = user?.has_schwab_token && !hasExpired

  return (
    <div className="flex flex-col gap-y-4">
      <Txt.h5 className="inline-flex items-center gap-x-2">
        <ChartSpline /> Welcome to Helix Forge!
      </Txt.h5>
      <div className="max-w-xl">
        {isTokenValid ? (
          <ValidTokenAlert expirationDate={expirationDate} />
        ) : hasExpired ? (
          <ExpiredTokenAlert />
        ) : (
          <NoTokenAlert />
        )}
      </div>
    </div>
  )
}

function ExpiredTokenAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>Token Expired</AlertTitle>
      <AlertDescription className="inline">
        Your Schwab token has expired. Please go to{' '}
        <Txt.link>
          <Link to="/settings">Settings</Link>
        </Txt.link>{' '}
        to connect.
      </AlertDescription>
    </Alert>
  )
}

function NoTokenAlert() {
  return (
    <Alert variant="destructive">
      <AlertCircleIcon />
      <AlertTitle>No Token</AlertTitle>
      <AlertDescription className="inline">
        You are not connected to Schwab. Please go to{' '}
        <Txt.link>
          <Link to="/settings">Settings</Link>
        </Txt.link>{' '}
        to connect.
      </AlertDescription>
    </Alert>
  )
}

function ValidTokenAlert({ expirationDate }) {
  return (
    <Alert variant="default">
      <ShieldCheck />
      <AlertTitle>Schwab Connection Status</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="flex flex-col gap-y-4">
          <div>✅ Your Schwab account is connected.</div>
          <div>
            🕛 Your token will expire <RelativeDate date={expirationDate} />
          </div>
          <div>
            <Txt.p>
              ⚙️ Go to{' '}
              <Txt.link>
                <Link to="/settings">Settings</Link>
              </Txt.link>{' '}
              to update your Schwab connection before expiration.
            </Txt.p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
}
