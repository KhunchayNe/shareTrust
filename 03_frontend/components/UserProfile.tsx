"use client";

import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { LineService } from "../lib/line";
import TrustBadge from "./TrustBadge";
import LoadingSpinner from "./LoadingSpinner";

// Enhanced LINE user data from JWT token
interface LineUserProfile {
  iss?: string;
  sub?: string;
  aud?: string;
  exp?: number;
  iat?: number;
  amr?: string[];
  name?: string;
  picture?: string;
  email?: string;
  [key: string]: unknown;
}

// Enhanced ShareTrust profile data
interface UserProfile {
  id: string;
  line_user_id?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  trust_level: number;
  trust_score: number;
  is_verified: boolean;
  verification_data?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// Component props
interface UserProfileProps {
  className?: string;
  onEditProfile?: () => void;
  onLogout?: () => void;
}

// Action button component
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
}

function ActionButton({
  onClick,
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
}: ActionButtonProps) {
  const baseClasses = "font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center gap-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 disabled:bg-gray-100",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:border-gray-200",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
      )}
      {children}
    </button>
  );
}

// Profile stat component
interface ProfileStatProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: "blue" | "green" | "yellow" | "red" | "purple";
}

function ProfileStat({ label, value, icon, color = "blue" }: ProfileStatProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon && <span className="text-lg">{icon}</span>}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-lg font-bold">{value}</span>
      </div>
    </div>
  );
}

// Main UserProfile component
export function UserProfile({ className = "", onEditProfile, onLogout }: UserProfileProps) {
  const { user, profile, loading } = useAuth();

  // Provide default no-op functions for optional callbacks
  const handleEditProfile = () => onEditProfile?.();
  const handleLogout = () => onLogout?.();
  const [lineUserData, setLineUserData] = React.useState<LineUserProfile | null>(null);
  const [loadingLineData, setLoadingLineData] = React.useState(false);

  // Fetch additional LINE user data after successful login
  React.useEffect(() => {
    const fetchLineUserData = async () => {
      if (user && await LineService.isLoggedIn()) {
        setLoadingLineData(true);
        try {
          const decodedToken = await LineService.getDecodedIDToken();
          if (decodedToken) {
            setLineUserData(decodedToken);
          }
        } catch (error) {
          console.error("Failed to fetch LINE user data:", error);
        } finally {
          setLoadingLineData(false);
        }
      }
    };

    fetchLineUserData();
  }, [user]);

  // Show loading state
  if (loading || loadingLineData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center ${className}`}>
        <LoadingSpinner size="lg" text="กำลังโหลดข้อมูลผู้ใช้..." />
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    return null; // Will be handled by parent component
  }

  // Get display data (prioritize LINE data, fallback to profile data)
  const displayName = lineUserData?.name || profile?.display_name || "ผู้ใช้ ShareTrust";
  const avatarUrl = lineUserData?.picture || profile?.avatar_url;
  const userEmail = lineUserData?.email || profile?.email;
  const userId = lineUserData?.sub || profile?.line_user_id || user.id;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${className}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">โปรไฟลผู้ใช้</h1>
          </div>
          <div className="flex items-center space-x-3">
            <ActionButton
              onClick={handleEditProfile}
              variant="secondary"
              size="md"
            >
              แก้ไขโปรไฟ
            </ActionButton>
            <ActionButton
              onClick={handleLogout}
              variant="outline"
              size="md"
            >
              ออกจากระบบ
            </ActionButton>
          </div>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{displayName}</h2>
              <div className="space-y-1">
                {userEmail && (
                  <p className="text-gray-600 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0012 2a2 2 0 01.997-.002l-7.997-3.998A2 2 0 002.003 5.884zM10 18a8 8 0 100-16 0 8 8 0 0116 0z" />
                    </svg>
                    <span>{userEmail}</span>
                  </p>
                )}
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>LINE ID: {userId.substring(0, 8)}...</span>
                </p>
              </div>

              {/* Trust Badge */}
              {profile && (
                <div className="mt-4">
                  <TrustBadge
                    trustLevel={profile.trust_level}
                    trustScore={profile.trust_score}
                    isVerified={profile.is_verified}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {profile && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <ProfileStat
              label="Trust Score"
              value={profile.trust_score}
              icon="⭐"
              color="yellow"
            />
            <ProfileStat
              label="Trust Level"
              value={profile.trust_level}
              icon="🛡️"
              color="green"
            />
            <ProfileStat
              label="Verification Status"
              value={profile.is_verified ? "✅ ยืนยันแล้ว" : "⏳ รอการยืนยัน"}
              icon={profile.is_verified ? "✓" : "⏳"}
              color={profile.is_verified ? "green" : "yellow"}
            />
            <ProfileStat
              label="สมาชิกติด"
              value={new Date(profile.created_at).toLocaleDateString("th-TH")}
              icon="📅"
              color="blue"
            />
          </div>
        )}

        {/* LINE Data Card */}
        {lineUserData && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              ข้อมูลบัญชี LINE
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ข้อมูลพื้นฐาน</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Issuer:</dt>
                    <dd className="font-mono text-gray-900">{lineUserData.iss}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Audience:</dt>
                    <dd className="font-mono text-gray-900">{lineUserData.aud}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Auth Methods:</dt>
                    <dd className="font-mono text-gray-900">
                      {lineUserData.amr?.join(", ") || "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 mb-2">ข้อมูลเวลา</h4>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Issued:</dt>
                    <dd className="text-gray-900">
                      {lineUserData.iat ? new Date(lineUserData.iat * 1000).toLocaleString("th-TH") : "N/A"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Expires:</dt>
                    <dd className="text-gray-900">
                      {lineUserData.exp ? new Date(lineUserData.exp * 1000).toLocaleString("th-TH") : "N/A"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การกระทำด่วน</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <ActionButton
              onClick={() => {
                // Handle view history
                console.log("View transaction history");
              }}
              variant="outline"
              size="md"
            >
              ประวัฯรายการ
            </ActionButton>
            <ActionButton
              onClick={() => {
                // Handle manage subscriptions
                console.log("Manage subscriptions");
              }}
              variant="outline"
              size="md"
            >
              จัดการแชร์
            </ActionButton>
            <ActionButton
              onClick={() => {
                // Handle settings
                console.log("Open settings");
              }}
              variant="outline"
              size="md"
            >
              ตั้งค่า
            </ActionButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;