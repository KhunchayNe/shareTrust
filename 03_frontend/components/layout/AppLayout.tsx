import React, { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";
import { Header } from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  headerTitle?: string;
  headerActions?: ReactNode;
  className?: string;
  onBack?: () => void;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showHeader = true,
  showBottomNav = true,
  headerTitle,
  headerActions,
  className,
  onBack,
}) => {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] flex flex-col liff-app">
      {/* Header */}
      {showHeader && (
        <Header title={headerTitle} actions={headerActions} onBack={onBack} />
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto custom-scrollbar ${className}`}>
        <div className="pb-safe-area-inset-bottom">{children}</div>
      </main>

      {/* Bottom Navigation */}
      {showBottomNav && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
