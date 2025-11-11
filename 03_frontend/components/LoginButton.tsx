"use client";

import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function LoginButton() {
  const { signIn, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Login failed:", error);
      // You might want to show an error message to the user here
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center space-x-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" />
          <span>กำลังเข้าสู่ระบบ...</span>
        </>
      ) : (
        <>
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.36 2.72l1.42 1.42-7.07 7.07L17.59 16l1.41-1.41L24 19.36 19.36 24l-1.41-1.42L16 20.59l-4.79-4.79 7.07-7.07-1.42-1.42-7.07 7.07L5.37 5.37l1.42-1.42 7.07 7.07L20.78 4.15l-1.42-1.42L19.36 2.72zM5.37 5.37L0 10.74l1.42 1.42L6.79 6.79l-1.42-1.42zm13.22 13.22l-1.42 1.42 4.37 4.37L24 23.95l-5.41-5.36z" />
          </svg>
          <span>เข้าสู่ระบบด้วย LINE</span>
        </>
      )}
    </button>
  );
}
