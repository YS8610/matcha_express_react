import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const HeroSection = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Find Your Perfect Match</h1>
        <p className="hero-subtitle">
          Because love, too, can be industrialized.
        </p>

        {!isLoggedIn && (
          <div className="hero-cta">
            <Link href="/register" className="btn btn-primary btn-lg">
              Get Started
            </Link>
            <Link href="/about" className="btn btn-outline btn-lg">
              Learn More
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
