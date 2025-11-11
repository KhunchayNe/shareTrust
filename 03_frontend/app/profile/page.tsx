"use client";

import { useEffect, useState } from "react";
import liff from "@line/liff";
import { AppLayout } from "@/components/layout/AppLayout";
import { UserProfile } from "@/components/auth/UserProfile";
import { TrustMeter } from "@/components/trust/TrustMeter";
import { TrustProgress } from "@/components/trust/TrustProgress";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { User } from "@/types/index";

type Activity = {
  id: string;
  type: "joined" | "created" | "payment" | "verification";
  title: string;
  description: string;
  date: string;
  points?: number;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [liffReady, setLiffReady] = useState(false);

  useEffect(() => {
    async function initLiff() {
      try {
        const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const userProfile = await liff.getProfile();

          // Mock comprehensive user data
          const userData: User = {
            id: userProfile.userId, // Add missing id field
            display_name: userProfile.displayName,
            user_id: userProfile.userId,
            picture_url: userProfile.pictureUrl,
            status_message: userProfile.statusMessage,
            trust_score: 75,
            is_verified: true,
            status: "active",
            created_at: "2024-01-15T10:30:00Z",
            badges: [
              "Verified",
              "Trusted Member",
              "Early Adopter",
              "Safe Partner",
            ],
            email: "user@example.com",
            phone: "+66812345678",
            location: "Bangkok, Thailand",
          };
          setUser(userData);

          // Mock activities
          const mockActivities: Activity[] = [
            {
              id: "1",
              type: "created",
              title: "Created Netflix Group",
              description: "Started sharing Netflix Premium 4K plan",
              date: "2024-10-25T14:30:00Z",
              points: 5,
            },
            {
              id: "2",
              type: "payment",
              title: "Payment Completed",
              description:
                "Successfully completed payment for Adobe Creative Cloud",
              date: "2024-10-24T16:45:00Z",
              points: 3,
            },
            {
              id: "3",
              type: "joined",
              title: "Joined Spotify Group",
              description: "Became member of Spotify Premium Family",
              date: "2024-10-23T09:15:00Z",
              points: 2,
            },
            {
              id: "4",
              type: "verification",
              title: "Phone Verified",
              description: "Phone number verification completed",
              date: "2024-10-20T11:00:00Z",
              points: 10,
            },
            {
              id: "5",
              type: "verification",
              title: "Identity Verified",
              description: "ID card verification approved",
              date: "2024-10-18T13:30:00Z",
              points: 15,
            },
          ];
          setActivities(mockActivities);

          setLiffReady(true);
        }
      } catch (error) {
        console.error("LIFF initialization error:", error);
      }
    }
    initLiff();
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return "🎯";
      case "joined":
        return "👥";
      case "payment":
        return "💰";
      case "verification":
        return "✅";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!liffReady) {
    return (
      <div className="flex items-center justify-center h-screen bg-[rgb(var(--color-bg-primary))]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <AppLayout headerTitle="Profile" showBottomNav={true}>
      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        {user && (
          <UserProfile
            user={user}
            size="lg"
            showBadges={true}
            showLevelProgress={true}
          />
        )}

        {/* Trust Score Overview */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-[rgb(var(--color-text-primary))] text-center">
                  Trust Score
                </h3>
              </CardHeader>
              <CardBody className="flex justify-center">
                <TrustMeter
                  score={user.trust_score || 0}
                  size="lg"
                  animated={true}
                  showLabels={true}
                />
              </CardBody>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                    Level Progress
                  </h3>
                </CardHeader>
                <CardBody>
                  <TrustProgress
                    currentScore={user.trust_score || 0}
                    targetScore={100}
                    showCurrentLevel={true}
                    showNextLevel={true}
                  />
                </CardBody>
              </Card>

              <Card variant="default" padding="sm">
                <CardBody className="text-center space-y-2">
                  <div className="text-2xl font-bold text-[rgb(var(--color-success))]">
                    🏆 Level 4
                  </div>
                  <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                    Trusted Member
                  </p>
                  <div className="text-xs text-[rgb(var(--color-text-tertiary))]">
                    25 points to reach Level 5
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        )}

        {/* Verification Status */}
        {user && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                Verification Status
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-success))]/10 rounded-lg border border-[rgb(var(--color-success))]/20">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📱</span>
                    <div>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        Phone
                      </p>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {user.phone || "Not verified"}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="xs" rounded>
                    ✓ Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-success))]/10 rounded-lg border border-[rgb(var(--color-success))]/20">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🆔</span>
                    <div>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        ID Card
                      </p>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Identity verified
                      </p>
                    </div>
                  </div>
                  <Badge variant="success" size="xs" rounded>
                    ✓ Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">💳</span>
                    <div>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        PromptPay
                      </p>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        Not connected
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="xs">
                    Connect
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-bg-secondary))] rounded-lg border border-[rgb(var(--color-border-primary))]">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">📧</span>
                    <div>
                      <p className="font-medium text-[rgb(var(--color-text-primary))]">
                        Email
                      </p>
                      <p className="text-sm text-[rgb(var(--color-text-secondary))]">
                        {user.email || "Not verified"}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="xs">
                    Verify
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
                Recent Activity
              </h3>
              <Button variant="ghost" size="xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-[rgb(var(--color-bg-secondary))] transition-colors"
                >
                  <div className="flex-shrink-0 text-2xl">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-[rgb(var(--color-text-primary))] truncate">
                        {activity.title}
                      </p>
                      {activity.points && (
                        <Badge variant="success" size="xs" rounded>
                          +{activity.points}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-[rgb(var(--color-text-secondary))] truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-[rgb(var(--color-text-tertiary))] mt-1">
                      {formatDate(activity.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-[rgb(var(--color-text-primary))]">
              Account Settings
            </h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon="🔔"
            >
              Notification Preferences
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon="🔒"
            >
              Privacy Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon="💳"
            >
              Payment Methods
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              leftIcon="❓"
            >
              Help & Support
            </Button>
            <Button
              variant="danger"
              className="w-full justify-start"
              leftIcon="🚪"
            >
              Sign Out
            </Button>
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
