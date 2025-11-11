"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { LineService } from "../../lib/line";
import {
  UserProfile,
  SharingGroup,
  Transaction,
  TrustEvent,
  ActivityCardProps,
  ProfileStatProps,
  UserBadge,
  Badge
} from "../../types";

import TrustProgress from "../../components/profile/TrustProgress";
import Badges from "../../components/profile/Badges";
import { ActivityList } from "../../components/profile/ActivityCard";
import { ProfileStatsGrid } from "../../components/profile/ProfileStats";
import TrustBadge from "../../components/TrustBadge";
import LoadingSpinner from "../../components/LoadingSpinner";

// Import icons from lucide-react
import {
  Home,
  Users,
  CreditCard,
  Settings,
  LogOut,
  Edit,
  Trophy,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  // State for additional data
  const [sharingGroups, setSharingGroups] = useState<SharingGroup[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [trustEvents, setTrustEvents] = useState<TrustEvent[]>([]);
  const [userBadges, setUserBadges] = useState<(UserBadge & { badge: Badge })[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loadingData, setLoadingData] = useState(true);

  // Load additional profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) return;

      try {
        setLoadingData(true);

        // Load sharing groups
        const { data: groupsData } = await supabase
          .from("sharing_groups")
          .select("*")
          .or(`creator_id.eq.${user.id},id.in.(select group_id from group_members where user_id = ${user.id})`)
          .order("created_at", { ascending: false });

        if (groupsData) {
          setSharingGroups(groupsData as SharingGroup[]);
        }

        // Load transactions
        const { data: transactionsData } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(10);

        if (transactionsData) {
          setTransactions(transactionsData as Transaction[]);
        }

        // Load trust events
        const { data: eventsData } = await supabase
          .from("trust_events")
          .select("*")
          .eq("profile_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (eventsData) {
          setTrustEvents(eventsData as TrustEvent[]);
        }

        // Load user badges
        const { data: badgesData } = await supabase
          .from("user_badges")
          .select(`
            *,
            badge:badges(*)
          `)
          .eq("profile_id", user.id);

        if (badgesData) {
          setUserBadges(badgesData as (UserBadge & { badge: Badge })[]);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Redirect if not authenticated
  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="กำลังโหลดข้อมูลโปรไฟล..." />
      </div>
    );
  }

  if (!user || !profile) {
    router.push("/");
    return null;
  }

  // Calculate stats
  const stats: ProfileStatProps[] = [
    {
      label: "Trust Score",
      value: profile.trust_score,
      icon: "⭐",
      color: "yellow",
    },
    {
      label: "Groups Created",
      value: sharingGroups.filter(g => g.creator_id === user.id).length,
      icon: <Users className="w-5 h-5" />,
      color: "blue",
    },
    {
      label: "Transactions",
      value: transactions.length,
      icon: <CreditCard className="w-5 h-5" />,
      color: "green",
    },
    {
      label: "Member Since",
      value: new Date(profile.created_at).toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
      }),
      icon: "📅",
      color: "purple",
    },
  ];

  // Prepare activity data
  const activities: ActivityCardProps[] = [
    ...transactions.slice(0, 5).map((transaction) => ({
      title: `Transaction ${transaction.type}`,
      description: `Payment of ${transaction.currency} ${transaction.amount}`,
      timestamp: transaction.created_at,
      type: "transaction" as const,
      status: transaction.status,
      amount: transaction.amount,
      currency: transaction.currency,
    })),
    ...sharingGroups.slice(0, 3).map((group) => ({
      title: group.title,
      description: group.description,
      timestamp: group.created_at,
      type: "group" as const,
      status: group.status,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

  // Calculate next level score
  const nextLevelScores = [5, 20, 50, 100];
  const nextLevelScore = profile.trust_level < 5 ? nextLevelScores[profile.trust_level - 1] : 100;

  const tabs = [
    { id: "overview", label: "ภาพรวม", icon: <Home className="w-4 h-4" /> },
    { id: "groups", label: "กลุ่มของฉัน", icon: <Users className="w-4 h-4" />, count: sharingGroups.length },
    { id: "transactions", label: "รายการ", icon: <CreditCard className="w-4 h-4" />, count: transactions.length },
    { id: "settings", label: "ตั้งค่า", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">โปรไฟลผู้ใช้</h1>
            <div className="flex items-center space-x-3">
              <button
                data-testid="home-button"
                onClick={() => router.push("/")}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                aria-label="Go to home"
              >
                <Home className="w-5 h-5" />
              </button>
              <button
                data-testid="edit-profile-button"
                onClick={() => router.push("/profile/edit")}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                aria-label="Edit profile"
              >
                <Edit className="w-4 h-4" />
                <span>แก้ไขโปรไฟล</span>
              </button>
              <button
                data-testid="logout-button"
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-4">
            <nav data-testid="profile-tabs" className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  data-testid={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div data-testid="user-avatar" className="flex-shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || "User"}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {(profile.display_name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {profile.display_name || "ผู้ใช้ ShareTrust"}
              </h2>

              {profile.email && (
                <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 2H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {profile.email}
                </p>
              )}

              <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                LINE ID: {profile.line_user_id?.substring(0, 8) || user.id.substring(0, 8)}...
              </p>

              {/* Trust Badge */}
              <div data-testid="trust-badge" className="mt-4 flex justify-center sm:justify-start">
                <TrustBadge
                  trustLevel={profile.trust_level}
                  trustScore={profile.trust_score}
                  isVerified={profile.is_verified}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div data-testid="profile-stats">
              <ProfileStatsGrid stats={stats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trust Progress */}
              <div data-testid="trust-progress-bar">
                <TrustProgress
                  currentScore={profile.trust_score}
                  currentLevel={profile.trust_level as any}
                  nextLevelScore={nextLevelScore}
                />
              </div>

              {/* Badges */}
              <div data-testid="badges-section">
                <Badges badges={userBadges} />
              </div>
            </div>

            {/* Recent Activity */}
            <div data-testid="recent-activity">
              <ActivityList
                activities={activities}
                title="Recent Activity"
                emptyMessage="No recent activity. Start by joining or creating a sharing group!"
              />
            </div>
          </div>
        )}

        {activeTab === "groups" && (
          <div className="space-y-8">
            <div data-testid="groups-list">
              <ActivityList
                activities={sharingGroups.map((group) => ({
                  title: group.title,
                  description: `${group.category} • ${group.current_members}/${group.max_members} members`,
                  timestamp: group.created_at,
                  type: "group" as const,
                  status: group.status,
                  amount: group.price_per_member,
                  currency: group.currency,
                }))}
                title="My Sharing Groups"
                emptyMessage="You haven't joined or created any groups yet"
                emptyIcon={<Users className="w-16 h-16 text-gray-400 mx-auto" />}
              />
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="space-y-8">
            <div data-testid="transactions-list">
              <ActivityList
                activities={transactions.map((transaction) => ({
                  title: `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} Transaction`,
                  description: `Payment method: ${transaction.payment_method}`,
                  timestamp: transaction.created_at,
                  type: "transaction" as const,
                  status: transaction.status,
                  amount: transaction.amount,
                  currency: transaction.currency,
                }))}
                title="Transaction History"
                emptyMessage="No transactions yet"
                emptyIcon={<CreditCard className="w-16 h-16 text-gray-400 mx-auto" />}
              />
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-8">
            <div data-testid="settings-panel" className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings</h3>
              <p className="text-gray-600">Profile settings and preferences coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}