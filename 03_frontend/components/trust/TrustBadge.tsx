import React from "react";
import { Badge } from "@/components/ui/Badge";
import { formatTrustScore, getTrustLevelColor } from "@/lib/utils";

interface TrustBadgeProps {
  score: number;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "compact" | "detailed";
  showLevel?: boolean;
  showScore?: boolean;
  className?: string;
  animated?: boolean;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score,
  size = "sm",
  variant = "default",
  showLevel = true,
  showScore = true,
  className,
  animated = false,
}) => {
  const { level, levelName } = formatTrustScore(score);
  const trustColor = getTrustLevelColor(level);

  const getTrustIcon = (level: number) => {
    switch (level) {
      case 1:
        return "🌱";
      case 2:
        return "🌿";
      case 3:
        return "🌳";
      case 4:
        return "🌟";
      case 5:
        return "👑";
      default:
        return "❓";
    }
  };

  const getTrustEmoji = (level: number) => {
    switch (level) {
      case 1:
        return "New";
      case 2:
        return "Rising";
      case 3:
        return "Established";
      case 4:
        return "Trusted";
      case 5:
        return "Elite";
      default:
        return "Unknown";
    }
  };

  if (variant === "compact") {
    return (
      <Badge
        variant="trust"
        level={level}
        size={size}
        rounded
        className={className}
      >
        {getTrustIcon(level)}
      </Badge>
    );
  }

  if (variant === "detailed") {
    return (
      <div
        className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl border border-[rgb(var(--color-border-primary))] bg-white ${className}`}
        style={{
          boxShadow: animated ? "0 0 20px rgba(0, 195, 0, 0.2)" : undefined,
        }}
      >
        {/* Trust Icon */}
        <div className="text-lg">{getTrustIcon(level)}</div>

        {/* Trust Info */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="text-xs font-medium text-[rgb(var(--color-text-secondary))]">
              {getTrustEmoji(level)}
            </span>
            {showScore && (
              <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                {score} pts
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span
              className="text-sm font-semibold"
              style={{ color: trustColor }}
            >
              {levelName}
            </span>
            {showLevel && (
              <span className="text-xs text-[rgb(var(--color-text-tertiary))]">
                Lv.{level}
              </span>
            )}
          </div>
        </div>

        {/* Level Indicator */}
        <div className="flex space-x-0.5">
          {[1, 2, 3, 4, 5].map((l) => (
            <div
              key={l}
              className="w-1 h-3 rounded-full"
              style={{
                backgroundColor:
                  l <= level ? trustColor : "rgb(var(--color-bg-secondary))",
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Badge
      variant="trust"
      level={level}
      size={size}
      rounded
      className={className}
    >
      <span className="flex items-center space-x-1">
        <span>{getTrustIcon(level)}</span>
        {showLevel && <span>{levelName}</span>}
        {showScore && <span className="text-xs">({score})</span>}
      </span>
    </Badge>
  );
};

export default TrustBadge;
