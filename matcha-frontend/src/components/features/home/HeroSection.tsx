// src/components/features/home/HeroSection.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// Hero in websites are just attention grabbing portion
const HeroSection = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section className="relative min-h-screen bg-linear-to-r from-green-500 to-emerald-500 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-pattern" />
      </div>

      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center text-white relative z-10 h-full">
        <div className="mb-6">
          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="white">
            <path d="M12,1.5 C6.2,1.5 1.5,6.2 1.5,12 C1.5,17.8 6.2,22.5 12,22.5 C17.8,22.5 22.5,17.8 22.5,12 C22.5,6.2 17.8,1.5 12,1.5 Z M12,11.3 C11.3,11.3 10.7,10.7 10.7,10 C10.7,9.3 11.3,8.7 12,8.7 C12.7,8.7 13.3,9.3 13.3,10 C13.3,10.7 12.7,11.3 12,11.3 Z M16,16 C14.9,17.3 13.5,18 12,18 C10.5,18 9.1,17.3 8,16 C7.8,15.7 7.8,15.4 8.1,15.1 C8.4,14.8 8.7,14.9 9,15.1 C9.9,16.3 10.9,16.8 12,16.8 C13.1,16.8 14.1,16.3 15,15.1 C15.3,14.9 15.6,14.8 15.9,15.1 C16.2,15.4 16.2,15.7 16,16 Z" />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-4">Swipe Right®</h1>
        <p className="text-xl md:text-2xl mb-10 max-w-lg">
          Create meaningful connections with people who share your interests.
        </p>

        {!isLoggedIn && (
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link href="/register" className="w-full py-4 px-6 bg-white text-green-600 font-bold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
              CREATE ACCOUNT
            </Link>
            <Link href="/about" className="w-full py-4 px-6 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-colors">
              LEARN MORE
            </Link>
          </div>
        )}

        {!isLoggedIn && (
          <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
            <p className="text-white/80 mr-4">Get the app:</p>
            <div className="flex space-x-4">
              <Link href="#" className="opacity-90 hover:opacity-100">
                <div className="w-32 h-10 bg-black rounded-md flex items-center justify-center">
                  <span className="text-xs text-white">App Store</span>
                </div>
              </Link>
              <Link href="#" className="opacity-90 hover:opacity-100">
                <div className="w-32 h-10 bg-black rounded-md flex items-center justify-center">
                  <span className="text-xs text-white">Google Play</span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
