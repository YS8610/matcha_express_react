import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const CtaSection = () => {
  const { isLoggedIn } = useAuth();

  return (
    <section className="cta-section section">
      <div className="cta-content">
        <h2 className="cta-title">Ready to Find Your Match?</h2>
        <p className="cta-subtitle">
          Join thousands of users who have found meaningful connections on our platform.
        </p>

        {!isLoggedIn ? (
          <div className="cta-buttons">
            <Link href="/register" className="btn btn-primary btn-lg">
              Create an Account
            </Link>
            <Link href="/login" className="btn btn-outline btn-lg">
              Already a Member? Log In
            </Link>
          </div>
        ) : (
          <div className="cta-buttons">
            <Link href="/browse" className="btn btn-primary btn-lg">
              Browse Matches
            </Link>
            <Link href="/profile" className="btn btn-outline btn-lg">
              Update Your Profile
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CtaSection;
