import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProfileCard from '@/components/features/profiles/ProfileCard';
import { type Profile } from '@/types/profile';
import { FEATURED_PROFILES } from '@/constants/profiles';

interface FeaturedProfilesProps {
  profiles?: Profile[];
}

const FeaturedProfiles = ({ 
  profiles = FEATURED_PROFILES 
}: FeaturedProfilesProps) => {
  return (
    <section className="featured-profiles-section section">
      <div className="section-header d-flex justify-content-between align-items-center">
        <h2 className="section-title">Suggested Matches</h2>
        <Link href="/browse" className="btn btn-outline d-flex align-items-center">
          See All <ChevronRight size={16} />
        </Link>
      </div>

      <div className="profiles-grid">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} profile={profile} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProfiles;
