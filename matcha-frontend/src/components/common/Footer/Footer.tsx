// src/components/common/Footer/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <div className="flex items-center mb-3">
              <span className="text-2xl">🍵</span>
              <span className="font-bold ml-2 text-lg">Web Matcha</span>
            </div>
            <div className="flex gap-3">
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-600 hover:text-gray-800">
                <FaFacebook size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-600 hover:text-gray-800">
                <FaTwitter size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-600 hover:text-gray-800">
                <FaInstagram size={20} />
              </a>
              <a href="https://tiktok.com" aria-label="TikTok" className="text-gray-600 hover:text-gray-800">
                <FaTiktok size={20} />
              </a>
              <a href="https://youtube.com" aria-label="YouTube" className="text-gray-600 hover:text-gray-800">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>

          <div>
            <h6 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Legal</h6>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Privacy</a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Terms</a>
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Cookie Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/intellectual-property">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Intellectual Property</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Careers</h6>
            <ul className="space-y-2">
              <li>
                <Link href="/careers">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Careers Portal</a>
                </Link>
              </li>
              <li>
                <Link href="/tech-blog">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Tech Blog</a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="text-sm font-semibold text-gray-700 mb-3 uppercase">Company</h6>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">About</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Contact</a>
                </Link>
              </li>
              <li>
                <Link href="/press">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">Press</a>
                </Link>
              </li>
              <li>
                <Link href="/faq">
                  <a className="text-gray-600 hover:text-gray-800 text-sm">FAQ</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="mb-3 md:mb-0">
            <select className="block w-full sm:w-auto rounded border border-gray-300 p-2 text-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Web Matcha. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
