'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationCenter from '@/components/NotificationCenter';
import { ThemeToggle } from './ThemeToggle';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    const baseClass = 'text-xs md:text-sm lg:text-sm whitespace-nowrap px-3 xl:px-4 py-1.5 xl:py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-sm';

    if (isActive) {
      return `${baseClass} bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 dark:from-green-700 dark:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 text-green-800 dark:text-white border-2 border-green-600 dark:border-transparent`;
    }

    return `${baseClass} bg-white hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:border-green-700 dark:hover:border-green-400`;
  };

  return (
    <header className="relative z-40 shadow-md border-b bg-neutral-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 max-w-full">
        <div className="flex justify-between items-center h-14 sm:h-16 min-w-0">
          <Link href="/" className="flex items-center gap-1 sm:gap-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-bold flex-shrink-0 group">
            <div className="bg-gradient-to-br from-brand-green to-emerald-700 dark:from-brand-lime dark:to-lime-600 p-1 sm:p-1.5 md:p-1.5 lg:p-2 rounded-full transition-transform group-hover:scale-110">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <span className="text-brand-green dark:text-brand-lime hidden sm:inline font-bold text-lg sm:text-2xl md:text-2xl lg:text-3xl">
              Matcha
            </span>
          </Link>

          <nav className="hidden lg:flex space-x-2 xl:space-x-4 flex-grow justify-center mx-2 xl:mx-6 min-w-0">
            {user && (
              <>
                <Link href="/browse" className={getNavLinkClass('/browse')}>
                  Browse
                </Link>
                <Link href="/visitors" className={getNavLinkClass('/visitors')}>
                  Visitors
                </Link>
                <Link href="/likes" className={getNavLinkClass('/likes')}>
                  Likes
                </Link>
                <Link href="/blocked" className={getNavLinkClass('/blocked')}>
                  Blocked
                </Link>
                <Link href="/messages" className={getNavLinkClass('/messages')}>
                  Messages
                </Link>
                <Link href="/profile" className={getNavLinkClass('/profile')}>
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
                  className="px-3 xl:px-4 py-1.5 xl:py-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg font-medium text-xs xl:text-sm transition-all transform hover:scale-105 shadow-md"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="gap-2 xl:gap-3 flex items-center">
                <Link
                  href="/login"
                  className={getNavLinkClass('/login')}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={getNavLinkClass('/register')}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            {user && <NotificationCenter />}
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
