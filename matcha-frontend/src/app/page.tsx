// src/app/page.tsx
'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import HeroSection from '@/components/features/home/HeroSection';
import FeaturedProfiles from '@/components/features/home/FeaturedProfiles';
import FeaturesSection from '@/components/features/home/FeaturesSection';
import TestimonialsSection from '@/components/features/home/TestimonialsSection';
import CtaSection from '@/components/features/home/CtaSection';
import { FEATURED_PROFILES } from '@/constants/profiles';
import { APP_FEATURES } from '@/constants/features';
import { APP_TESTIMONIALS } from '@/constants/testimonials';

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="home-page">
      <HeroSection />
      
      {isLoggedIn && (
        <FeaturedProfiles profiles={FEATURED_PROFILES} />
      )}
      
      <FeaturesSection features={APP_FEATURES} />
      
      <TestimonialsSection testimonials={APP_TESTIMONIALS} />
      
      <CtaSection />
    </div>
  );
}
