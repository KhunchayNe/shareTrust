import React from "react";
import { Badge } from "@/components/ui/Badge";
import {
  formatTrustScore,
  getTrustLevelColor,
  calculateEscrowProgress,
} from "@/lib/utils";

interface TrustProgressProps {
  currentScore: number;
  targetScore?: number;
  showCurrentLevel?: boolean;
  showNextLevel?: boolean;
  animated?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const TrustProgress: React.FC<TrustProgressProps> = ({
  currentScore,
  targetScore,
  showCurrentLevel = true,
  showNextLevel = true,
  animated = true,
  size = "md",
  className,
}) => {
  const { level, levelName } = formatTrustScore(currentScore);
  const nextLevel = Math.min(level + 1, 5);
  const nextLevelName = formatTrustScore(nextLevel * 20).levelName;
  const currentLevelThreshold = (level - 1) * 20;
  const nextLevelThreshold = level * 20;
  const progress = calculateEscrowProgress(
    currentScore - currentLevelThreshold,
    nextLevelThreshold - currentLevelThreshold,
  );

  const sizes = {
    sm: {
      height: "h-2",
      text: "text-xs",
    },
    md: {
      height: "h-3",
      text: "text-sm",
    },
    lg: {
      height: "h-4",
      text: "text-base",
    },
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {showCurrentLevel && (
            <div className="flex items-center space-x-2">
              <Badge variant="trust" level={level} size="xs" rounded />
              <span
                className={`${sizes[size].text} font-medium text-[rgb(var(--color-text-primary))]`}
              >
                {levelName}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`${sizes[size].text} text-[rgb(var(--color-text-secondary))]`}
          >
            {currentScore} pts
          </span>
          {showNextLevel && level < 5 && (
            <span
              className={`${sizes[size].text} text-[rgb(var(--color-text-tertiary))]`}
            >
              / {nextLevelThreshold}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {level < 5 && (
        <div className="relative">
          {/* Background */}
          <div
            className={`w-full ${sizes[size].height} bg-[rgb(var(--color-bg-secondary))] rounded-full overflow-hidden`}
          >
            {/* Progress */}
            <div
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                animated ? "animate-pulse" : ""
              }`}
              style={{
                width: `${progress}%`,
                backgroundColor: getTrustLevelColor(level),
              }}
            />
          </div>

          {/* Level Markers */}
          <div className="absolute inset-0 flex items-center justify-between px-1 pointer-events-none">
            {[0, 25, 50, 75, 100].map((marker) => (
              <div
                key={marker}
                className="w-0.5 h-2 bg-white/30 rounded-full"
                style={{ left: `${marker}%` }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Next Level Info */}
      {showNextLevel && level < 5 && (
        <div className="flex items-center justify-between">
          <span
            className={`${sizes[size].text} text-[rgb(var(--color-text-tertiary))]`}
          >
            Next: {nextLevelName}
          </span>
          <span
            className={`${sizes[size].text} text-[rgb(var(--color-text-tertiary))]`}
          >
            {nextLevelThreshold - currentScore} pts to go
          </span>
        </div>
      )}

      {/* Max Level */}
      {level >= 5 && (
        <div className="text-center">
          <Badge
            variant="trust"
            level={5}
            size="sm"
            className="animate-trust-glow"
          >
            🏆 Maximum Trust Level Reached!
          </Badge>
        </div>
      )}

      {/* Target Score Progress */}
      {targetScore && targetScore > currentScore && (
        <div className="mt-4 p-3 bg-[rgb(var(--color-bg-secondary))] rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span
              className={`${sizes[size].text} font-medium text-[rgb(var(--color-text-secondary))]`}
            >
              Target Score Progress
            </span>
            <span
              className={`${sizes[size].text} text-[rgb(var(--color-text-tertiary))]`}
            >
              {currentScore} / {targetScore}
            </span>
          </div>
          <div
            className={`w-full ${sizes[size].height} bg-white rounded-full overflow-hidden`}
          >
            <div
              className="h-full bg-gradient-to-r from-[rgb(var(--color-brand-primary))] to-[rgb(var(--color-brand-secondary))] transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${(currentScore / targetScore) * 100}%`,
              }}
            />
          </div>
          <p
            className={`mt-1 ${sizes[size].text} text-[rgb(var(--color-text-tertiary))]`}
          >
            {targetScore - currentScore} points remaining
          </p>
        </div>
      )}
    </div>
  );
};

export default TrustProgress;
