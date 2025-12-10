import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/contexts/ToastContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RouteChangeProgress from "@/components/RouteChangeProgress";
import ToastContainer from "@/components/Toast/ToastContainer";

export const metadata: Metadata = {
  title: "Matcha - Find Your Perfect Match",
  description: "A modern dating app to find meaningful connections",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.svg',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#689f38',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          content={`(function(){const t=localStorage.getItem('theme');let h=t||window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';const e=document.documentElement;h==='dark'?e.classList.add('dark'):e.classList.remove('dark');e.setAttribute('data-theme',h);})()`}
        />
        {process.env.NODE_ENV === 'development' && (
          <Script
            id="suppress-logs"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  const originalLog = console.log;
                  console.log = function(...args) {
                    const message = args.join(' ');
                    if (message.includes('[Fast Refresh]') || message.includes('[HMR]')) {
                      return;
                    }
                    originalLog.apply(console, args);
                  };
                })();
              `,
            }}
          />
        )}
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <WebSocketProvider>
                <RouteChangeProgress />
                <ToastContainer />
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1">{children}</main>
                  <Footer />
                </div>
              </WebSocketProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
