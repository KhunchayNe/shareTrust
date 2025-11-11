interface TrustBadgeProps {
  trustLevel: number;
  trustScore: number;
  isVerified?: boolean;
  size?: "sm" | "md";
  showScore?: boolean;
}

export default function TrustBadge({
  trustLevel,
  trustScore,
  isVerified = false,
  size = "md",
  showScore = true,
}: TrustBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1",
  };

  const trustColors = {
    1: "bg-gray-100 text-gray-700 border-gray-300",
    2: "bg-green-100 text-green-700 border-green-300",
    3: "bg-blue-100 text-blue-700 border-blue-300",
    4: "bg-purple-100 text-purple-700 border-purple-300",
    5: "bg-yellow-100 text-yellow-700 border-yellow-300",
  };

  const trustLabels = {
    1: "New User",
    2: "Trusted",
    3: "Verified",
    4: "Premium",
    5: "Elite",
  };

  return (
    <div className="flex items-center space-x-2">
      {isVerified && (
        <div data-testid="verified-badge" className="flex items-center space-x-1 bg-green-50 border border-green-200 rounded-full px-2 py-1">
          <svg
            className={`w-3 h-3 text-green-600 ${size === "sm" ? "w-2 h-2" : "w-3 h-3"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span
            className={`text-green-700 font-medium ${size === "sm" ? "text-xs" : "text-sm"}`}
          >
            ยืนยันตัวตน
          </span>
        </div>
      )}

      <div
        data-testid="trust-level"
        className={`inline-flex items-center space-x-1 border rounded-full ${sizeClasses[size]} ${trustColors[trustLevel as keyof typeof trustColors]}`}
      >
        <div className="flex items-center space-x-1">
          {trustLevel >= 2 && (
            <svg
              className={`w-3 h-3 ${size === "sm" ? "w-2 h-2" : "w-3 h-3"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )}
          <span className="font-medium">
            {trustLabels[trustLevel as keyof typeof trustLabels]}
          </span>
        </div>

        {showScore && <span data-testid="trust-score" className="opacity-75">({trustScore})</span>}
      </div>
    </div>
  );
}
