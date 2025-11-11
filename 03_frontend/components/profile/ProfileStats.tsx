"use client";

import React from "react";
import { ProfileStatProps } from "../../types";

export function ProfileStat({
  label,
  value,
  icon,
  color = "blue",
  size = "md",
  trend,
}: ProfileStatProps) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    red: "bg-red-50 border-red-200 text-red-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  const sizeClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
        <path d="M5 12a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
      </svg>
    ),
  };

  return (
    <div
      className={`border rounded-lg ${colorClasses[color]} ${sizeClasses[size]} transition-all duration-200 hover:shadow-md`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0">
              <span className="text-lg opacity-80">{icon}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium opacity-90">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>

        {trend && (
          <div className="flex items-center space-x-1">
            {trendIcons[trend.direction]}
            <span className={`text-sm font-medium ${
              trend.direction === 'up' ? 'text-green-600' :
              trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {Math.abs(trend.value)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Profile Stats Grid Component
interface ProfileStatsGridProps {
  stats: ProfileStatProps[];
  loading?: boolean;
  className?: string;
}

export function ProfileStatsGrid({ stats, loading = false, className = "" }: ProfileStatsGridProps) {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <ProfileStat key={index} {...stat} />
      ))}
    </div>
  );
}

export default ProfileStatsGrid;