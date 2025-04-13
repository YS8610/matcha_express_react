// src/components/features/home/CtaSection.tsx
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

// Call to Action
const CtaSection = () => {
  const { isLoggedIn } = useAuth();
  
  return (
    <section className="bg-gradient-to-r from-green-600 to-lime-400 py-16 px-4 rounded-3xl mx-4 my-12 shadow-xl">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-white mb-4">
          Swipe Right® on Your Future
        </h2>
        <p className="text-white text-xl mb-8 max-w-xl mx-auto">
          It all starts with a match. Over 55 billion made so far - what are you waiting for?
        </p>
        
        {!isLoggedIn ? (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="rounded-full bg-white text-green-600 font-bold py-4 px-8 text-lg shadow-lg hover:bg-gray-100 transition duration-300">
              CREATE ACCOUNT
            </Link>
            <Link href="/login" className="rounded-full bg-transparent text-white border-2 border-white font-bold py-4 px-8 text-lg hover:bg-white/10 transition duration-300">
              LOG IN
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="rounded-full bg-white text-rose-500 font-bold py-4 px-8 text-lg shadow-lg hover:bg-gray-100 transition duration-300">
              START SWIPING
            </Link>
            <Link href="/profile" className="rounded-full bg-transparent text-white border-2 border-white font-bold py-4 px-8 text-lg hover:bg-white/10 transition duration-300">
              EDIT PROFILE
            </Link>
          </div>
        )}
        
        <div className="mt-8 text-white/80 text-sm">
          Single people, download our app to start your dating journey today!
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
