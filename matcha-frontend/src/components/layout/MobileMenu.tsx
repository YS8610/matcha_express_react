'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const closeMenu = () => setIsOpen(false);

  const getMobileNavLinkClass = (href: string) => {
    const isActive = pathname === href || pathname?.startsWith(`${href}/`);
    const baseClass = 'block w-full text-sm text-center py-3 px-4 rounded-md font-medium transition-all';

    if (isActive) {
      return `${baseClass} bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 dark:from-green-700 dark:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 text-green-800 dark:text-white border-2 border-green-600 dark:border-transparent shadow-md`;
    }

    return `${baseClass} bg-white hover:bg-green-50 dark:bg-slate-800 dark:hover:bg-slate-700 border-2 border-green-600 dark:border-green-500 text-green-700 dark:text-green-400 hover:border-green-700 dark:hover:border-green-400`;
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 right-0 left-0 bg-white dark:bg-slate-900 border-b border-green-200 dark:border-green-800 shadow-lg z-50">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {user && (
              <>
                <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Logged in as</p>
                  <p className="font-semibold text-green-800 dark:text-green-100 text-base">
                    {user.username}
                  </p>
                </div>

                <Link
                  href="/browse"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/browse')}
                >
                  Browse
                </Link>
                <Link
                  href="/visitors"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/visitors')}
                >
                  Visitors
                </Link>
                <Link
                  href="/likes"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/likes')}
                >
                  Likes
                </Link>
                <Link
                  href="/blocked"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/blocked')}
                >
                  Blocked
                </Link>
                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/messages')}
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/profile')}
                >
                  Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full mt-4 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-md font-semibold text-base transition-colors"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/login')}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className={getMobileNavLinkClass('/register')}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
