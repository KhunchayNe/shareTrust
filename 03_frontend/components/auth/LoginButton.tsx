import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LoginButtonProps {
  onLogin: () => Promise<void>
  loading?: boolean
  disabled?: boolean
  className?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export const LoginButton: React.FC<LoginButtonProps> = ({
  onLogin,
  loading = false,
  disabled = false,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = true
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    if (isLoggingIn || loading || disabled) return

    try {
      setIsLoggingIn(true)
      await onLogin()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      loading={isLoggingIn || loading}
      disabled={disabled}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      className={className}
      leftIcon={
        !isLoggingIn && !loading ? (
          <svg
            className="w-5 h-5"
            viewBox="0 0 240 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M140 20.1c-5.4 0-9.5 3.4-9.5 8.3 0 4.1 3.3 6.6 9.2 7.4l2.2.3c3.2.4 4.2 1.1 4.2 2.6 0 1.7-1.7 2.7-4.5 2.7-3.2 0-4.4-1.1-4.8-3.3H133c.4 4.9 4.4 7.3 9.8 7.3 6 0 10.2-3.3 10.2-8.3 0-4.3-3.2-6.5-9.1-7.4l-2.2-.3c-3.2-.4-4.2-1.2-4.2-2.6 0-1.6 1.5-2.6 4.2-2.6 2.9 0 4.1 1.1 4.4 3.3h4.1c-.3-4.7-4.1-7.4-8.6-7.4zm-45.8.2v22.5h4.3v-8.8h7.4c6.4 0 10.4-3.7 10.4-9.4 0-5.8-4-9.4-10.4-9.4h-11.7zm4.3 4.2h7c3.9 0 6.2 1.9 6.2 5.3 0 3.3-2.3 5.2-6.2 5.2h-7v-10.5zm16.5 18.3h4.3V20.3h-4.3v22.5zm-68.3-11.3c0-6.5 5-11.5 11.8-11.5 4.2 0 7.7 1.9 9.5 5.1l-3.7 2.2c-1.2-2.1-3.4-3.3-5.8-3.3-4 0-7 3.2-7 7.5s3 7.5 7 7.5c2.4 0 4.6-1.2 5.8-3.3l3.7 2.2c-1.8 3.2-5.3 5.1-9.5 5.1-6.8 0-11.8-5-11.8-11.5zm39.8 0c0-6.5 5-11.5 11.8-11.5 4.2 0 7.7 1.9 9.5 5.1l-3.7 2.2c-1.2-2.1-3.4-3.3-5.8-3.3-4 0-7 3.2-7 7.5s3 7.5 7 7.5c2.4 0 4.6-1.2 5.8-3.3l3.7 2.2c-1.8 3.2-5.3 5.1-9.5 5.1-6.8 0-11.8-5-11.8-11.5z"
              fill="currentColor"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M220 50c11 0 20-9 20-20s-9-20-20-20-20 9-20 20 9 20 20 20z"
              fill="currentColor"
            />
            <path
              d="M220 10c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M20 50c11 0 20-9 20-20s-9-20-20-20S0 19 0 30s9 20 20 20z"
              fill="currentColor"
            />
            <path
              d="M15 25l5-5 5 5M15 35l5-5 5 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : undefined
      }
    >
      {isLoggingIn ? 'Connecting to LINE...' : 'Login with LINE'}
    </Button>
  )
}

export default LoginButton