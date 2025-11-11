/**
 * AuthTest Component Examples
 * Real-world usage examples and integration patterns for the AuthTest component
 */

'use client'

import React, { useState } from 'react'
import { AuthTest } from './AuthTest'
import type { LineAuthTestResult } from '../types/playwright'

// Declare external services on the window object
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, eventParams?: Record<string, any>) => void
    Sentry?: {
      captureException: (error: Error, context?: Record<string, any>) => void
    }
  }
}

/**
 * Example 1: Basic Usage
 * Simple integration with minimal configuration
 */
export function BasicAuthTestExample() {
  const handleTestComplete = (result: LineAuthTestResult) => {
    console.log('Test completed:', result)

    // You can handle the test results here
    if (result.success) {
      alert(`✅ Test passed in ${result.duration}ms!`)
    } else {
      alert(`❌ Test failed: ${result.logs[result.logs.length - 1]}`)
    }
  }

  const handleTestError = (error: Error) => {
    console.error('Test error:', error)
    alert(`Test error: ${error.message}`)
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Basic Auth Test</h3>
      <AuthTest
        onComplete={handleTestComplete}
        onError={handleTestError}
      />
    </div>
  )
}

/**
 * Example 2: Advanced Integration with State Management
 * Shows how to integrate with application state and provide feedback
 */
export function AdvancedAuthTestExample() {
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [lastResult, setLastResult] = useState<LineAuthTestResult | null>(null)

  const handleTestStart = () => {
    setIsTestRunning(true)
    setLastResult(null)
  }

  const handleTestComplete = (result: LineAuthTestResult) => {
    setIsTestRunning(false)
    setLastResult(result)

    // Store results in localStorage for persistence
    localStorage.setItem('lastTestResult', JSON.stringify(result))

    // Trigger analytics or logging
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'auth_test_completed', {
        success: result.success,
        duration: result.duration,
        steps_passed: result.steps.filter(s => s.status === 'passed').length
      })
    }
  }

  const handleTestError = (error: Error) => {
    setIsTestRunning(false)

    // Log error to monitoring service
    console.error('Authentication test failed:', error)

    // You could send this to an error tracking service
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        tags: { component: 'AuthTest' }
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Advanced Auth Test</h3>
        <div className="flex items-center space-x-2">
          {isTestRunning && (
            <span className="text-sm text-blue-600 animate-pulse">
              Testing in progress...
            </span>
          )}
          {lastResult && (
            <span className={`text-sm font-medium ${
              lastResult.success ? 'text-green-600' : 'text-red-600'
            }`}>
              {lastResult.success ? '✅ Last test passed' : '❌ Last test failed'}
            </span>
          )}
        </div>
      </div>

      <AuthTest
        onComplete={handleTestComplete}
        onError={handleTestError}
        className="w-full"
      />

      {lastResult && (
        <div className={`p-4 rounded-lg border ${
          lastResult.success
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <h4 className="font-medium mb-2">Last Test Result</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Status:</span>
              <span className={`ml-2 font-medium ${
                lastResult.success ? 'text-green-600' : 'text-red-600'
              }`}>
                {lastResult.success ? 'Passed' : 'Failed'}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Duration:</span>
              <span className="ml-2 font-medium">{lastResult.duration}ms</span>
            </div>
            <div>
              <span className="text-gray-600">Steps:</span>
              <span className="ml-2 font-medium">
                {lastResult.steps.filter(s => s.status === 'passed').length}/{lastResult.steps.length}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Timestamp:</span>
              <span className="ml-2 font-medium">
                {new Date(Date.now() - lastResult.duration).toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Example 3: Dashboard Integration
 * Shows how to use the compact variant in a dashboard setting
 */
export function DashboardAuthTestExample() {
  const [testStats, setTestStats] = useState({
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    averageDuration: 0
  })

  const handleTestComplete = (result: LineAuthTestResult) => {
    setTestStats(prev => ({
      totalTests: prev.totalTests + 1,
      passedTests: result.success ? prev.passedTests + 1 : prev.passedTests,
      failedTests: result.success ? prev.failedTests : prev.failedTests + 1,
      averageDuration: Math.round(
        (prev.averageDuration * prev.totalTests + result.duration) / (prev.totalTests + 1)
      )
    }))
  }

  const successRate = testStats.totalTests > 0
    ? Math.round((testStats.passedTests / testStats.totalTests) * 100)
    : 0

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Dashboard Auth Testing</h3>

      {/* Test Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-3 rounded-lg border">
          <div className="text-2xl font-bold text-gray-900">{testStats.totalTests}</div>
          <div className="text-sm text-gray-600">Total Tests</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{testStats.passedTests}</div>
          <div className="text-sm text-green-700">Passed</div>
        </div>
        <div className="bg-red-50 p-3 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{testStats.failedTests}</div>
          <div className="text-sm text-red-700">Failed</div>
        </div>
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
          <div className="text-sm text-blue-700">Success Rate</div>
        </div>
      </div>

      {/* Compact Test Component */}
      <AuthTest
        variant="compact"
        onComplete={handleTestComplete}
        onError={(error) => console.error('Dashboard test error:', error)}
        className="w-full"
      />
    </div>
  )
}

/**
 * Example 4: Automated Testing Integration
 * Shows how to trigger tests automatically based on conditions
 */
export function AutomatedAuthTestExample() {
  const [autoTestEnabled, setAutoTestEnabled] = useState(false)
  const [testHistory, setTestHistory] = useState<LineAuthTestResult[]>([])

  // Auto-test trigger
  React.useEffect(() => {
    if (!autoTestEnabled) return

    const interval = setInterval(() => {
      console.log('Triggering automated auth test...')
      // In a real implementation, you would trigger the actual test here
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [autoTestEnabled])

  const handleTestComplete = (result: LineAuthTestResult) => {
    setTestHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 results
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Automated Testing</h3>
        <button
          onClick={() => setAutoTestEnabled(!autoTestEnabled)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            autoTestEnabled
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {autoTestEnabled ? 'Auto-Test Enabled' : 'Enable Auto-Test'}
        </button>
      </div>

      {autoTestEnabled && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
          <p className="text-sm text-green-800">
            ✅ Automated testing is active. Tests will run every 30 seconds.
          </p>
        </div>
      )}

      <AuthTest
        onComplete={handleTestComplete}
        onError={(error) => console.error('Automated test error:', error)}
      />

      {testHistory.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recent Test History</h4>
          <div className="space-y-2">
            {testHistory.map((result, index) => (
              <div
                key={`${result.duration}-${index}`}
                className={`p-2 rounded text-sm ${
                  result.success
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                <div className="flex justify-between">
                  <span>
                    {result.success ? '✅ Passed' : '❌ Failed'}
                  </span>
                  <span>{result.duration}ms</span>
                </div>
                <div className="text-xs opacity-75">
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Example 5: Custom Styling Integration
 * Shows how to customize the appearance with CSS classes
 */
export function CustomStyledAuthTestExample() {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Custom Styled Test</h3>

      <AuthTest
        onComplete={(result) => console.log('Custom test completed:', result)}
        onError={(error) => console.error('Custom test error:', error)}
        className="w-full max-w-2xl border-2 border-purple-200 rounded-xl shadow-lg"
      />

      <div className="mt-4 text-sm text-gray-600">
        <p>This example shows how to apply custom CSS classes to style the AuthTest component to match your application's design system.</p>
      </div>
    </div>
  )
}

/**
 * Main Examples Component
 * Renders all examples for easy testing and reference
 */
export default function AuthTestExamples() {
  const [activeExample, setActiveExample] = useState('basic')

  const examples = {
    basic: { component: BasicAuthTestExample, name: 'Basic Usage' },
    advanced: { component: AdvancedAuthTestExample, name: 'Advanced Integration' },
    dashboard: { component: DashboardAuthTestExample, name: 'Dashboard Integration' },
    automated: { component: AutomatedAuthTestExample, name: 'Automated Testing' },
    custom: { component: CustomStyledAuthTestExample, name: 'Custom Styling' }
  }

  const ActiveExample = examples[activeExample as keyof typeof examples].component

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AuthTest Component Examples
          </h1>
          <p className="text-gray-600">
            Real-world usage examples and integration patterns
          </p>
        </div>

        {/* Example Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow p-1 flex space-x-1">
            {Object.entries(examples).map(([key, { name }]) => (
              <button
                key={key}
                onClick={() => setActiveExample(key)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeExample === key
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Example */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <ActiveExample />
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Usage Tips</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Use the <code className="bg-blue-100 px-1 rounded">onComplete</code> callback to handle successful test results</li>
            <li>• Implement <code className="bg-blue-100 px-1 rounded">onError</code> for comprehensive error handling</li>
            <li>• Choose <code className="bg-blue-100 px-1 rounded">variant="compact"</code> for dashboard integration</li>
            <li>• Store test results for analytics and monitoring</li>
            <li>• Combine with automated testing for continuous validation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}