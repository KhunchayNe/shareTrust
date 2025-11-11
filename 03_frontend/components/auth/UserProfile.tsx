import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  formatTrustScore,
  getTrustLevelColor,
  formatDateRelative,
} from "@/lib/utils";
import type { User } from "@/types";

interface UserProfileProps {
  user: User;
  className?: string;
  showBadges?: boolean;
  showLevelProgress?: boolean;
  size?: "sm" | "md" | "lg";
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  className,
  showBadges = true,
  showLevelProgress = true,
  size = "md",
}) => {
  const { level, levelName } = formatTrustScore(user.trust_score || 0);
  const trustColor = getTrustLevelColor(level);
  const nextLevelScore = level * 20;
  const progress = ((user.trust_score || 0) % 20) * 5;

  const sizes = {
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-xl",
    lg: "h-20 w-20 text-2xl",
  };

  return (
    <Card className={className} variant="outlined" padding="md">
      <CardBody className="flex items-center space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {user.picture_url ? (
            <img
              className={`${sizes[size]} rounded-full object-cover border-2 border-[rgb(var(--color-border-primary))]`}
              src={user.picture_url}
              alt={user.display_name || "User avatar"}
            />
          ) : (
            <div
              className={`${sizes[size]} rounded-full bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center text-[rgb(var(--color-text-secondary))] font-semibold border-2 border-[rgb(var(--color-border-primary))]`}
            >
              {(user.display_name || "User").charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          {/* Name and Trust Level */}
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))] truncate">
              {user.display_name || "Anonymous User"}
            </h3>
            <Badge
              variant="trust"
              level={level}
              size="xs"
              rounded
              className="shrink-0"
            >
              {levelName}
            </Badge>
          </div>

          {/* Trust Score */}
          {user.trust_score !== undefined && (
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-[rgb(var(--color-text-secondary))]">
                Trust Score: {user.trust_score}
              </span>
              {showLevelProgress && level < 5 && (
                <div className="flex-1 max-w-32">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 h-1.5 bg-[rgb(var(--color-bg-secondary))] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500 ease-out"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: trustColor,
                        }}
                      />
                    </div>
                    <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                      {nextLevelScore}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Status Badges */}
          <div className="flex items-center space-x-2 mb-2">
            {user.is_verified && (
              <Badge variant="success" size="xs" rounded>
                ✅ Verified
              </Badge>
            )}
            {user.trust_score && user.trust_score >= 50 && (
              <Badge variant="trust" size="xs" rounded>
                🔒 Trusted 50+
              </Badge>
            )}
            {user.status === "active" && (
              <Badge variant="info" size="xs" rounded>
                🟢 Active
              </Badge>
            )}
          </div>

          {/* User Badges */}
          {showBadges && user.badges && user.badges.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.badges.slice(0, 3).map((badge, index) => (
                <Badge key={index} variant="default" size="xs" rounded>
                  {badge}
                </Badge>
              ))}
              {user.badges.length > 3 && (
                <Badge variant="default" size="xs" rounded>
                  +{user.badges.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Join Date */}
          {user.created_at && (
            <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
              Joined {formatDateRelative(user.created_at)}
            </p>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export interface UserProfileCompactProps {
  user: User;
  className?: string;
  showTrustLevel?: boolean;
  onClick?: () => void;
}

export const UserProfileCompact: React.FC<UserProfileCompactProps> = ({
  user,
  className,
  showTrustLevel = true,
  onClick,
}) => {
  const { level } = formatTrustScore(user.trust_score || 0);

  return (
    <div
      className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {user.picture_url ? (
          <img
            className="h-8 w-8 rounded-full object-cover"
            src={user.picture_url}
            alt={user.display_name || "User avatar"}
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-[rgb(var(--color-bg-secondary))] flex items-center justify-center text-[rgb(var(--color-text-secondary))] text-sm font-semibold">
            {(user.display_name || "User").charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Name and Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-[rgb(var(--color-text-primary))] truncate">
            {user.display_name || "Anonymous User"}
          </span>
          {showTrustLevel && (
            <Badge variant="trust" level={level} size="xs" rounded />
          )}
        </div>
        {user.trust_score !== undefined && (
          <span className="text-xs text-[rgb(var(--color-text-secondary))]">
            Score: {user.trust_score}
          </span>
        )}
      </div>
    </div>
  );
};
