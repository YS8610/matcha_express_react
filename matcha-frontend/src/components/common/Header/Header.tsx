'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Bell, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import MobileMenu from './MobileMenu';
import styles from './Header.module.css';

export const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications] = useState(5);
  const [unreadMessages] = useState(3);
  const pathname = usePathname();

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContent}`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.matchaIcon}>🍵</span>
          <span>Web Matcha</span>
        </Link>

        <nav>
          <ul className={styles.navMenu}>
            {isLoggedIn ? (
              <>
                <li>
                  <Link
                    href="/browse"
                    className={`${styles.navLink} ${isActiveLink('/browse') ? styles.active : ''}`}
                  >
                    Browse
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className={`${styles.navLink} ${isActiveLink('/search') ? styles.active : ''}`}
                  >
                    Search
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    href="/about"
                    className={`${styles.navLink} ${isActiveLink('/about') ? styles.active : ''}`}
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/features"
                    className={`${styles.navLink} ${isActiveLink('/features') ? styles.active : ''}`}
                  >
                    Features
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <div>
          {isLoggedIn ? (
            <div className={styles.userActions}>
              <Link href="/search" className="btn-icon">
                <Search size={20} />
              </Link>

              <div className={styles.notificationBadge}>
                <Link href="/notifications" className="btn-icon">
                  <Bell size={20} />
                  {notifications > 0 && (
                    <span className={styles.notificationCount}>{notifications}</span>
                  )}
                </Link>
              </div>

              <div className={styles.notificationBadge}>
                <Link href="/messages" className="btn-icon">
                  <MessageCircle size={20} />
                  {unreadMessages > 0 && (
                    <span className={styles.notificationCount}>{unreadMessages}</span>
                  )}
                </Link>
              </div>

              <Link href="/profile" className="btn-icon">
                <User size={20} />
              </Link>

              <button onClick={logout} className="btn-icon">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className="btn btn-outline">
                Log In
              </Link>
              <Link href="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          <button className={`${styles.mobileNavToggle} btn-icon`} onClick={toggleMobileNav}>
            {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
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
