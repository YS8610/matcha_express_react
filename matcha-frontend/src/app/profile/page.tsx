'use client';

import { useState, useEffect } from 'react';
import { api, getPhotoUrl, generateAvatarUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthImage from '@/components/AuthImage';
import { User, Star, Heart, Eye, Edit, Leaf } from 'lucide-react';
import { formatFameRating, toGenderString, toSexualPreferenceString } from '@/lib/neo4j-utils';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [user, router]);

  useEffect(() => {
    if (shouldRedirect) {
      router.push('/profile/setup');
    }
  }, [shouldRedirect, router]);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile();
      const profileData = response.data || null;

      if (!profileData) {
        console.error('No profile data returned');
        setShouldRedirect(true);
        return;
      }

      setProfile(profileData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setShouldRedirect(true);
    }
  };

  if (loading || shouldRedirect) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-green-700">
          {shouldRedirect ? 'Redirecting to profile setup...' : 'Loading your profile...'}
        </p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <p className="text-green-700 mb-4">Profile not found</p>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="relative h-64">
            {profile.photo0 ? (
              <AuthImage
                src={getPhotoUrl(profile.photo0)}
                alt="Profile"
                width={1024}
                height={256}
                className="w-full h-full object-cover"
                unoptimized
                fallbackSrc={generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <User className="w-20 h-20 text-green-400" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-green-800">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-green-600">@{user?.username}</p>
              </div>
              <Link
                href="/profile/edit"
                className="px-5 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full hover:from-green-700 hover:to-green-600 font-medium transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600" />
                  Profile Info
                </h2>
                <div className="space-y-2 text-sm text-green-700">
                  <p><span className="font-medium text-green-800">Birth Date:</span> {profile.birthDate || 'Not set'}</p>
                  <p><span className="font-medium text-green-800">Gender:</span> {toGenderString(profile.gender)}</p>
                  <p><span className="font-medium text-green-800">Preference:</span> {toSexualPreferenceString(profile.sexualPreference)}</p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium text-green-800">Fame Rating:</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {formatFameRating(profile.fameRating)}
                  </p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-3 text-green-800 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600" />
                  Stats
                </h2>
                <div className="space-y-2">
                  <Link href="/profile/views" className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:underline transition-colors">
                    <Eye className="w-4 h-4" />
                    View profile visitors →
                  </Link>
                  <Link href="/profile/likes" className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:underline transition-colors">
                    <Heart className="w-4 h-4" />
                    See who liked you →
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-green-800">Biography</h2>
              <p className="text-green-700 bg-green-50 p-4 rounded-lg">{profile.biography || 'No biography set yet.'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
