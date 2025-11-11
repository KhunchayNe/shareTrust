"use client";

import React from "react";
import { ActivityCardProps } from "../../types";

const activityIcons = {
  transaction: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
      <path
        fillRule="evenodd"
        d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  group: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
    </svg>
  ),
  verification: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  ),
  trust: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
};

const statusColors = {
  completed: "text-green-600 bg-green-100",
  pending: "text-yellow-600 bg-yellow-100",
  failed: "text-red-600 bg-red-100",
  active: "text-blue-600 bg-blue-100",
  cancelled: "text-gray-600 bg-gray-100",
};

export function ActivityCard({
  title,
  description,
  timestamp,
  type,
  status,
  amount,
  currency,
  icon,
  onClick,
}: ActivityCardProps) {
  const defaultIcon = activityIcons[type as keyof typeof activityIcons] || activityIcons.transaction;
  const statusColor = status ? statusColors[status as keyof typeof statusColors] : null;

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 transition-all duration-200 ${
        onClick
          ? "cursor-pointer hover:border-blue-300 hover:shadow-md"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div
          className={`flex-shrink-0 p-2 rounded-full ${
            type === "transaction"
              ? "bg-green-100 text-green-600"
              : type === "group"
              ? "bg-blue-100 text-blue-600"
              : type === "verification"
              ? "bg-purple-100 text-purple-600"
              : "bg-yellow-100 text-yellow-600"
          }`}
        >
          {icon || defaultIcon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-900 truncate">{title}</h4>
            {amount && (
              <div className="text-sm font-semibold text-gray-900">
                {currency === "THB" ? "฿" : currency}{amount}
              </div>
            )}
          </div>

          {description && (
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
          )}

          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              {new Date(timestamp).toLocaleDateString("th-TH", {
                hour: "2-digit",
                minute: "2-digit",
                day: "numeric",
                month: "short",
              })}
            </span>

            {status && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor}`}
              >
                {status}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Activity List Component
interface ActivityListProps {
  activities: ActivityCardProps[];
  title: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
}

export function ActivityList({
  activities,
  title,
  loading = false,
  emptyMessage = "No recent activity",
  emptyIcon,
  className = "",
}: ActivityListProps) {
  if (loading) {
    return (
      <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <span className="text-sm text-gray-500">{activities.length} items</span>
      </div>

      {activities.length > 0 ? (
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <ActivityCard key={index} {...activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          {emptyIcon || <div className="text-gray-400 text-4xl mb-4">📋</div>}
          <h4 className="text-lg font-medium text-gray-900 mb-2">No Activity</h4>
          <p className="text-sm text-gray-600">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}

export default ActivityCard;