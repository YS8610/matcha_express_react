'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (!profile) return <div className="container mx-auto px-4 py-8">Profile not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-64">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-gray-500">No profile photo</span>
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h1>
                <p className="text-gray-600">@{user?.username}</p>
              </div>
              <a
                href="/profile/edit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Edit Profile
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-2">Profile Info</h2>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Age:</span> {profile.age}</p>
                  <p><span className="font-medium">Gender:</span> {profile.gender}</p>
                  <p><span className="font-medium">Preference:</span> {profile.sexualPreference}</p>
                  <p><span className="font-medium">Fame Rating:</span> {profile.fameRating}/100</p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-2">Stats</h2>
                <div className="space-y-2">
                  <a href="/profile/views" className="block text-blue-500 hover:underline">
                    View profile visitors →
                  </a>
                  <a href="/profile/likes" className="block text-blue-500 hover:underline">
                    See who liked you →
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">Biography</h2>
              <p className="text-gray-700">{profile.biography}</p>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map(interest => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>

            {profile.photos.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold mb-2">Photos</h2>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                  {profile.photos.map(photo => (
                    <img
                      key={photo.id}
                      src={photo.url}
                      alt=""
                      className="w-full h-24 object-cover rounded-md"
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