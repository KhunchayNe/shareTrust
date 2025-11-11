import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'

    const variants = {
      primary: 'bg-[rgb(var(--color-brand-primary))] hover:bg-[rgb(var(--color-brand-primary))] text-white focus:ring-[rgb(var(--color-brand-primary))]',
      secondary: 'bg-[rgb(var(--color-brand-secondary))] hover:bg-[rgb(var(--color-brand-secondary))] text-white focus:ring-[rgb(var(--color-brand-secondary))]',
      outline: 'border border-[rgb(var(--color-border-primary))] bg-transparent hover:bg-[rgb(var(--color-bg-secondary))] focus:ring-[rgb(var(--color-border-focus))]',
      ghost: 'hover:bg-[rgb(var(--color-bg-secondary))] focus:ring-[rgb(var(--color-border-focus))]',
      link: 'text-[rgb(var(--color-brand-primary))] hover:underline focus:ring-[rgb(var(--color-brand-primary))]',
      danger: 'bg-[rgb(var(--color-danger))] hover:bg-[rgb(var(--color-danger))] text-white focus:ring-[rgb(var(--color-danger))]'
    }

    const sizes = {
      xs: 'text-xs px-2 py-1 rounded-md min-h-[32px]',
      sm: 'text-sm px-3 py-1.5 rounded-lg min-h-[36px]',
      md: 'text-base px-4 py-2 rounded-lg min-h-[40px]',
      lg: 'text-lg px-6 py-3 rounded-lg min-h-[44px]',
      xl: 'text-xl px-8 py-4 rounded-xl min-h-[48px]'
    }

    const classes = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      fullWidth && 'w-full',
      loading && 'opacity-75 cursor-wait',
      className
    )

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }