'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Modal } from '@/components/ui/Modal'
import {
  formatPrice,
  getCategoryIcon,
  validateFormData
} from '@/lib/utils'
import type { CreateGroupFormData } from '@/types'

const CATEGORIES = [
  { value: 'streaming', label: '🎬 Streaming', description: 'Netflix, Disney+, etc.' },
  { value: 'ai_tools', label: '🧠 AI Tools', description: 'ChatGPT, Midjourney, etc.' },
  { value: 'gaming', label: '🎮 Gaming', description: 'Game subscriptions, platforms' },
  { value: 'software', label: '💼 Software', description: 'Adobe, Microsoft, etc.' },
  { value: 'music', label: '🎵 Music', description: 'Spotify, Apple Music, etc.' },
  { value: 'news', label: '📰 News', description: 'News subscriptions' },
  { value: 'education', label: '📚 Education', description: 'Online courses, learning' },
  { value: 'productivity', label: '⚡ Productivity', description: 'Productivity tools' }
]

export default function CreateGroupPage() {
  const [formData, setFormData] = useState<CreateGroupFormData>({
    title: '',
    description: '',
    category: '',
    price_per_person: 0,
    currency: 'THB',
    max_members: 2,
    min_members: 2,
    expires_at: '',
    verification_required: true,
    auto_approve: false,
    subscription_url: '',
    tags: [],
    images: []
  })

  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleInputChange = (field: keyof CreateGroupFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.price_per_person <= 0) {
      newErrors.price_per_person = 'Price must be greater than 0'
    }

    if (formData.min_members < 2) {
      newErrors.min_members = 'Minimum 2 members required'
    }

    if (formData.max_members < formData.min_members) {
      newErrors.max_members = 'Maximum members must be greater than minimum'
    }

    if (!formData.expires_at) {
      newErrors.expires_at = 'Expiration date is required'
    } else {
      const expiryDate = new Date(formData.expires_at)
      const now = new Date()
      if (expiryDate <= now) {
        newErrors.expires_at = 'Expiration date must be in the future'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In real app, call API to create group
      console.log('Creating group:', formData)

      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to create group:', error)
      setErrors({ submit: 'Failed to create group. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const getSelectedCategory = () => {
    return CATEGORIES.find(cat => cat.value === formData.category)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Sharing Group</h1>
          <p className="text-gray-600">Create a new subscription sharing group</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Basic Information</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Netflix Premium 4K Sharing"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                  placeholder="Describe your subscription sharing group..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CATEGORIES.map(category => (
                    <button
                      key={category.value}
                      type="button"
                      className={`p-3 border rounded-lg text-center transition-colors ${
                        formData.category === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onClick={() => handleInputChange('category', category.value)}
                    >
                      <div className="text-lg mb-1">{category.label.split(' ')[0]}</div>
                      <div className="text-xs text-gray-600">{category.label.split(' ')[1]}</div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-red-600 text-sm mt-1">{errors.category}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Add tags (press Enter)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddTag}
                  >
                    Add
                  </Button>
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-gray-500 hover:text-red-600"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Pricing & Members */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Pricing & Members</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Person (THB) *
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={formData.price_per_person || ''}
                    onChange={(e) => handleInputChange('price_per_person', parseInt(e.target.value) || 0)}
                    error={errors.price_per_person}
                  />
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="THB">THB (Thai Baht)</option>
                    <option value="USD">USD (US Dollar)</option>
                    <option value="EUR">EUR (Euro)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Min Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Members *
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={formData.min_members}
                    onChange={(e) => handleInputChange('min_members', parseInt(e.target.value))}
                    error={errors.min_members}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 2 members required</p>
                </div>

                {/* Max Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Members *
                  </label>
                  <Input
                    type="number"
                    min="2"
                    max="10"
                    value={formData.max_members}
                    onChange={(e) => handleInputChange('max_members', parseInt(e.target.value))}
                    error={errors.max_members}
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum 10 members</p>
                </div>
              </div>

              {/* Monthly Revenue Display */}
              {formData.price_per_person > 0 && formData.min_members > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-green-800">
                    <span className="font-medium">Estimated Monthly Revenue:</span>{' '}
                    {formatPrice(formData.price_per_person * formData.min_members, formData.currency)}{' '}
                    - {formatPrice(formData.price_per_person * formData.max_members, formData.currency)}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Group Settings</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              {/* Expiration Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Group Expiration Date *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.expires_at}
                  onChange={(e) => handleInputChange('expires_at', e.target.value)}
                  error={errors.expires_at}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Group will be automatically closed if not filled by this date
                </p>
              </div>

              {/* Subscription URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subscription URL (Optional)
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/subscription"
                  value={formData.subscription_url}
                  onChange={(e) => handleInputChange('subscription_url', e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Link to the official subscription page
                </p>
              </div>

              {/* Verification Required */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="verification_required"
                  checked={formData.verification_required}
                  onChange={(e) => handleInputChange('verification_required', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="verification_required" className="text-sm font-medium text-gray-700">
                  Require identity verification
                </label>
              </div>
              <p className="text-xs text-gray-500 ml-7">
                Members must verify their identity before joining
              </p>

              {/* Auto Approve */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="auto_approve"
                  checked={formData.auto_approve}
                  onChange={(e) => handleInputChange('auto_approve', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="auto_approve" className="text-sm font-medium text-gray-700">
                  Auto-approve members
                </label>
              </div>
              <p className="text-xs text-gray-500 ml-7">
                Automatically approve join requests (not recommended for high-value groups)
              </p>
            </CardBody>
          </Card>

          {/* Error Display */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handlePreview}
            >
              Preview Group
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Create Group'}
            </Button>
          </div>
        </form>

        {/* Preview Modal */}
        {showPreview && (
          <Modal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            title="Group Preview"
          >
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{formData.title}</h3>
                {getSelectedCategory() && (
                  <Badge variant="default" size="sm" className="mt-2">
                    {getSelectedCategory()?.label}
                  </Badge>
                )}
              </div>

              <p className="text-gray-600">{formData.description}</p>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Price per person:</span>
                  <span className="font-semibold">
                    {formatPrice(formData.price_per_person, formData.currency)}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Members:</span>
                  <span>{formData.min_members}-{formData.max_members}</span>
                </div>
                <div className="flex justify-between">
                  <span>Expires:</span>
                  <span>{new Date(formData.expires_at).toLocaleDateString()}</span>
                </div>
              </div>

              {formData.tags && formData.tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="default" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowPreview(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowPreview(false)
                    document.querySelector('button[type="submit"]')?.click()
                  }}
                  className="flex-1"
                >
                  Create Group
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <Modal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            title="Group Created Successfully!"
          >
            <div className="space-y-4 text-center">
              <div className="text-green-600 text-4xl mb-4">✅</div>
              <h3 className="font-semibold text-lg">Your sharing group has been created!</h3>
              <p className="text-gray-600">
                Group "{formData.title}" is now live and waiting for members to join.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg text-left">
                <h4 className="font-medium mb-2">Next Steps:</h4>
                <ul className="space-y-1 text-sm text-blue-800">
                  <li>• Share your group link with potential members</li>
                  <li>• Monitor member join requests</li>
                  <li>• Funds will be held in escrow until group is full</li>
                  <li>• You'll receive payment when group reaches minimum members</li>
                </ul>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1"
                >
                  Create Another Group
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.location.href = '/browse'}
                  className="flex-1"
                >
                  View All Groups
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  )
}