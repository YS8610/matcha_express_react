'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf, MapPin } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-40 shadow-md border-b" style={{ backgroundColor: 'var(--header-bg)', borderColor: 'var(--border)', color: 'var(--header-text)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-2xl sm:text-3xl font-bold flex-shrink-0">
            <div className="bg-gradient-to-br from-matcha-medium to-matcha-dark p-1.5 sm:p-2 rounded-full">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-matcha-dark to-matcha-medium dark:from-matcha-accent dark:to-matcha-light bg-clip-text text-transparent hidden sm:inline">
              Matcha
            </span>
          </Link>

          <nav className="hidden md:flex space-x-4 lg:space-x-6 flex-grow justify-center mx-4 lg:mx-8">
            {user && (
              <>
                <Link href="/browse" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Browse
                </Link>
                <Link href="/visitors" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Visitors
                </Link>
                <Link href="/likes" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Likes
                </Link>
                <Link href="/blocked" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Blocked
                </Link>
                <Link href="/messages" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Messages
                </Link>
                <Link href="/map" className="font-bold transition-colors text-base flex items-center gap-1" style={{ color: 'var(--button-bg)' }}>
                  <MapPin className="w-4 h-4" />
                  Map
                </Link>
                <Link href="/profile" className="font-bold transition-colors text-base" style={{ color: 'var(--button-bg)' }}>
                  Profile
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <>
                <NotificationCenter />
                <span className="text-base font-bold" style={{ color: 'var(--header-text)' }}>
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-base font-bold transition-colors"
                  style={{ color: 'var(--button-bg)' }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-base font-bold transition-colors" style={{ color: 'var(--button-bg)' }}>
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 rounded font-bold transition-all text-base"
                  style={{ backgroundColor: 'var(--button-bg)', color: 'var(--button-text)' }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
