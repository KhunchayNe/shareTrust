/**
 * Playwright Test Result Types
 * Type definitions for authentication flow testing results
 */

export interface PlaywrightTestStep {
  name: string
  status: 'passed' | 'failed' | 'skipped'
  duration: number
  error?: string
}

export interface PlaywrightTestResult {
  success: boolean
  duration: number
  steps: PlaywrightTestStep[]
  screenshots: string[]
  logs: string[]
}

export interface PlaywrightTestConfig {
  baseUrl: string
  headless?: boolean
  slowMo?: number
  timeout?: number
  viewport?: {
    width: number
    height: number
  }
}

export interface LineAuthTestResult extends PlaywrightTestResult {
  userData?: {
    lineUserId: string
    displayName: string
    pictureUrl?: string
    email?: string
  }
  profileData?: {
    trustScore: number
    trustLevel: number
    isVerified: boolean
    createdAt: string
  }
}

export type TestStatus = 'idle' | 'running' | 'completed' | 'error' | 'cancelled'