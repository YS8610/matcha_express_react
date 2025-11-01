'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-40 bg-gradient-to-r from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50 shadow-md border-b border-green-200 dark:border-green-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-2xl sm:text-3xl font-bold flex-shrink-0">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-1.5 sm:p-2 rounded-full">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-700 to-green-500 dark:from-green-200 dark:to-green-50 bg-clip-text text-transparent hidden sm:inline">
              Matcha
            </span>
          </Link>

          <nav className="hidden md:flex space-x-6 flex-grow justify-center mx-8">
            {user && (
              <>
                <Link href="/browse" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Browse
                </Link>
                <Link href="/search" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Search
                </Link>
                <Link href="/visitors" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Visitors
                </Link>
                <Link href="/likes" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Likes
                </Link>
                <Link href="/blocked" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Blocked
                </Link>
                <Link href="/messages" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Messages
                </Link>
                <Link href="/profile" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
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
                <span className="text-base text-green-800 dark:text-green-100 font-semibold">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-base text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold transition-colors text-base">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2 rounded-full hover:from-green-700 hover:to-green-600 font-semibold transition-all transform hover:scale-105 shadow-md dark:from-green-700 dark:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 text-base"
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
