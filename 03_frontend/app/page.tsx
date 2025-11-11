'use client'

import { useEffect, useState } from 'react'
import liff from '@line/liff'
import { AppLayout } from '@/components/layout/AppLayout'
import { UserProfile } from '@/components/auth/UserProfile'
import { TrustBadge } from '@/components/trust/TrustBadge'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatCurrency, formatDateRelative } from '@/lib/utils'
import { User, SharingGroup } from '@/types/index'
import { LiffProfile } from '@/types/index'

const liffId = process.env.NEXT_PUBLIC_LIFF_ID || ''

type Profile = LiffProfile

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [liffReady, setLiffReady] = useState(false)
  const [featuredGroups, setFeaturedGroups] = useState<SharingGroup[]>([])

  useEffect(() => {
    async function initLiff() {
      try {
        await liff.init({ liffId })

        if (!liff.isLoggedIn()) {
          liff.login()
        } else {
          const userProfile = await liff.getProfile()
          setProfile(userProfile)

          // Convert to our User format
          const userData: User = {
            id: userProfile.userId, // Use LINE userId as the primary id
            display_name: userProfile.displayName,
            user_id: userProfile.userId,
            picture_url: userProfile.pictureUrl,
            status_message: userProfile.statusMessage,
            trust_score: 75, // Mock data
            is_verified: true, // Mock data
            status: 'active', // Mock data
            created_at: new Date().toISOString(), // Mock data
            badges: ['Verified', 'Trusted Member'] // Mock data
          }
          setUser(userData)

          // Mock featured groups
          const mockGroups: SharingGroup[] = []
          setFeaturedGroups(mockGroups)

          setLiffReady(true)
        }
      } catch (error) {
        console.error('LIFF initialization error:', error)
      }
    }
    initLiff()
  }, [])

  const handleLogout = () => {
    liff.logout()
    window.location.reload()
  }

  const getCategoryIcon = (category: string) => {
    if (category.includes('Streaming')) return '🎬'
    if (category.includes('AI')) return '🧠'
    if (category.includes('Gaming')) return '🎮'
    if (category.includes('Software')) return '💼'
    return '📦'
  }

  if (!liffReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgb(var(--color-bg-primary))]">
        <div className="text-center space-y-4">
          <LoadingSpinner size="xl" />
          <p className="text-[rgb(var(--color-text-secondary))]">Connecting to LINE...</p>
        </div>
      </div>
    )
  }

  return (
    <AppLayout
      headerTitle="ShareTrust"
      headerActions={
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      }
    >
      <div className="p-4 space-y-6">
        {/* User Profile Section */}
        {user && (
          <UserProfile
            user={user}
            size="lg"
            showBadges={true}
            showLevelProgress={true}
            className="bg-gradient-to-r from-[rgb(var(--color-brand-primary))]/5 to-[rgb(var(--color-brand-secondary))]/5"
          />
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card variant="default" padding="sm" className="text-center">
            <CardBody>
              <div className="text-2xl font-bold text-[rgb(var(--color-brand-primary))]">
                {featuredGroups.length}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                Available Groups
              </div>
            </CardBody>
          </Card>
          <Card variant="default" padding="sm" className="text-center">
            <CardBody>
              <div className="text-2xl font-bold text-[rgb(var(--color-success))]">
                {user?.trust_score || 0}
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                Trust Score
              </div>
            </CardBody>
          </Card>
          <Card variant="default" padding="sm" className="text-center">
            <CardBody>
              <div className="text-2xl font-bold text-[rgb(var(--color-brand-secondary))]">
                0
              </div>
              <div className="text-xs text-[rgb(var(--color-text-secondary))]">
                Active Groups
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Featured Sharing Groups */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[rgb(var(--color-text-primary))]">
              Featured Groups
            </h2>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {featuredGroups.map((group) => (
              <Card key={group.id} hover clickable>
                <CardBody>
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-lg">{getCategoryIcon(group.category)}</span>
                          <Badge variant="default" size="xs">
                            {group.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-[rgb(var(--color-text-primary))] mb-1">
                          {group.title}
                        </h3>
                        <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    {/* Creator Info */}
                    <div className="flex items-center space-x-2">
                      {group.creator.picture_url ? (
                        <img
                          src={group.creator.picture_url}
                          alt={group.creator.display_name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center text-xs">
                          {group.creator.display_name.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {group.creator.display_name}
                      </span>
                      <TrustBadge score={group.creator.trust_score || 0} size="xs" variant="compact" />
                      {group.creator.is_verified && (
                        <Badge variant="success" size="xs" rounded>
                          ✓
                        </Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-lg font-bold text-[rgb(var(--color-text-primary))]">
                          {formatCurrency(group.price_per_person, group.currency)}
                          <span className="text-xs text-[rgb(var(--color-text-secondary))] font-normal">
                            /month
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                            {group.current_members}/{group.max_members} members
                          </span>
                          <Badge
                            status={group.escrow_status}
                            size="xs"
                          >
                            {group.escrow_status}
                          </Badge>
                        </div>
                      </div>

                      <Button size="sm">
                        Join Group
                      </Button>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-[rgb(var(--color-bg-secondary))] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[rgb(var(--color-brand-primary))] transition-all duration-300"
                        style={{
                          width: `${(group.current_members / group.max_members) * 100}%`
                        }}
                      />
                    </div>

                    {/* Time Info */}
                    <div className="flex items-center justify-between text-xs text-[rgb(var(--color-text-tertiary))]">
                      <span>Created {formatDateRelative(group.created_at)}</span>
                      <span>Expires {formatDateRelative(group.expires_at)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Create New Group CTA */}
        <Card variant="elevated" className="bg-gradient-to-r from-[rgb(var(--color-brand-primary))] to-[rgb(var(--color-brand-secondary))] text-white">
          <CardBody className="text-center space-y-3">
            <h3 className="text-lg font-semibold">
              Start Sharing Today
            </h3>
            <p className="text-sm opacity-90">
              Create a new sharing group and start saving on subscriptions
            </p>
            <Button variant="secondary" size="lg" className="w-full">
              Create New Group
            </Button>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  )
}
