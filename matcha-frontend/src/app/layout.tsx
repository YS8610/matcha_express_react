'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageCircle, Bell, User, Search, Menu, X, LogOut } from 'lucide-react';

import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [notifications] = useState(5);
  const [unreadMessages] = useState(3);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('matchaAuthToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuthStatus();
  }, []);

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('matchaAuthToken');
    setIsLoggedIn(false);
  };

  const isActiveLink = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo">
            <span className="matcha-icon">🍵</span>
            <span>Web Matcha</span>
          </Link>

          <nav className="nav-desktop">
            <ul className="nav-menu">
              {isLoggedIn ? (
                <>
                  <li>
                    <Link 
                      href="/browse" 
                      className={`nav-link ${isActiveLink('/browse') ? 'active' : ''}`}
                    >
                      Browse
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/search" 
                      className={`nav-link ${isActiveLink('/search') ? 'active' : ''}`}
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
                      className={`nav-link ${isActiveLink('/about') ? 'active' : ''}`}
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/features" 
                      className={`nav-link ${isActiveLink('/features') ? 'active' : ''}`}
                    >
                      Features
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="auth-section">
            {isLoggedIn ? (
              <div className="user-actions d-flex gap-md align-items-center">
                <Link href="/search" className="btn-icon">
                  <Search size={20} />
                </Link>
                
                <div className="notification-badge">
                  <Link href="/notifications" className="btn-icon">
                    <Bell size={20} />
                    {notifications > 0 && (
                      <span className="notification-count">{notifications}</span>
                    )}
                  </Link>
                </div>
                
                <div className="notification-badge">
                  <Link href="/messages" className="btn-icon">
                    <MessageCircle size={20} />
                    {unreadMessages > 0 && (
                      <span className="notification-count">{unreadMessages}</span>
                    )}
                  </Link>
                </div>
                
                <Link href="/profile" className="btn-icon">
                  <User size={20} />
                </Link>
                
                <button onClick={handleLogout} className="btn-icon">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/login" className="btn btn-outline">
                  Log In
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
            
            <button className="mobile-nav-toggle btn-icon" onClick={toggleMobileNav}>
              {mobileNavOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {mobileNavOpen && (
          <div className="mobile-nav">
            <div className="container">
              <ul className="mobile-nav-menu">
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link 
                        href="/browse" 
                        className={`mobile-nav-link ${isActiveLink('/browse') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Browse
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/search" 
                        className={`mobile-nav-link ${isActiveLink('/search') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Search
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/profile" 
                        className={`mobile-nav-link ${isActiveLink('/profile') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/messages" 
                        className={`mobile-nav-link ${isActiveLink('/messages') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Messages
                        {unreadMessages > 0 && <span className="badge">{unreadMessages}</span>}
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/notifications" 
                        className={`mobile-nav-link ${isActiveLink('/notifications') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Notifications
                        {notifications > 0 && <span className="badge">{notifications}</span>}
                      </Link>
                    </li>
                    <li>
                      <button 
                        className="mobile-nav-link logout-button"
                        onClick={() => {
                          handleLogout();
                          toggleMobileNav();
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
                        className={`mobile-nav-link ${isActiveLink('/about') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/features" 
                        className={`mobile-nav-link ${isActiveLink('/features') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/login" 
                        className={`mobile-nav-link ${isActiveLink('/login') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Log In
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/register" 
                        className={`mobile-nav-link ${isActiveLink('/register') ? 'active' : ''}`}
                        onClick={toggleMobileNav}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        )}
      </header>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-logo">
            <span className="matcha-icon">🍵</span>
            <span className="fw-bold">Web Matcha</span>
          </div>
          
          <div className="footer-links">
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/contact" className="footer-link">Contact Us</Link>
          </div>
          
          <div className="copyright">
            &copy; {new Date().getFullYear()} Web Matcha. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .mobile-nav {
          padding: var(--spacing-md) 0;
          border-top: 1px solid var(--matcha-divider);
          background-color: var(--matcha-card-bg);
        }
        
        .mobile-nav-menu {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--spacing-sm) 0;
          color: var(--matcha-text);
          font-weight: 500;
          font-size: var(--font-md);
        }
        
        .mobile-nav-link.active {
          color: var(--matcha-primary);
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--matcha-secondary);
          color: white;
          font-size: var(--font-xs);
          font-weight: bold;
        }
        
        .logout-button {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
        }
        
        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background-color: var(--matcha-secondary);
          color: white;
          font-size: 10px;
          font-weight: bold;
        }
        
        .matcha-icon {
          font-size: 24px;
          margin-right: var(--spacing-xs);
        }
      `}</style>
    </div>
  );
}
