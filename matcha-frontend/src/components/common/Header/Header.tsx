// src/components/common/Header/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Bell, User, Menu, X, Flame } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MobileMenu from './MobileMenu';

export const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications] = useState(5);
  const [unreadMessages] = useState(3);
  const pathname = usePathname();

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const isActiveLink = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-[100] bg-white shadow-sm py-3">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="md:w-1/3 flex justify-start">
          {isLoggedIn && (
            <Link href="/profile" className="md:hidden flex items-center">
              <User size={24} className="text-gray-500" />
            </Link>
          )}
        </div>

        <div className="md:w-1/3 flex justify-center">
          <Link href="/" className="flex items-center">
            <Flame
              size={28}
              className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-lime-500"
            />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-green-500 to-lime-500 text-transparent bg-clip-text">
              matcha
            </span>
          </Link>
        </div>

        <div className="md:w-1/3 flex justify-end items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-5">
              <Link href="/messages" className="hidden md:flex relative">
                <MessageCircle
                  size={24}
                  className="text-gray-500 hover:text-green-500 transition-colors"
                />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white text-xs font-bold">
                    {unreadMessages}
                  </span>
                )}
              </Link>

              <Link href="/notifications" className="hidden md:flex relative">
                <Bell
                  size={24}
                  className="text-gray-500 hover:text-pink-500 transition-colors"
                />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs font-bold">
                    {notifications}
                  </span>
                )}
              </Link>

              <Link href="/profile" className="hidden md:flex">
                <User
                  size={24}
                  className="text-gray-500 hover:text-pink-500 transition-colors"
                />
              </Link>

              <button className="md:hidden" onClick={toggleMobileNav}>
                {mobileNavOpen ? (
                  <X size={24} className="text-gray-500" />
                ) : (
                  <Menu size={24} className="text-gray-500" />
                )}
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-medium text-sm hover:border-pink-400 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {mobileNavOpen && (
        <MobileMenu
          isLoggedIn={isLoggedIn}
          notifications={notifications}
          unreadMessages={unreadMessages}
          isActiveLink={isActiveLink}
          onLogout={logout}
          onItemClick={toggleMobileNav}
        />
      )}
    </header>
  );
};

export default Header;
