'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <div className="md:hidden flex items-center gap-2">
      <ThemeToggle />
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
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Browse
                </Link>
                <Link
                  href="/visitors"
                  onClick={closeMenu}
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Visitors
                </Link>
                <Link
                  href="/likes"
                  onClick={closeMenu}
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Likes
                </Link>
                <Link
                  href="/blocked"
                  onClick={closeMenu}
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Blocked
                </Link>
                <Link
                  href="/messages"
                  onClick={closeMenu}
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Messages
                </Link>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
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
                  className="block py-2 text-green-800 dark:text-green-100 hover:text-green-900 dark:hover:text-green-50 font-semibold text-base transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="block py-3 px-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-md font-semibold text-base hover:from-green-700 hover:to-green-600 dark:from-green-700 dark:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 transition-all text-center"
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
