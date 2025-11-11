import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "ShareTrust - Safe Subscription Sharing",
    template: "%s | ShareTrust",
  },
  description:
    "ShareTrust enables safe subscription sharing through LINE integration with trust scoring, escrow payments, and fraud detection.",
  keywords: [
    "subscription sharing",
    "LINE",
    "trust scoring",
    "escrow",
    "fraud detection",
  ],
  authors: [{ name: "ShareTrust Team" }],
  openGraph: {
    title: "ShareTrust - Safe Subscription Sharing",
    description:
      "ShareTrust enables safe subscription sharing through LINE integration with trust scoring, escrow payments, and fraud detection.",
    type: "website",
    locale: "en_US",
    siteName: "ShareTrust",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareTrust - Safe Subscription Sharing",
    description:
      "ShareTrust enables safe subscription sharing through LINE integration with trust scoring, escrow payments, and fraud detection.",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
  themeColor: "#00C300",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ShareTrust",
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(inter.variable, "h-full")}>
      <head>
        <meta name="theme-color" content="#00C300" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ShareTrust" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="ShareTrust" />
        <meta name="msapplication-TileColor" content="#00C300" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Prevent zoom on input focus in iOS */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* LINE LIFF meta tags */}
        <meta property="line:app" content="true" />
        <meta property="line:login" content="true" />
      </head>
      <body className="h-full bg-[rgb(var(--color-bg-primary))] text-[rgb(var(--color-text-primary))] antialiased">
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[rgb(var(--color-brand-primary))] text-white px-4 py-2 rounded-md"
        >
          Skip to main content
        </a>

        <div id="root" className="h-full">
          <main id="main-content" className="h-full">
            {children}
          </main>
        </div>

        {/* Loading screen script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Show loading screen until the app is ready
              document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                  const loader = document.getElementById('initial-loader');
                  if (loader) {
                    loader.style.opacity = '0';
                    setTimeout(function() {
                      loader.style.display = 'none';
                    }, 300);
                  }
                }, 100);
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
