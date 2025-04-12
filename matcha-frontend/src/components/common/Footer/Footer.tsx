import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
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
  );
};

export default Footer;
