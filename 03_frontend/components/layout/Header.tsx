import React from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface HeaderProps {
  title?: string
  actions?: React.ReactNode
  onBack?: () => void
  transparent?: boolean
  sticky?: boolean
  className?: string
}

export const Header: React.FC<HeaderProps> = ({
  title,
  actions,
  onBack,
  transparent = false,
  sticky = true,
  className
}) => {
  const headerClasses = cn(
    'sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-white border-b border-[rgb(var(--color-border-primary))]',
    transparent && 'bg-transparent border-transparent',
    sticky && 'backdrop-blur-md bg-white/95',
    className
  )

  return (
    <header className={headerClasses}>
      {/* Left Section - Back Button or Logo */}
      <div className="flex items-center">
        {onBack ? (
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="p-2 mr-2"
            aria-label="Go back"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
        ) : (
          <div className="w-9" /> // Spacer for alignment
        )}

        {title && (
          <h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] truncate">
            {title}
          </h1>
        )}
      </div>

      {/* Center Section - Title (if no back button) */}
      {!onBack && title && !actions && (
        <div className="absolute left-0 right-0 text-center">
          <h1 className="text-lg font-semibold text-[rgb(var(--color-text-primary))] truncate px-16">
            {title}
          </h1>
        </div>
      )}

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        {actions}
      </div>
    </header>
  )
}

export default Header