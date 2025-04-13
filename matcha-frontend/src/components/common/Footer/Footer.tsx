// src/components/common/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer bg-light py-6">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12 col-md-3 mb-4 mb-md-0">
            <div className="footer-logo mb-3">
              <span className="matcha-icon">🍵</span>
              <span className="fw-bold ms-2">Web Matcha</span>
            </div>
            <div className="social-links d-flex gap-3">
              <a href="https://facebook.com" className="social-link" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://tiktok.com" className="social-link" aria-label="TikTok">
                <FaTiktok />
              </a>
              <a href="https://youtube.com" className="social-link" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
          
          <div className="col-6 col-md-3">
            <h6 className="footer-heading mb-3">LEGAL</h6>
            <ul className="footer-links-list p-0">
              <li><Link href="/privacy" className="footer-link">Privacy</Link></li>
              <li><Link href="/terms" className="footer-link">Terms</Link></li>
              <li><Link href="/cookie-policy" className="footer-link">Cookie Policy</Link></li>
              <li><Link href="/intellectual-property" className="footer-link">Intellectual Property</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-md-3">
            <h6 className="footer-heading mb-3">CAREERS</h6>
            <ul className="footer-links-list p-0">
              <li><Link href="/careers" className="footer-link">Careers Portal</Link></li>
              <li><Link href="/tech-blog" className="footer-link">Tech Blog</Link></li>
            </ul>
          </div>
          
          <div className="col-6 col-md-3">
            <h6 className="footer-heading mb-3">COMPANY</h6>
            <ul className="footer-links-list p-0">
              <li><Link href="/about" className="footer-link">About</Link></li>
              <li><Link href="/contact" className="footer-link">Contact</Link></li>
              <li><Link href="/press" className="footer-link">Press</Link></li>
              <li><Link href="/faq" className="footer-link">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom pt-4 border-top d-flex flex-wrap justify-content-between align-items-center">
          <div className="language-selector mb-3 mb-md-0">
            <select className="form-select form-select-sm">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          
          <div className="copyright text-muted small">
            &copy; {new Date().getFullYear()} Web Matcha. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
