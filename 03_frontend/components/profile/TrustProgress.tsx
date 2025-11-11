"use client";

import React from "react";
import { TrustProgressProps, TrustLevel } from "../../types";

const trustLevelInfo: Record<TrustLevel, { label: string; color: string; minScore: number; maxScore: number }> = {
  1: { label: "New User", color: "bg-gray-500", minScore: 0, maxScore: 4 },
  2: { label: "Basic Trust", color: "bg-green-500", minScore: 5, maxScore: 19 },
  3: { label: "Established", color: "bg-blue-500", minScore: 20, maxScore: 49 },
  4: { label: "Trusted", color: "bg-purple-500", minScore: 50, maxScore: 99 },
  5: { label: "Highly Trusted", color: "bg-yellow-500", minScore: 100, maxScore: 1000 },
};

export function TrustProgress({
  currentScore,
  currentLevel,
  nextLevelScore,
  showAnimation = true,
}: TrustProgressProps) {
  const levelInfo = trustLevelInfo[currentLevel];
  const currentLevelRange = levelInfo.maxScore - levelInfo.minScore + 1;
  const scoreInCurrentLevel = currentScore - levelInfo.minScore;
  const progressPercentage = Math.min((scoreInCurrentLevel / currentLevelRange) * 100, 100);

  // Calculate progress to next level
  const nextLevelProgress = currentLevel < 5
    ? ((currentScore - levelInfo.minScore) / (nextLevelScore - levelInfo.minScore)) * 100
    : 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Trust Score Progress</h3>
          <p className="text-sm text-gray-600">
            Level {currentLevel}: {levelInfo.label}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{currentScore}</div>
          <div className="text-sm text-gray-600">
            {currentLevel < 5 ? `${nextLevelScore - currentScore} to next level` : "Max Level"}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Level {currentLevel}</span>
          <span>{currentLevel < 5 ? `Level ${currentLevel + 1}` : "Max"}</span>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          {currentLevel < 5 ? (
            <div
              className={`h-full ${levelInfo.color} transition-all duration-500 ease-out ${
                showAnimation ? "animate-pulse" : ""
              }`}
              style={{ width: `${nextLevelProgress}%` }}
            >
              <div className="h-full bg-white bg-opacity-20 animate-pulse"></div>
            </div>
          ) : (
            <div
              className={`h-full ${levelInfo.color} transition-all duration-500 ease-out`}
              style={{ width: "100%" }}
            />
          )}
        </div>
      </div>

      {/* Level Indicators */}
      <div className="flex justify-between text-xs text-gray-500 mb-4">
        {Object.entries(trustLevelInfo).map(([level, info]) => (
          <div
            key={level}
            className={`flex flex-col items-center ${
              parseInt(level) <= currentLevel ? "text-gray-900 font-medium" : "text-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                parseInt(level) <= currentLevel
                  ? info.color + " text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {parseInt(level)}
            </div>
            <span className="text-center hidden sm:block">{info.label.split(" ")[0]}</span>
          </div>
        ))}
      </div>

      {/* Current Level Benefits */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Current Benefits:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {currentLevel >= 1 && <li>• Create sharing groups</li>}
          {currentLevel >= 2 && <li>• Access to premium groups</li>}
          {currentLevel >= 3 && <li>• Lower escrow fees (10% discount)</li>}
          {currentLevel >= 4 && <li>• Priority support (24h response)</li>}
          {currentLevel >= 5 && <li>• Verified badge and special privileges</li>}
        </ul>
      </div>
    </div>
  );
}

export default TrustProgress;