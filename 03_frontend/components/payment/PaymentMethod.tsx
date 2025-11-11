import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface PaymentMethodProps {
  method: "promptpay" | "stripe" | "paypal" | "bank_transfer";
  selected?: boolean;
  onSelect?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  method,
  selected = false,
  onSelect,
  disabled = false,
  className,
  variant = "default",
}) => {
  const getMethodInfo = (method: string) => {
    switch (method) {
      case "promptpay":
        return {
          name: "PromptPay",
          icon: "🇹🇭",
          description: "Thai QR payment system",
          color: "rgb(var(--color-success))",
          badge: "Popular",
          features: ["Instant transfer", "No fees", "Mobile banking"],
        };
      case "stripe":
        return {
          name: "Stripe",
          icon: "💳",
          description: "Credit/Debit cards",
          color: "rgb(var(--color-brand-secondary))",
          badge: "Secure",
          features: ["Visa/Mastercard", "International", "Buyer protection"],
        };
      case "paypal":
        return {
          name: "PayPal",
          icon: "💰",
          description: "Digital wallet",
          color: "rgb(var(--color-info))",
          badge: "Global",
          features: ["Buyer protection", "Easy refunds", "Multi-currency"],
        };
      case "bank_transfer":
        return {
          name: "Bank Transfer",
          icon: "🏦",
          description: "Direct bank payment",
          color: "rgb(var(--color-text-secondary))",
          badge: "Traditional",
          features: ["All banks", "Trackable", "Manual process"],
        };
      default:
        return {
          name: "Unknown",
          icon: "❓",
          description: "Unknown payment method",
          color: "rgb(var(--color-text-secondary))",
          badge: "Unknown",
          features: [],
        };
    }
  };

  const info = getMethodInfo(method);

  if (variant === "compact") {
    return (
      <button
        onClick={onSelect}
        disabled={disabled}
        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
          selected
            ? "border-[rgb(var(--color-brand-primary))] bg-[rgb(var(--color-brand-primary))]/5"
            : "border-[rgb(var(--color-border-primary))] hover:border-[rgb(var(--color-border-secondary))]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="text-2xl flex-shrink-0">{info.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium text-[rgb(var(--color-text-primary))] truncate">
                {info.name}
              </span>
              <Badge variant="default" size="xs" rounded>
                {info.badge}
              </Badge>
            </div>
            <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
              {info.description}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div
              className={`w-4 h-4 rounded-full border-2 ${
                selected
                  ? "border-[rgb(var(--color-brand-primary))] bg-[rgb(var(--color-brand-primary))]"
                  : "border-[rgb(var(--color-border-primary))] bg-white"
              }`}
            >
              {selected && (
                <svg
                  className="w-full h-full text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      </button>
    );
  }

  if (variant === "detailed") {
    return (
      <Card
        className={className}
        variant={selected ? "elevated" : "default"}
        hover
        clickable={!disabled}
        onClick={onSelect}
      >
        <CardBody className="p-4">
          <div className="flex items-start space-x-4">
            <div className="text-3xl flex-shrink-0">{info.icon}</div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                  {info.name}
                </h3>
                <Badge variant="default" size="xs" rounded>
                  {info.badge}
                </Badge>
                {selected && (
                  <Badge variant="success" size="xs" rounded>
                    ✓ Selected
                  </Badge>
                )}
              </div>

              <p className="text-sm text-[rgb(var(--color-text-secondary))] mb-3">
                {info.description}
              </p>

              <div className="space-y-2">
                <p className="text-xs font-medium text-[rgb(var(--color-text-primary))]">
                  Features:
                </p>
                <div className="flex flex-wrap gap-1">
                  {info.features.map((feature, index) => (
                    <Badge key={index} variant="default" size="xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div
      className={`relative rounded-xl border-2 transition-all duration-200 ${
        selected
          ? "border-[rgb(var(--color-brand-primary))] bg-[rgb(var(--color-brand-primary))]/5"
          : "border-[rgb(var(--color-border-primary))]"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-[rgb(var(--color-border-secondary))]"} ${className}`}
      onClick={!disabled ? onSelect : undefined}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{info.icon}</span>
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
              {info.name}
            </h3>
            <Badge variant="default" size="xs" rounded>
              {info.badge}
            </Badge>
          </div>

          <div
            className={`w-5 h-5 rounded-full border-2 ${
              selected
                ? "border-[rgb(var(--color-brand-primary))] bg-[rgb(var(--color-brand-primary))]"
                : "border-[rgb(var(--color-border-primary))] bg-white"
            }`}
          >
            {selected && (
              <svg
                className="w-full h-full text-white p-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <p className="text-sm text-[rgb(var(--color-text-secondary))]">
          {info.description}
        </p>
      </div>
    </div>
  );
};

export default PaymentMethod;
