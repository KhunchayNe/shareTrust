import React, { useEffect, useRef, useState } from "react";
import { formatTrustScore, getTrustLevelColor } from "@/lib/utils";

interface TrustMeterProps {
  score: number;
  maxScore?: number;
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
  showLabels?: boolean;
  showScore?: boolean;
  className?: string;
}

export const TrustMeter: React.FC<TrustMeterProps> = ({
  score,
  maxScore = 100,
  size = "md",
  animated = true,
  showLabels = true,
  showScore = true,
  className,
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number | undefined>(undefined);

  const { level, levelName } = formatTrustScore(score);
  const percentage = (score / maxScore) * 100;

  const sizes = {
    sm: {
      diameter: 80,
      strokeWidth: 6,
      fontSize: "text-sm",
    },
    md: {
      diameter: 120,
      strokeWidth: 8,
      fontSize: "text-base",
    },
    lg: {
      diameter: 160,
      strokeWidth: 10,
      fontSize: "text-lg",
    },
    xl: {
      diameter: 200,
      strokeWidth: 12,
      fontSize: "text-xl",
    },
  };

  const currentSize = sizes[size];
  const radius = (currentSize.diameter - currentSize.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    if (animated && !isAnimating) {
      const timeoutId = setTimeout(() => {
        setIsAnimating(true);
        setDisplayScore(0);
      }, 0);

      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      const targetScore = score;

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayScore(Math.floor(targetScore * easeOutQuart));

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else if (!animated) {
      const timeoutId = setTimeout(() => setDisplayScore(score), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [score, animated, isAnimating]);

  const getTrustLevelColor = (level: number): string => {
    const colors = [
      "rgb(var(--color-trust-level1))", // Gray - New user
      "rgb(var(--color-trust-level2))", // Yellow - Basic trust
      "rgb(var(--color-trust-level3))", // Blue - Established
      "rgb(var(--color-trust-level4))", // Green - Trusted
      "rgb(var(--color-trust-level5))", // Amber - Highly trusted
    ];
    return colors[Math.min(level - 1, colors.length - 1)];
  };

  const getTrustIcon = (level: number): string => {
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

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* SVG Circle */}
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={currentSize.diameter}
          height={currentSize.diameter}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            cx={currentSize.diameter / 2}
            cy={currentSize.diameter / 2}
            r={radius}
            stroke="rgb(var(--color-bg-secondary))"
            strokeWidth={currentSize.strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}
          <circle
            cx={currentSize.diameter / 2}
            cy={currentSize.diameter / 2}
            r={radius}
            stroke={getTrustLevelColor(level)}
            strokeWidth={currentSize.strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-out"
            style={{
              filter:
                level >= 4
                  ? "drop-shadow(0 0 8px rgba(0, 195, 0, 0.4))"
                  : undefined,
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-2xl mb-1`}>{getTrustIcon(level)}</div>
          {showScore && (
            <div
              className={`font-bold ${sizes[size].fontSize} text-[rgb(var(--color-text-primary))]`}
            >
              {displayScore}
            </div>
          )}
          <div className={`text-xs text-[rgb(var(--color-text-tertiary))]`}>
            pts
          </div>
        </div>
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="mt-4 text-center">
          <div
            className={`font-semibold ${sizes[size].fontSize} text-[rgb(var(--color-text-primary))]`}
          >
            {levelName}
          </div>
          <div className="text-sm text-[rgb(var(--color-text-secondary))]">
            Level {level} of 5
          </div>
          {score > 0 && level < 5 && (
            <div className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
              {level * 20 - score} points to next level
            </div>
          )}
          {level >= 5 && (
            <div className="text-xs text-[rgb(var(--color-success))] mt-1">
              🎉 Maximum trust level achieved!
            </div>
          )}
        </div>
      )}

      {/* Level Indicators */}
      <div className="flex space-x-2 mt-4">
        {[1, 2, 3, 4, 5].map((l) => (
          <div
            key={l}
            className="w-3 h-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor:
                l <= level
                  ? getTrustLevelColor(l)
                  : "rgb(var(--color-bg-secondary))",
              transform: l <= level ? "scale(1.2)" : "scale(1)",
              boxShadow:
                l <= level && l >= 4
                  ? "0 0 8px rgba(0, 195, 0, 0.4)"
                  : undefined,
            }}
            title={`Level ${l}: ${formatTrustScore(l * 20).levelName}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TrustMeter;
