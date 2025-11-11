"use client";

import Image from "next/image";
import { useAuth } from "../contexts/AuthContext";
import LoginButton from "../components/LoginButton";
import LoadingSpinner from "../components/LoadingSpinner";
import TrustBadge from "../components/TrustBadge";
import { LiffDebug } from "../components/LiffDebug";

export default function Home() {
  const { user, profile, loading, initialized } = useAuth();

  if (!initialized || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <LoadingSpinner size="lg" text="กำลังโหลด..." />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ShareTrust
            </h1>
            <p className="text-gray-600">แชร์บัญชีอย่างปลอดภัย</p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 bg-blue-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  ยืนยันตัวตน
                </h3>
                <p className="text-sm text-gray-600">
                  ระบบยืนยันตัวตนด้วย LINE + เบอร์โทร
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 bg-green-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  ระบบค้ำประกัน
                </h3>
                <p className="text-sm text-gray-600">
                  ปกป้องการหลอกลวงด้วยระบบ Escrow
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 bg-purple-100 rounded-full">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">
                  ระบบ Trust Score
                </h3>
                <p className="text-sm text-gray-600">
                  สร้างความน่าเชื่อถือและป้องกันมิจฉาชีพ
                </p>
              </div>
            </div>
          </div>

          <LoginButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">ShareTrust</h1>
            </div>
            <div className="flex items-center space-x-4">
              {profile && (
                <div className="flex items-center space-x-3">
                  <TrustBadge
                    trustLevel={profile.trust_level}
                    trustScore={profile.trust_score}
                    isVerified={profile.is_verified}
                  />
                  <div className="flex items-center space-x-2">
                    {profile.avatar_url && (
                      <Image
                        src={profile.avatar_url}
                        alt={profile.display_name || "User"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {profile.display_name || "User"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Development Debug Panel - Only show in development */}
        {process.env.NODE_ENV === "development" && <LiffDebug />}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ยินดีต้อนรับสู่ ShareTrust!
          </h2>
          <p className="text-gray-600">
            แพลตฟอร์มสำหรับแชร์บัญชีและค่า subscription อย่างปลอดภัย
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🎬</span>
              </div>
              <h3 className="font-semibold text-gray-900">Streaming</h3>
            </div>
            <p className="text-gray-600 text-sm">Netflix, Disney+, และอื่นๆ</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🧠</span>
              </div>
              <h3 className="font-semibold text-gray-900">AI Tools</h3>
            </div>
            <p className="text-gray-600 text-sm">
              ChatGPT, Midjourney, และอื่นๆ
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="font-semibold text-gray-900">Gaming</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Game passes, Gaming platforms
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-semibold text-gray-900">Software</h3>
            </div>
            <p className="text-gray-600 text-sm">Adobe, Microsoft, และอื่นๆ</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            ยังไม่พร้อมใช้งาน
          </h3>
          <p className="text-gray-600">
            ระบบยังอยู่ในระหว่างการพัฒนา เราจะประกาศเมื่อพร้อมเปิดให้บริการจริง
          </p>
        </div>
      </main>
    </div>
  );
}
