// src/components/common/Header/MobileMenu.tsx
import React from 'react';
import Link from 'next/link';
import { Flame, Search, User, MessageCircle, Bell, LogOut } from 'lucide-react';

interface MobileMenuProps {
  isLoggedIn: boolean;
  notifications: number;
  unreadMessages: number;
  isActiveLink: (path: string) => boolean;
  onLogout: () => void;
  onItemClick: () => void;
}

const MobileMenu = ({
  isLoggedIn,
  notifications,
  unreadMessages,
  isActiveLink,
  onLogout,
  onItemClick
}: MobileMenuProps) => {
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50">
      <div className="container mx-auto px-4">
        <nav className="flex justify-around items-center h-16">
          <Link
            href="/browse"
            className={`flex flex-col items-center justify-center w-full py-2 ${
              isActiveLink('/browse') ? 'text-green-500' : 'text-gray-500'
            }`}
            onClick={onItemClick}
          >
            <Flame
              size={24}
              className={isActiveLink('/browse') ? 'text-green-500' : 'text-gray-400'}
            />
            <span className="text-xs mt-1 font-medium">Discover</span>
          </Link>

          <Link
            href="/search"
            className={`flex flex-col items-center justify-center w-full py-2 ${
              isActiveLink('/search') ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={onItemClick}
          >
            <Search
              size={24}
              className={isActiveLink('/search') ? 'text-pink-500' : 'text-gray-400'}
            />
            <span className="text-xs mt-1 font-medium">Explore</span>
          </Link>

          <Link
            href="/messages"
            className={`flex flex-col items-center justify-center w-full py-2 ${
              isActiveLink('/messages') ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={onItemClick}
          >
            <div className="relative">
              <MessageCircle
                size={24}
                className={isActiveLink('/messages') ? 'text-pink-500' : 'text-gray-400'}
              />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pink-500 text-white text-xs font-bold">
                  {unreadMessages > 9 ? '9+' : unreadMessages}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Messages</span>
          </Link>

          <Link
            href="/notifications"
            className={`flex flex-col items-center justify-center w-full py-2 ${
              isActiveLink('/notifications') ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={onItemClick}
          >
            <div className="relative">
              <Bell
                size={24}
                className={isActiveLink('/notifications') ? 'text-pink-500' : 'text-gray-400'}
              />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-pink-500 text-white text-xs font-bold">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </div>
            <span className="text-xs mt-1 font-medium">Activity</span>
          </Link>

          <Link
            href="/profile"
            className={`flex flex-col items-center justify-center w-full py-2 ${
              isActiveLink('/profile') ? 'text-pink-500' : 'text-gray-500'
            }`}
            onClick={onItemClick}
          >
            <User
              size={24}
              className={isActiveLink('/profile') ? 'text-pink-500' : 'text-gray-400'}
            />
            <span className="text-xs mt-1 font-medium">Profile</span>
          </Link>

          <button
            className="flex flex-col items-center justify-center w-full py-2 text-gray-500"
            onClick={() => {
              onLogout();
              onItemClick();
            }}
          >
            <LogOut size={24} className="text-gray-400" />
            <span className="text-xs mt-1 font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
