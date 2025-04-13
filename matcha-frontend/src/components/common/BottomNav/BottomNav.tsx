// src/components/common/BottomNav/BottomNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Flame, MessageCircle, User, Star, Compass } from 'lucide-react';

export const BottomNav = () => {
  const pathname = usePathname();

  const isActiveLink = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 py-2 md:hidden">
      <div className="container mx-auto px-4">
        <ul className="flex justify-around items-center">
          <li>
            <Link
              href="/browse"
              className={`flex flex-col items-center ${isActiveLink('/browse') ? 'text-pink-500' : 'text-gray-500'}`}
            >
              <Compass size={24} />
              <span className="text-xs mt-1">Explore</span>
            </Link>
          </li>
          <li>
            <Link
              href="/discover"
              className={`flex flex-col items-center ${isActiveLink('/discover') ? 'text-pink-500' : 'text-gray-500'}`}
            >
              <Flame size={24} />
              <span className="text-xs mt-1">Discover</span>
            </Link>
          </li>
          <li>
            <Link
              href="/starred"
              className={`flex flex-col items-center ${isActiveLink('/starred') ? 'text-pink-500' : 'text-gray-500'}`}
            >
              <Star size={24} />
              <span className="text-xs mt-1">Starred</span>
            </Link>
          </li>
          <li>
            <Link
              href="/messages"
              className={`flex flex-col items-center ${isActiveLink('/messages') ? 'text-pink-500' : 'text-gray-500'}`}
            >
              <MessageCircle size={24} />
              <span className="text-xs mt-1">Messages</span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className={`flex flex-col items-center ${isActiveLink('/profile') ? 'text-pink-500' : 'text-gray-500'}`}
            >
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
