'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

const liffId = process.env.NEXT_PUBLIC_LIFF_ID || '';

type Profile = {
  displayName: string;
  userId: string;
  pictureUrl?: string;
  statusMessage?: string;
};

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [liffReady, setLiffReady] = useState(false);

  useEffect(() => {
    async function initLiff() {
      try {
        await liff.init({ liffId });

        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setLiffReady(true);
        }
      } catch (error) {
        console.error('LIFF initialization error:', error);
      }
    }
    initLiff();
  }, []);

  if (!liffReady) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: 12,
          padding: 16,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: '4px solid #f0f0f0',
            borderTop: '4px solid #0084ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <div>Logging in...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <h2>Welcome, {profile?.displayName}</h2>
      {profile?.pictureUrl && (
        <img src={profile.pictureUrl} alt="Profile" width={96} height={96} />
      )}
      <p>User ID: {profile?.userId}</p>
      <p>Status: {profile?.statusMessage}</p>
      <button
        onClick={async () => {
          try {
            await liff.logout();
            setProfile(null);
            setLiffReady(false);
            window.location.reload();
          } catch (error) {
            console.error('LIFF logout error:', error);
          }
        }}
      >
        Logout
      </button>
    </div>
  );
}
