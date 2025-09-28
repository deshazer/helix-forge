/**
 * https://ui.shadcn.com/docs/components/typography
 */
import { cn } from '@/lib/utils'

const Txt = () => {
  throw new Error('Use a specific Text variant, e.g. <Text.h1>')
}

Txt.h1 = ({ children, className = '', ...props }) => (
  <h1
    className={cn(
      'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      className,
    )}
    {...props}
  >
    {children}
  </h1>
)
Txt.h2 = ({ children, className = '', ...props }) => (
  <h2
    className={cn(
      'scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0',
      className,
    )}
    {...props}
  >
    {children}
  </h2>
)
Txt.h3 = ({ children, className = '', ...props }) => (
  <h3
    className={cn(
      'scroll-m-20 text-2xl font-semibold tracking-tight',
      className,
    )}
    {...props}
  >
    {children}
  </h3>
)
Txt.h4 = ({ children, className = '', ...props }) => (
  <h4
    className={cn(
      'scroll-m-20 text-xl font-semibold tracking-tight',
      className,
    )}
    {...props}
  >
    {children}
  </h4>
)

Txt.h5 = ({ children, className = '', ...props }) => (
  <h5
    className={cn(
      'scroll-m-20 text-lg font-semibold tracking-tight',
      className,
    )}
    {...props}
  >
    {children}
  </h5>
)

Txt.p = ({ children, className = '', ...props }) => (
  <p
    className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
    {...props}
  >
    {children}
  </p>
)

Txt.blockquote = ({ children, className = '', ...props }) => (
  <blockquote
    className={cn('mt-6 border-l-2 pl-6 italic', className)}
    {...props}
  >
    {children}
  </blockquote>
)

Txt.inlineCode = ({ children, className = '', ...props }) => (
  <code
    className={cn(
      'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      className,
    )}
    {...props}
  >
    {children}
  </code>
)

Txt.lead = ({ children, className = '', ...props }) => (
  <p className={cn('text-xl text-muted-foreground', className)} {...props}>
    {children}
  </p>
)

Txt.large = ({ children, className = '', ...props }) => (
  <span className={cn('text-lg font-semibold', className)} {...props}>
    {children}
  </span>
)

Txt.small = ({ children, className = '', ...props }) => (
  <small
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
  >
    {children}
  </small>
)

Txt.muted = ({ children, className = '', ...props }) => (
  <span className={cn('text-sm text-muted-foreground', className)} {...props}>
    {children}
  </span>
)

Txt.link = ({ children, className = '', ...props }) => (
  <span
    className={cn('underline underline-offset-4 hover:opacity-80', className)}
    {...props}
  >
    {children}
  </span>
)

Txt.hoverLink = ({ children, className = '', ...props }) => (
  <span
    className={cn('hover:underline underline-offset-4', className)}
    {...props}
  >
    {children}
  </span>
)
export default Txt
