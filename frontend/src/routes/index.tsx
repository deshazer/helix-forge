import Logo from '@/components/logo/Logo'
import LogoIcon from '@/components/logo/LogoIcon'
import { Button } from '@/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <header className="flex gap-y-4 w-full py-3 px-8 bg-card items-center justify-between">
      <div className="">
        <Link to="/">
          <Logo className="hidden sm:block" />
          <LogoIcon className="sm:hidden" />
        </Link>
      </div>
      <div className="flex gap-x-4">
        <Button variant="secondary" asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
        <Button asChild>
          <Link to="/login">Login</Link>
        </Button>
      </div>
    </header>
  )
}
