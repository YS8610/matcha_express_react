'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Leaf } from 'lucide-react';
import Link from 'next/link';
import NotificationCenter from '@/components/NotificationCenter';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="relative z-40 bg-gradient-to-r from-green-50 to-green-100/50 shadow-md border-b border-green-200 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-full">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">Matcha</span>
            </Link>

            <nav className="ml-10 flex space-x-4">
              {user && (
                <>
                  <Link href="/browse" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Browse
                  </Link>
                  <Link href="/search" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Search
                  </Link>
                  <Link href="/visitors" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Visitors
                  </Link>
                  <Link href="/likes" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Likes
                  </Link>
                  <Link href="/blocked" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Blocked
                  </Link>
                  <Link href="/messages" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Messages
                  </Link>
                  <Link href="/profile" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                    Profile
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NotificationCenter />
                <span className="text-sm text-green-700 font-medium">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-green-600 hover:text-green-800 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-x-4">
                <Link href="/login" className="text-green-700 hover:text-green-900 font-medium transition-colors">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-5 py-2 rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}