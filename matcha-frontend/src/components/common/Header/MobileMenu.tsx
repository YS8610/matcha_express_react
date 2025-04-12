import React from 'react';
import Link from 'next/link';
import styles from './MobileMenu.module.css';

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
  return (
    <div className={styles.mobileNav}>
      <div className="container">
        <ul className={styles.mobileNavMenu}>
          {isLoggedIn ? (
            <>
              <li>
                <Link
                  href="/browse"
                  className={`${styles.mobileNavLink} ${isActiveLink('/browse') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Browse
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className={`${styles.mobileNavLink} ${isActiveLink('/search') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className={`${styles.mobileNavLink} ${isActiveLink('/profile') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  href="/messages"
                  className={`${styles.mobileNavLink} ${isActiveLink('/messages') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Messages
                  {unreadMessages > 0 && <span className={styles.badge}>{unreadMessages}</span>}
                </Link>
              </li>
              <li>
                <Link
                  href="/notifications"
                  className={`${styles.mobileNavLink} ${isActiveLink('/notifications') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Notifications
                  {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
                </Link>
              </li>
              <li>
                <button
                  className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                  onClick={() => {
                    onLogout();
                    onItemClick();
                  }}
                >
                  Log Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href="/about"
                  className={`${styles.mobileNavLink} ${isActiveLink('/about') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className={`${styles.mobileNavLink} ${isActiveLink('/features') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className={`${styles.mobileNavLink} ${isActiveLink('/login') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className={`${styles.mobileNavLink} ${isActiveLink('/register') ? styles.active : ''}`}
                  onClick={onItemClick}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
