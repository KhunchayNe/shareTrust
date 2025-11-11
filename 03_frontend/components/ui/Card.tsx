import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hover = false, clickable = false, ...props }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-200'

    const variants = {
      default: 'bg-white border border-[rgb(var(--color-border-primary))]',
      outlined: 'bg-transparent border border-[rgb(var(--color-border-primary))]',
      elevated: 'bg-white shadow-card border border-[rgb(var(--color-border-primary))]',
      glass: 'glass-effect border border-white/20'
    }

    const paddings = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8'
    }

    const classes = cn(
      baseClasses,
      variants[variant],
      paddings[padding],
      hover && 'hover:shadow-lg hover:-translate-y-1',
      clickable && 'cursor-pointer active:scale-[0.98]',
      className
    )

    return (
      <div
        className={classes}
        ref={ref}
        {...props}
      />
    )
  }
)

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    const classes = cn('flex items-center justify-between mb-4 last:mb-0', className)
    return <div className={classes} ref={ref} {...props} />
  }
)

const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => {
    const classes = cn('flex-1', className)
    return <div className={classes} ref={ref} {...props} />
  }
)

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    const classes = cn('flex items-center justify-between mt-4 pt-4 border-t border-[rgb(var(--color-border-primary))] first:mt-0 first:pt-0 first:border-t-0', className)
    return <div className={classes} ref={ref} {...props} />
  }
)

Card.displayName = 'Card'
CardHeader.displayName = 'CardHeader'
CardBody.displayName = 'CardBody'
CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter }