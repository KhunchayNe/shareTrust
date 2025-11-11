'use client'

import React from 'react'
import { AuthTest } from '../../components/AuthTest'
import { playwrightTestService } from '../../lib/playwright-test'
import type { LineAuthTestResult } from '../../types/playwright'

/**
 * Test page for LINE authentication flow
 * Demonstrates the AuthTest component with Playwright MCP integration
 */
export default function TestPage() {
  const handleTestComplete = (result: LineAuthTestResult) => {
    console.log('Authentication test completed:', result)

    if (result.success) {
      console.log('✅ All tests passed successfully!')
      console.log(`Total duration: ${result.duration}ms`)
      console.log(`Steps completed: ${result.steps.filter(s => s.status === 'passed').length}/${result.steps.length}`)

      if (result.userData) {
        console.log('LINE User Data:', result.userData)
      }

      if (result.profileData) {
        console.log('Profile Data:', result.profileData)
      }
    } else {
      console.error('❌ Tests failed')
      result.steps.filter(s => s.status === 'failed').forEach(step => {
        console.error(`- ${step.name}: ${step.error}`)
      })
    }
  }

  const handleTestError = (error: Error) => {
    console.error('Test execution error:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LINE Authentication Test Suite
          </h1>
          <p className="text-gray-600">
            Automated testing of LINE login flow and profile page integration using Playwright MCP
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Test Component */}
          <AuthTest
            onComplete={handleTestComplete}
            onError={handleTestError}
            className="w-full"
          />

          {/* Test Information Panel */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Test Coverage</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    LINE OAuth login flow
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    User profile page rendering
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    LINE user data integration
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Trust metrics display
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    Logout functionality
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Technical Details</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚙</span>
                    Playwright MCP integration
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚙</span>
                    Automated browser testing
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚙</span>
                    Real-time step monitoring
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚙</span>
                    Comprehensive error reporting
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2">⚙</span>
                    Performance metrics tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Manual Test Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Manual Testing Instructions</h3>

            <div className="space-y-4 text-sm text-blue-800">
              <div>
                <h4 className="font-medium mb-1">1. LINE Login Flow</h4>
                <p className="text-blue-700">Click the login button and complete LINE authentication. Verify you're redirected to the profile page.</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">2. Profile Data Display</h4>
                <p className="text-blue-700">Check that your LINE user data (name, avatar) and ShareTrust profile information are displayed correctly.</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">3. Trust Metrics</h4>
                <p className="text-blue-700">Verify trust score, level, and verification status are shown accurately.</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">4. LINE JWT Data</h4>
                <p className="text-blue-700">In development mode, check that LINE token data is displayed in the debug panel.</p>
              </div>

              <div>
                <h4 className="font-medium mb-1">5. Logout Functionality</h4>
                <p className="text-blue-700">Test the logout button and verify you're returned to the login screen.</p>
              </div>
            </div>
          </div>

          {/* Component Examples */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Component Variants</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Compact Variant</h3>
                <div className="max-w-md">
                  <AuthTest
                    variant="compact"
                    className="w-full"
                    onComplete={handleTestComplete}
                    onError={handleTestError}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}