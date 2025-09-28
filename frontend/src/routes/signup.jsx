import DefaultError from '@/components/error/DefaultError'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/signup')({ component: SignUpComponent })

function SignUpComponent() {
  return <DefaultError error={{ message: 'This page is under construction' }} />
}
