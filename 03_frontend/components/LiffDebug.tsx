"use client";

import React, { useState, useEffect } from "react";
import { LineService } from "../lib/line";

interface LiffInfo {
  isInitialized: boolean;
  isLoggedIn: boolean;
  isInClient: boolean;
  liffId?: string;
  version?: string;
  os?: string;
  language?: string;
  environment: string;
  currentUrl: string;
  isSecure: boolean;
}

export function LiffDebug() {
  const [liffInfo, setLiffInfo] = useState<LiffInfo>({
    isInitialized: false,
    isLoggedIn: false,
    isInClient: false,
    environment: typeof window !== "undefined" ? "browser" : "server",
    currentUrl: "",
    isSecure: false,
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const checkLiffStatus = async () => {
    setLoading(true);
    setError(null);

    try {
      // Update basic info
      setLiffInfo(prev => ({
        ...prev,
        currentUrl: window.location.href,
        isSecure: window.isSecureContext,
        environment: typeof window !== "undefined" ? "browser" : "server",
      }));

      // Try to initialize LIFF
      await LineService.init();

      // Get LIFF information
      const info: LiffInfo = {
        isInitialized: true,
        isLoggedIn: await LineService.isLoggedIn(),
        isInClient: LineService.isInClient(),
        environment: typeof window !== "undefined" ? "browser" : "server",
        currentUrl: window.location.href,
        isSecure: window.isSecureContext,
      };

      // Add LIFF-specific info if available
      if (typeof window !== "undefined" && (window as any).liff) {
        const liff = (window as any).liff;
        info.liffId = liff.id;
        info.version = liff.getVersion();
        info.os = liff.getOS();
        info.language = liff.getAppLanguage();
      }

      setLiffInfo(info);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    try {
      await LineService.login();
      await checkLiffStatus(); // Refresh status
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  useEffect(() => {
    checkLiffStatus();
  }, []);

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  const getStatusIcon = (status: boolean) => {
    return status ? "✅" : "❌";
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md border border-gray-200 z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">LIFF Debug Panel</h3>
        <button
          onClick={checkLiffStatus}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Checking..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className={getStatusColor(liffInfo.isInitialized)}>
              {getStatusIcon(liffInfo.isInitialized)} Initialized
            </span>
          </div>
          <div>
            <span className={getStatusColor(liffInfo.isLoggedIn)}>
              {getStatusIcon(liffInfo.isLoggedIn)} Logged In
            </span>
          </div>
          <div>
            <span className={getStatusColor(liffInfo.isInClient)}>
              {getStatusIcon(liffInfo.isInClient)} In LINE App
            </span>
          </div>
          <div>
            <span className={getStatusColor(liffInfo.isSecure)}>
              {getStatusIcon(liffInfo.isSecure)} HTTPS
            </span>
          </div>
        </div>

        {liffInfo.liffId && (
          <div>
            <strong>LIFF ID:</strong> {liffInfo.liffId}
          </div>
        )}

        {liffInfo.version && (
          <div>
            <strong>LIFF Version:</strong> {liffInfo.version}
          </div>
        )}

        {liffInfo.os && (
          <div>
            <strong>OS:</strong> {liffInfo.os}
          </div>
        )}

        <div>
          <strong>Current URL:</strong>
          <div className="break-all text-gray-600 mt-1">
            {liffInfo.currentUrl}
          </div>
        </div>

        <div>
          <strong>Environment:</strong> {liffInfo.environment}
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          onClick={testLogin}
          className="px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
          disabled={!liffInfo.isInitialized || loading}
        >
          Test Login
        </button>
        <button
          onClick={() => {
            if (typeof window !== "undefined" && (window as any).liff) {
              (window as any).liff.logout();
              checkLiffStatus();
            }
          }}
          className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
          disabled={!liffInfo.isLoggedIn}
        >
          Logout
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <strong>Quick Tips:</strong>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Always use HTTPS for LIFF development</li>
          <li>Update LINE Developer Console with tunnel URL</li>
          <li>Check browser console for detailed errors</li>
          <li>Verify LIFF ID matches your console settings</li>
        </ul>
      </div>
    </div>
  );
}