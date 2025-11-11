"use client";

import React from "react";
import { UserBadge, Badge } from "../../types";

interface BadgesProps {
  badges: (UserBadge & { badge: Badge })[];
  loading?: boolean;
  className?: string;
}

const defaultBadges = [
  {
    id: "verified",
    name: "Verified",
    description: "Identity verified with phone and ID",
    icon: "✅",
    category: "verification" as const,
  },
  {
    id: "trusted_50",
    name: "Trusted 50+",
    description: "Achieved 50+ trust score",
    icon: "🔒",
    category: "trust" as const,
  },
  {
    id: "safe_partner",
    name: "Safe Partner",
    description: "No violations in 6 months",
    icon: "🧭",
    category: "achievement" as const,
  },
];

export function Badges({ badges = [], loading = false, className = "" }: BadgesProps) {
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const earnedBadges = badges.map(userBadge => userBadge.badge);
  const unlockedBadgeIds = earnedBadges.map(badge => badge.id);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
        <span className="text-sm text-gray-500">
          {earnedBadges.length} of {defaultBadges.length} unlocked
        </span>
      </div>

      <div className="space-y-4">
        {defaultBadges.map((badge) => {
          const isUnlocked = unlockedBadgeIds.includes(badge.id);
          const userBadge = badges.find(ub => ub.badge_id === badge.id);

          return (
            <div
              key={badge.id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isUnlocked
                  ? "border-green-200 bg-green-50"
                  : "border-gray-200 bg-gray-50 opacity-60"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-lg ${
                      isUnlocked
                        ? "bg-green-100 border-2 border-green-300"
                        : "bg-gray-200 border-2 border-gray-300"
                    }`}
                  >
                    {badge.icon}
                  </div>
                </div>

                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 mb-1">
                    {badge.name}
                    {isUnlocked && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Unlocked
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  {userBadge && (
                    <p className="text-xs text-gray-500 mt-1">
                      Earned on {new Date(userBadge.earned_at).toLocaleDateString("th-TH")}
                    </p>
                  )}
                </div>

                {isUnlocked ? (
                  <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {earnedBadges.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">🎯</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Badges Yet</h4>
          <p className="text-sm text-gray-600">
            Complete verification and participate in groups to unlock achievements
          </p>
        </div>
      )}

      {earnedBadges.length < defaultBadges.length && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h5 className="text-sm font-medium text-blue-900">How to Unlock More Badges</h5>
              <p className="text-sm text-blue-700">
                Complete phone verification, reach higher trust scores, and maintain a clean record
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Badges;