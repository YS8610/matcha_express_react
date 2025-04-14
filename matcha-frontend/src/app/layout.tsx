// src/app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import ClientProviders from '@/components/providers/ClientProviders';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web Matcha',
  description: 'Because love, too, can be industrialized.',
  icons: {
    icon: '/favicon.ico',
  }
}

// i am using tailwind css version 4, cheatsheet located at tailwindcs.md
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>
          <div className="app-layout">
            <Header />
            <main className="main-content">
              <div className="container">
                {/* children}
              </div>
            </main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
