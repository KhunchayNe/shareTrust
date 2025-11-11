'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BottomNavigation } from '@/components/layout/BottomNavigation'
import { UserProfileCompact } from '@/components/auth/UserProfile'
import {
  formatPrice,
  formatDateRelative,
  getCategoryIcon,
  getStatusColor
} from '@/lib/utils'
import type { SharingGroup } from '@/types'
import {
  Search,
  TrendingUp,
  Star,
  Users,
  Clock,
  ChevronRight,
  Flame
} from 'lucide-react'

const CATEGORIES = [
  { name: '🎬 Streaming', href: '/search?category=streaming', color: 'bg-red-100 text-red-700' },
  { name: '🧠 AI Tools', href: '/search?category=ai_tools', color: 'bg-blue-100 text-blue-700' },
  { name: '🎮 Gaming', href: '/search?category=gaming', color: 'bg-purple-100 text-purple-700' },
  { name: '🎵 Music', href: '/search?category=music', color: 'bg-green-100 text-green-700' },
]

const FEATURED_GROUPS: SharingGroup[] = [
  {
    id: '1',
    title: 'Netflix Premium 4K - Almost Full',
    description: 'Share Netflix Premium 4K with movie lovers. 4K HDR content, multiple screens.',
    category: 'streaming',
    price_per_person: 150,
    currency: 'THB',
    max_members: 4,
    current_members: 3,
    min_members: 3,
    creator_id: 'user1',
    creator: {
      id: 'user1',
      display_name: 'John Doe',
      user_id: 'line123',
      picture_url: 'https://via.placeholder.com/40',
      trust_score: 85,
      is_verified: true,
      status: 'active',
      badges: ['🔒 Trusted 50+', '✅ Verified']
    },
    escrow_status: 'pending',
    status: 'active',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    expires_at: '2024-02-15T10:00:00Z',
    tags: ['4K', 'HDR', '1 Spot Left!'],
    verification_required: true,
    auto_approve: false,
    members: [],
  },
  {
    id: '2',
    title: 'ChatGPT Plus - Last Spot',
    description: 'Get GPT-4 access with priority queue. Perfect for productivity and creativity.',
    category: 'ai_tools',
    price_per_person: 350,
    currency: 'THB',
    max_members: 2,
    current_members: 1,
    min_members: 2,
    creator_id: 'user2',
    creator: {
      id: 'user2',
      display_name: 'Sarah Chen',
      user_id: 'line456',
      picture_url: 'https://via.placeholder.com/40',
      trust_score: 92,
      is_verified: true,
      status: 'active',
      badges: ['⭐ Top Creator', '🔒 Trusted 50+']
    },
    escrow_status: 'pending',
    status: 'active',
    created_at: '2024-01-14T15:30:00Z',
    updated_at: '2024-01-14T15:30:00Z',
    expires_at: '2024-02-14T15:30:00Z',
    tags: ['GPT-4', 'AI', 'Last Chance'],
    verification_required: true,
    auto_approve: true,
    members: [],
  },
]

export default function HomePage() {
  const [user, setUser] = useState({
    display_name: 'Alex Johnson',
    picture_url: 'https://via.placeholder.com/40',
    trust_score: 75,
    is_verified: true,
  })

  const stats = {
    active_groups: 1247,
    total_members: 8234,
    money_saved: '฿2.3M',
    trust_score: user.trust_score || 0,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-1">ShareTrust</h1>
                <p className="text-blue-100">Save money, share subscriptions safely</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Your Trust Score</div>
                <div className="text-2xl font-bold">{stats.trust_score}</div>
              </div>
            </div>

            {/* Search Bar */}
            <Link href="/search">
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 flex items-center space-x-3 hover:bg-white/30 transition-colors cursor-pointer">
                <Search size={20} className="text-white/80" />
                <span className="text-white/80 font-medium">Search for sharing groups...</span>
                <ChevronRight size={20} className="text-white/60 ml-auto" />
              </div>
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="text-center">
              <CardBody>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.active_groups.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Active Groups</div>
              </CardBody>
            </Card>
            <Card className="text-center">
              <CardBody>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.total_members.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Happy Members</div>
              </CardBody>
            </Card>
            <Card className="text-center">
              <CardBody>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {stats.money_saved}
                </div>
                <div className="text-sm text-gray-600">Total Saved</div>
              </CardBody>
            </Card>
            <Card className="text-center">
              <CardBody>
                <div className="text-2xl font-bold text-orange-600 mb-1">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardBody>
            </Card>
          </div>

          {/* Categories */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Popular Categories</h2>
                <Link href="/browse" className="text-blue-600 text-sm hover:text-blue-700">
                  View All
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {CATEGORIES.map((category, index) => (
                  <Link
                    key={index}
                    href={category.href}
                    className={`${category.color} p-4 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer`}
                  >
                    <div className="text-2xl font-bold mb-2">{category.name.split(' ')[0]}</div>
                    <div className="text-sm font-medium">{category.name.split(' ')[1]}</div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Featured Groups */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Flame className="text-orange-500" size={20} />
                  <h2 className="text-lg font-semibold">Trending Groups</h2>
                </div>
                <Link href="/browse" className="text-blue-600 text-sm hover:text-blue-700">
                  See More
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {FEATURED_GROUPS.map((group) => (
                  <Link
                    key={group.id}
                    href={`/group/${group.id}`}
                    className="block hover:bg-gray-50 -mx-4 px-4 py-3 rounded-lg transition-colors"
                  >
                    <div className="flex space-x-4">
                      {/* Group Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-xl">
                          {getCategoryIcon(group.category)}
                        </div>
                      </div>

                      {/* Group Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {group.title}
                          </h3>
                          {group.current_members >= group.max_members - 1 && (
                            <Badge variant="warning" size="sm" rounded>
                              ⚡ {group.max_members - group.current_members} left
                            </Badge>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {group.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Users size={14} className="mr-1" />
                              {group.current_members}/{group.max_members}
                            </div>
                            <div className="flex items-center">
                              <Clock size={14} className="mr-1" />
                              {formatDateRelative(group.expires_at)}
                            </div>
                          </div>

                          <div className="font-semibold text-green-600">
                            {formatPrice(group.price_per_person, group.currency)}
                            <span className="text-gray-400 text-xs">/mo</span>
                          </div>
                        </div>

                        {/* Creator */}
                        <div className="mt-2">
                          <UserProfileCompact user={group.creator} />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Link href="/create">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="text-center py-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    {/* <PlusCircle size={24} className="text-blue-600" /> */}
                  </div>
                  <h3 className="font-semibold mb-1">Create Group</h3>
                  <p className="text-sm text-gray-600">Start sharing your subscription</p>
                </CardBody>
              </Card>
            </Link>

            <Link href="/browse">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardBody className="text-center py-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Search size={24} className="text-green-600" />
                  </div>
                  <h3 className="font-semibold mb-1">Browse All</h3>
                  <p className="text-sm text-gray-600">Explore all sharing groups</p>
                </CardBody>
              </Card>
            </Link>
          </div>

          {/* How It Works */}
          <Card className="mb-6">
            <CardHeader>
              <h2 className="text-lg font-semibold">How ShareTrust Works</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold mb-1">Find a Group</h3>
                  <p className="text-sm text-gray-600">Search and browse sharing groups</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold mb-1">Join Securely</h3>
                  <p className="text-sm text-gray-600">Payment protected by escrow system</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold mb-1">Share & Save</h3>
                  <p className="text-sm text-gray-600">Enjoy premium services at lower cost</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  )
}