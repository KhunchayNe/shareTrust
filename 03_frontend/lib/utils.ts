import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

// Format currency for Thai Baht and other currencies
export function formatCurrency(amount: number, currency = 'THB'): string {
  return new Intl.NumberFormat(currency === 'THB' ? 'th-TH' : 'en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Format trust score with level
export function formatTrustScore(score: number): { score: number; level: number; levelName: string } {
  const level = Math.floor(score / 20) + 1
  const levelNames = ['New User', 'Basic Trust', 'Established', 'Trusted', 'Highly Trusted']
  const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)]

  return { score, level: Math.min(level, 5), levelName }
}

// Get trust level color class
export function getTrustLevelColor(level: number): string {
  const colors = [
    'rgb(var(--color-trust-level1))', // Gray - New user
    'rgb(var(--color-trust-level2))', // Yellow - Basic trust
    'rgb(var(--color-trust-level3))', // Blue - Established
    'rgb(var(--color-trust-level4))', // Green - Trusted
    'rgb(var(--color-trust-level5))', // Amber - Highly trusted
  ]
  return colors[Math.min(level - 1, colors.length - 1)]
}

// Format date relative to now
export function formatDateRelative(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return dateObj.toLocaleDateString()
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

// Validate phone number (Thai format)
export function validateThaiPhoneNumber(phone: string): boolean {
  const thaiPhoneRegex = /^(0[689]\d{8}|66[689]\d{8})$/
  return thaiPhoneRegex.test(phone.replace(/[-\s]/g, ''))
}

// Generate payment reference
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `ST${timestamp}${random}`.toUpperCase()
}

// Calculate escrow release percentage
export function calculateEscrowProgress(currentMembers: number, requiredMembers: number): number {
  return Math.min((currentMembers / requiredMembers) * 100, 100)
}

// Get escrow status color class
export function getEscrowStatusColor(status: string): string {
  const colors = {
    pending: 'rgb(var(--color-escrow-pending))',
    funded: 'rgb(var(--color-escrow-funded))',
    released: 'rgb(var(--color-escrow-released))',
    refunded: 'rgb(var(--color-escrow-refunded))'
  }
  return colors[status as keyof typeof colors] || 'rgb(var(--color-border-primary))'
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Debounce function
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}