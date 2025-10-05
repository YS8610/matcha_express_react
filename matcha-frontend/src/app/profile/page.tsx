'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { User, Star, Heart, Eye, Edit, Leaf } from 'lucide-react';
import { toDisplayNumber, toGenderString, toSexualPreferenceString } from '@/lib/neo4j-utils';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [user, router]);

  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
        <p className="mt-4 text-green-700">Loading your profile...</p>
      </div>
    </div>
  );
  
  if (!profile) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12 text-green-700">Profile not found</div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="relative h-64">
            {profile.profilePhoto ? (
              <Image
                src={profile.profilePhoto}
                alt="Profile"
                width={1024}
                height={256}
                className="w-full h-full object-cover"
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
                  <p><span className="font-medium text-green-800">Age:</span> {toDisplayNumber(profile.age, 'Not set')}</p>
                  <p><span className="font-medium text-green-800">Gender:</span> {toGenderString(profile.gender)}</p>
                  <p><span className="font-medium text-green-800">Preference:</span> {toSexualPreferenceString(profile.sexualPreference)}</p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium text-green-800">Fame Rating:</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {toDisplayNumber(profile.fameRating, '0')}/100
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

            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold mb-3 text-green-800">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-gradient-to-r from-green-100 to-green-200 text-green-700 rounded-full text-sm border border-green-300 font-medium"
                    >
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {profile.photos && profile.photos.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold mb-3 text-green-800">Photos</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {profile.photos.map(photo => (
                    <Image
                      key={photo.id}
                      src={photo.url}
                      alt=""
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded-lg border border-green-200 hover:border-green-400 transition-colors"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}