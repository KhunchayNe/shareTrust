import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  error?: string
  helper?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outlined'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    label,
    error,
    helper,
    leftIcon,
    rightIcon,
    variant = 'default',
    size = 'md',
    fullWidth = false,
    disabled,
    id,
    ...props
  }, ref) => {
    const inputId = id || `input-${React.useId()}`

    const baseClasses = 'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-border-focus))] disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      default: 'border border-[rgb(var(--color-border-primary))] bg-white focus:border-[rgb(var(--color-border-focus))]',
      filled: 'border-0 bg-[rgb(var(--color-bg-secondary))] focus:bg-white focus:ring-[rgb(var(--color-border-focus))]',
      outlined: 'border-2 border-[rgb(var(--color-border-primary))] bg-transparent focus:border-[rgb(var(--color-border-focus))]'
    }

    const sizes = {
      sm: 'text-sm px-3 py-2 rounded-lg',
      md: 'text-base px-4 py-2.5 rounded-lg',
      lg: 'text-lg px-5 py-3 rounded-xl'
    }

    const inputClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      leftIcon && 'pl-10',
      rightIcon && 'pr-10',
      error && 'border-[rgb(var(--color-border-error))] focus:border-[rgb(var(--color-border-error))] focus:ring-[rgb(var(--color-border-error))]',
      fullWidth && 'w-full',
      className
    )

    return (
      <div className={cn('space-y-1', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]">
              {leftIcon}
            </div>
          )}

          <input
            id={inputId}
            className={inputClasses}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[rgb(var(--color-text-tertiary))]">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-[rgb(var(--color-danger))] mt-1">
            {error}
          </p>
        )}

        {helper && !error && (
          <p className="text-sm text-[rgb(var(--color-text-tertiary))] mt-1">
            {helper}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }