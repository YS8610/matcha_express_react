'use client';

import React from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import Header from '@/components/common/Header/Header';
import Footer from '@/components/common/Footer/Footer';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="app-layout">
            <Header />
            <main className="main-content">
              <div className="container">
                {children}
              </div>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
