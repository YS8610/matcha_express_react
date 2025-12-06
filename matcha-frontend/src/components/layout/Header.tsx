'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();

  const navLinkClass = 'font-bold text-base transition-colors duration-200 text-brand-green dark:text-brand-lime hover:text-brand-green-hover dark:hover:text-brand-lime-hover';

  return (
    <header className="relative z-40 shadow-md border-b bg-neutral-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
      <div className="container-safe">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-2xl sm:text-3xl font-bold flex-shrink-0 group">
            <div className="bg-gradient-to-br from-brand-green to-emerald-700 dark:from-brand-lime dark:to-lime-600 p-1.5 sm:p-2 rounded-full transition-transform group-hover:scale-110">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-brand-green to-emerald-700 dark:from-brand-lime dark:to-lime-600 bg-clip-text text-transparent hidden sm:inline font-bold">
              Matcha
            </span>
          </Link>

          <nav className="hidden md:flex space-x-4 lg:space-x-6 flex-grow justify-center mx-4 lg:mx-8">
            {user && (
              <>
                <Link href="/browse" className={navLinkClass}>
                  Browse
                </Link>
                <Link href="/visitors" className={navLinkClass}>
                  Visitors
                </Link>
                <Link href="/likes" className={navLinkClass}>
                  Likes
                </Link>
                <Link href="/blocked" className={navLinkClass}>
                  Blocked
                </Link>
                <Link href="/messages" className={navLinkClass}>
                  Messages
                </Link>
                <Link href="/profile" className={navLinkClass}>
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
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-base font-bold text-brand-green dark:text-brand-lime hover:text-brand-green-hover dark:hover:text-brand-lime-hover transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-3 flex items-center">
                <Link
                  href="/login"
                  className="text-base font-bold text-brand-green dark:text-brand-lime hover:text-brand-green-hover dark:hover:text-brand-lime-hover transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary dark:btn-primary-dark text-sm sm:text-base"
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
