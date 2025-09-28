import { Link } from '@tanstack/react-router'
import Logo from '../logo/Logo'
import LogoIcon from '../logo/LogoIcon'

const DefaultNotFound = () => {
  return (
    <div className="flex flex-col gap-y-4 h-screen items-center justify-center">
      <Link to="/">
        <Logo className="h-12" />
      </Link>
      <div>
        <h1 className="text-2xl font-bold">404</h1>
      </div>
      <h3>Page not found</h3>
    </div>
  )
}

export default DefaultNotFound
