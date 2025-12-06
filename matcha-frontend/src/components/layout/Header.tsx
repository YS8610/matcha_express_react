'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();

  const navLinkClass = 'btn-secondary text-xs md:text-sm lg:text-sm whitespace-nowrap';

  return (
    <header className="relative z-40 shadow-md border-b bg-neutral-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-full">
        <div className="flex justify-between items-center h-14 sm:h-16 min-w-0">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold flex-shrink-0 group">
            <div className="bg-gradient-to-br from-brand-green to-emerald-700 dark:from-brand-lime dark:to-lime-600 p-1 sm:p-1.5 md:p-1.5 lg:p-2 rounded-full transition-transform group-hover:scale-110">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-brand-green to-emerald-700 dark:from-brand-lime dark:to-lime-600 bg-clip-text text-transparent hidden sm:inline font-bold text-lg sm:text-2xl md:text-2xl lg:text-3xl">
              Matcha
            </span>
          </Link>

          <nav className="hidden lg:flex space-x-2 xl:space-x-4 flex-grow justify-center mx-2 xl:mx-6 min-w-0">
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

          <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
            <ThemeToggle />

            {user ? (
              <>
                <NotificationCenter />
                <span className="text-sm xl:text-base font-bold text-gray-900 dark:text-white hidden xl:inline">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm xl:text-base font-bold text-brand-green dark:text-brand-lime hover:text-brand-green-hover dark:hover:text-brand-lime-hover transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="gap-2 xl:gap-3 flex items-center">
                <Link
                  href="/login"
                  className="btn-secondary text-xs xl:text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="btn-primary dark:btn-primary-dark text-xs sm:text-sm"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
