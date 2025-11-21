'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import AuthImage from '@/components/AuthImage';
import { api, generateAvatarUrl, getPhotoUrl } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileShort } from '@/types';

export default function MatchesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [matches, setMatches] = useState<ProfileShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.getMatchedUsers();
      setMatches(response.data || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load matches data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  const handleMessageClick = (userId: string) => {
    router.push(`/chat/${userId}`);
  };

  const ProfileCard = ({ profile }: { profile: ProfileShort }) => {
    const photoUrl = profile.photo0
      ? getPhotoUrl(profile.photo0)
      : generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id);

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div
          onClick={() => handleProfileClick(profile.id)}
          className="cursor-pointer"
        >
          <div className="relative h-48">
            <AuthImage
              src={photoUrl}
              alt={profile.username}
              fill
              className="object-cover"
              unoptimized
              fallbackSrc={generateAvatarUrl(profile.firstName + ' ' + profile.lastName, profile.id)}
            />
            <div className="absolute top-2 right-2 bg-pink-500 text-white p-2 rounded-full">
              <Heart className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg text-gray-800">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-sm text-gray-600">@{profile.username}</p>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm ml-1">{profile.fameRating || 0}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4">
          <button
            onClick={() => handleMessageClick(profile.id)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium"
          >
            Send Message
          </button>
        </div>
      </div>
    );
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Heart className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 mb-2">No matches yet!</p>
      <p className="text-gray-400 text-sm">Start liking profiles to find your matches</p>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-pink-400 to-pink-600 p-4 rounded-full">
              <Heart className="w-12 h-12 text-white fill-current" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text text-transparent mb-2">
            Your Matches
          </h1>
          <p className="text-gray-600">You both liked each other - start chatting!</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {matches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
