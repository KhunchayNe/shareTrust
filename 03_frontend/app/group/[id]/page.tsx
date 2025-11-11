'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Modal from '@/components/ui/Modal'
import { UserProfile } from '@/components/auth/UserProfile'
import {
  formatPrice,
  formatDateRelative,
  formatTrustScore,
  getTrustLevelColor,
  getCategoryIcon,
  getStatusColor
} from '@/lib/utils'
import type { SharingGroup, GroupMember, User } from '@/types'
import {
  Users,
  Clock,
  Shield,
  Star,
  Share2,
  Heart,
  MessageCircle,
  Calendar,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'

export default function GroupDetailPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.id as string

  const [group, setGroup] = useState<SharingGroup | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  // Mock group data
  const mockGroup: SharingGroup = {
    id: groupId,
    title: 'Netflix Premium 4K - 2 Spots Left',
    description: 'Share Netflix Premium 4K plan with movie lovers! This subscription includes unlimited streaming in 4K Ultra HD and HDR quality. You can watch on 4 screens simultaneously and download content for offline viewing. Perfect for families or roommates who love movies and series.',
    category: 'streaming',
    price_per_person: 150,
    currency: 'THB',
    max_members: 4,
    current_members: 2,
    min_members: 3,
    creator_id: 'user1',
    creator: {
      id: 'user1',
      display_name: 'John Doe',
      user_id: 'line123',
      picture_url: 'https://via.placeholder.com/80',
      trust_score: 85,
      is_verified: true,
      status: 'active',
      badges: ['🔒 Trusted 50+', '✅ Verified', '🏆 Top Creator'],
      email: 'john.doe@example.com',
      created_at: '2024-01-01T00:00:00Z'
    },
    escrow_status: 'pending',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    expires_at: '2024-02-15T10:00:00Z',
    renewal_date: '2024-02-15T10:00:00Z',
    subscription_url: 'https://www.netflix.com/th/',
    tags: ['4K', 'HDR', 'Multiple Screens', 'HD Ready', 'Offline Downloads'],
    verification_required: true,
    auto_approve: false,
    members: [
      {
        id: 'member1',
        group_id: groupId,
        user_id: 'user1',
        user: {
          id: 'user1',
          display_name: 'John Doe',
          user_id: 'line123',
          picture_url: 'https://via.placeholder.com/40',
          trust_score: 85,
          is_verified: true,
          status: 'active'
        },
        status: 'active',
        joined_at: '2024-01-15T10:00:00Z',
        payment_status: 'paid',
        role: 'creator'
      },
      {
        id: 'member2',
        group_id: groupId,
        user_id: 'user2',
        user: {
          id: 'user2',
          display_name: 'Sarah Wilson',
          user_id: 'line456',
          picture_url: 'https://via.placeholder.com/40',
          trust_score: 72,
          is_verified: true,
          status: 'active'
        },
        status: 'active',
        joined_at: '2024-01-16T14:00:00Z',
        payment_status: 'paid',
        role: 'member'
      }
    ],
    subscription_details: {
      service_name: 'Netflix',
      plan_name: 'Premium 4K',
      features: [
        '4K Ultra HD streaming',
        'HDR content',
        '4 simultaneous screens',
        'Unlimited downloads',
        'All content libraries',
        'No ads'
      ],
      original_price: 599,
      savings_percentage: 75,
      renewal_frequency: 'monthly'
    },
    requirements: {
      min_trust_level: 2,
      verification_required: true,
      age_restriction: 18,
      location_restriction: ['Thailand']
    }
  }

  useEffect(() => {
    const loadGroup = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setGroup(mockGroup)
      } catch (error) {
        console.error('Failed to load group:', error)
        router.push('/browse')
      } finally {
        setLoading(false)
      }
    }

    if (groupId) {
      loadGroup()
    }
  }, [groupId, router])

  const handleJoinGroup = () => {
    setShowJoinModal(true)
  }

  const confirmJoinGroup = () => {
    console.log('Joining group:', groupId)
    setShowJoinModal(false)
    // In real app: call API to join group
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // In real app: call API to like/unlike group
  }

  const copyShareLink = () => {
    const url = window.location.href
    navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  }

  const getCategoryLabel = (category: string) => {
    const categories = {
      streaming: '🎬 Streaming',
      ai_tools: '🧠 AI Tools',
      gaming: '🎮 Gaming',
      software: '💼 Software',
      music: '🎵 Music',
      news: '📰 News',
      education: '📚 Education',
      productivity: '⚡ Productivity'
    }
    return categories[category as keyof typeof categories] || category
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Group not found</h2>
          <Button onClick={() => router.push('/browse')}>Back to Browse</Button>
        </div>
      </div>
    )
  }

  const progressPercentage = (group.current_members / group.max_members) * 100
  const isNearlyFull = progressPercentage >= 75
  const spotsLeft = group.max_members - group.current_members

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-lg font-semibold">Group Details</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Group Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Group Header */}
            <Card>
              <CardBody>
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center text-2xl">
                    {getCategoryIcon(group.category)}
                  </div>
                  <div className="flex-1">
                    <h1 className="text-xl font-bold text-gray-900 mb-2">{group.title}</h1>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="default">
                        {getCategoryLabel(group.category)}
                      </Badge>
                      {group.verification_required && (
                        <Badge variant="warning">
                          <Shield size={14} className="mr-1" />
                          Verification Required
                        </Badge>
                      )}
                      {isNearlyFull && (
                        <Badge variant="warning">
                          ⚡ Only {spotsLeft} spots left!
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {group.tags?.map((tag, index) => (
                        <Badge key={index} variant="default" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    className="flex-1"
                    disabled={group.current_members >= group.max_members}
                    onClick={handleJoinGroup}
                  >
                    {group.current_members >= group.max_members ? 'Group Full' : 'Join Group'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleLike}
                    className={isLiked ? 'text-red-600' : ''}
                  >
                    <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
                  </Button>
                  <Button variant="secondary" onClick={handleShare}>
                    <Share2 size={18} />
                  </Button>
                  <Button variant="secondary">
                    <MessageCircle size={18} />
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Description</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 whitespace-pre-wrap">{group.description}</p>
              </CardBody>
            </Card>

            {/* Subscription Details */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Subscription Details</h2>
              </CardHeader>
              <CardBody>
                {group.subscription_details && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service</span>
                      <span className="font-semibold">{group.subscription_details.service_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Plan</span>
                      <span className="font-semibold">{group.subscription_details.plan_name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Original Price</span>
                      <span className="line-through text-gray-400">
                        {formatPrice(group.subscription_details.original_price, group.currency)}/month
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Your Price</span>
                      <span className="font-semibold text-green-600">
                        {formatPrice(group.price_per_person, group.currency)}/month
                      </span>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-green-800 text-sm font-medium">
                        💰 You save {group.subscription_details.savings_percentage}% per month!
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium mb-2">Features:</h3>
                      <ul className="space-y-1">
                        {group.subscription_details.features.map((feature, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <CheckCircle size={14} className="mr-2 text-green-600" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {group.subscription_url && (
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => window.open(group.subscription_url, '_blank')}
                      >
                        View Original Subscription
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* Requirements */}
            {group.requirements && (
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Requirements</h2>
                </CardHeader>
                <CardBody>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Shield size={18} className="text-blue-600" />
                      <span className="text-sm">
                        Minimum trust level: {group.requirements.min_trust_level}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-sm">
                        Identity verification: {group.requirements.verification_required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    {group.requirements.age_restriction && (
                      <div className="flex items-center space-x-2">
                        <Calendar size={18} className="text-orange-600" />
                        <span className="text-sm">
                          Age restriction: {group.requirements.age_restriction}+ years
                        </span>
                      </div>
                    )}
                    {group.requirements.location_restriction && (
                      <div className="flex items-center space-x-2">
                        <AlertCircle size={18} className="text-red-600" />
                        <span className="text-sm">
                          Location: {group.requirements.location_restriction.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column - Status & Members */}
          <div className="space-y-6">
            {/* Group Status */}
            <Card>
              <CardBody className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {formatPrice(group.price_per_person, group.currency)}
                  </div>
                  <div className="text-sm text-gray-600">per person per month</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Members</span>
                    <span className="font-medium">
                      {group.current_members}/{group.max_members}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-600">
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <Badge variant={getStatusColor(group.status)} size="sm">
                      {group.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span>{formatDateRelative(group.expires_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment</span>
                    <Badge variant="info" size="sm">
                      <Shield size={14} className="mr-1" />
                      Escrow Protected
                    </Badge>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Group Creator */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Group Creator</h2>
              </CardHeader>
              <CardBody>
                <UserProfile
                  user={group.creator}
                  size="md"
                  showBadges={true}
                  showLevelProgress={true}
                />
                <div className="mt-4 flex space-x-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    <MessageCircle size={16} className="mr-1" />
                    Message
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    <Star size={16} className="mr-1" />
                    View Profile
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Members */}
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold">Members ({group.current_members})</h2>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {group.members.map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {member.user.picture_url ? (
                          <img
                            src={member.user.picture_url}
                            alt={member.user.display_name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold">
                            {member.user.display_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium">{member.user.display_name}</div>
                          <div className="text-xs text-gray-500">
                            Joined {formatDateRelative(member.joined_at)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={member.role === 'creator' ? 'success' : 'default'}
                          size="xs"
                        >
                          {member.role}
                        </Badge>
                        <Badge variant="success" size="xs">
                          Paid
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Join Group Modal */}
      {showJoinModal && (
        <Modal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          title="Join Sharing Group"
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{group.description}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium">Group Details:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Price: {formatPrice(group.price_per_person, group.currency)}/month</li>
                <li>• Members: {group.current_members}/{group.max_members}</li>
                <li>• Payment via Escrow (Protected)</li>
                <li>• Full refund if group doesn't reach minimum members</li>
              </ul>
            </div>

            {group.requirements && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Requirements:</h4>
                <ul className="space-y-1 text-sm text-yellow-800">
                  {group.requirements.min_trust_level && (
                    <li>• Trust level {group.requirements.min_trust_level}+ required</li>
                  )}
                  {group.requirements.verification_required && (
                    <li>• Identity verification required</li>
                  )}
                  {group.requirements.age_restriction && (
                    <li>• Age {group.requirements.age_restriction}+ required</li>
                  )}
                </ul>
              </div>
            )}

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Process:</h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li>• Your payment will be held securely in escrow</li>
                <li>• Funds are released when group is complete</li>
                <li>• Auto-refund if group doesn't fill in time</li>
                <li>• You'll receive login credentials once active</li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                className="flex-1"
                onClick={confirmJoinGroup}
              >
                Confirm & Join Group
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowJoinModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share Group"
        >
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
              <p className="text-gray-600">Share this sharing group with others</p>
            </div>

            <Button
              variant="primary"
              className="w-full"
              onClick={copyShareLink}
            >
              <Share2 size={18} className="mr-2" />
              Copy Link
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" className="flex-1">
                Share on LINE
              </Button>
              <Button variant="secondary" className="flex-1">
                Share on Facebook
              </Button>
            </div>

            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setShowShareModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  )
}