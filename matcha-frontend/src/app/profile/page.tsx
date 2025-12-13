'use client';

import { useState, useEffect } from 'react';
import { api, generateAvatarUrl } from '@/lib/api';
import { Profile } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthImage from '@/components/AuthImage';
import { User, Star, Heart, Eye, Edit, Leaf, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { toNumber, toGenderString, toSexualPreferenceString, toDateString } from '@/lib/neo4j-utils';

export default function MyProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [locationName, setLocationName] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadProfile();
  }, [user, router]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getProfile();
      const profileData = response.data || null;

      if (!profileData) {
        setError('No profile data available. You may need to complete your profile setup.');
        setLoading(false);
        return;
      }

      const typedProfileData = profileData as Record<string, unknown>;
      if (typedProfileData.birthDate) {
        typedProfileData.birthDate = toDateString(typedProfileData.birthDate as string);
      }

      setProfile(typedProfileData as unknown as Profile);

      const photoResponse = await api.getUserPhotos() as { photoNames?: string[] };
      setPhotos(photoResponse.photoNames || []);

      try {
        const tagsResponse = await api.getUserTags() as { tags?: string[] };
        setTags(tagsResponse.tags || []);
      } catch (err) {
      }

      setLoading(false);
    } catch (error) {
      setError('Failed to load profile. Please try again or complete your profile setup.');
      setLoading(false);
    }
  };

  if (error) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={loadProfile}
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            Retry
          </button>
          <Link
            href="/profile/setup"
            className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
          >
            Go to Profile Setup
          </Link>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-500 dark:border-green-400 border-t-transparent"></div>
        <p className="mt-4 text-green-700 dark:text-green-300">Loading your profile...</p>
      </div>
    </div>
  );

  if (!profile) return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <p className="text-green-700 dark:text-green-300 mb-4">Profile not found</p>
      </div>
    </div>
  );

  const availablePhotos = photos.filter(p => p && p.trim() !== '');

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === 0 ? availablePhotos.length - 1 : prev - 1));
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev === availablePhotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur rounded-2xl shadow-xl overflow-hidden border border-green-100 dark:border-green-900">
          <div className="relative h-96 sm:h-[500px] w-full group">
            {availablePhotos.length > 0 ? (
              <>
                <AuthImage
                  src={`/api/photo/${availablePhotos[currentPhotoIndex]}`}
                  alt="Profile"
                  fill
                  className="w-full h-full object-cover"
                  unoptimized
                  fallbackSrc={generateAvatarUrl(profile.firstName || profile.username || 'User', profile.id)}
                />
                {availablePhotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevPhoto}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Previous photo"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={handleNextPhoto}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Next photo"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                      {availablePhotos.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${index === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                            }`}
                          title={`Photo ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 flex items-center justify-center">
                <User className="w-20 h-20 text-green-400" />
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-green-800 dark:text-green-400">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="text-green-600 dark:text-green-500">@{profile?.username}</p>
              </div>
              <Link
                href="/profile/edit"
                className="px-5 py-2 bg-white dark:bg-green-600 text-green-600 dark:text-white border-2 border-green-600 rounded-full hover:bg-green-50 dark:hover:bg-green-700 font-medium transition-all transform hover:scale-105 shadow-md flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="font-semibold mb-3 text-green-800 dark:text-green-400 flex items-center gap-2">
                  <User className="w-4 h-4 text-green-600 dark:text-green-500" />
                  Profile Info
                </h2>
                <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <p><span className="font-medium text-green-800 dark:text-green-400">Birth Date:</span> {profile.birthDate || 'Not set'}</p>
                  <p><span className="font-medium text-green-800 dark:text-green-400">Gender:</span> {toGenderString(profile.gender)}</p>
                  <p><span className="font-medium text-green-800 dark:text-green-400">Preference:</span> {toSexualPreferenceString(profile.sexualPreference)}</p>
                  <p className="flex items-center gap-1">
                    <span className="font-medium text-green-800 dark:text-green-400">Fame Rating:</span>
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    {`${toNumber(profile.fameRating) ?? '0'}/100`}
                  </p>
                  {(profile.latitude !== undefined && profile.longitude !== undefined) && (
                    <div>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-green-600 dark:text-green-500" />
                        <span className="font-medium text-green-800 dark:text-green-400">Location:</span>
                      </p>
                      <a
                        href={`https://www.google.com/maps?q=${profile.latitude},${profile.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-4 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1"
                        title="View on Google Maps"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.latitude.toFixed(8)}°, {profile.longitude.toFixed(8)}°
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="font-semibold mb-3 text-green-800 dark:text-green-400 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-green-600 dark:text-green-500" />
                  Stats
                </h2>
                <div className="space-y-2 flex flex-col gap-2">
                  <Link href="/visitors" className="btn-secondary text-sm flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    View Profile Visitors
                  </Link>
                  <Link href="/likes" className="btn-secondary text-sm flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    See Who Liked You
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="font-semibold mb-2 text-green-800 dark:text-green-400">Biography</h2>
              <p className="text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950 p-4 rounded-lg">{profile.biography || 'No biography set yet.'}</p>
            </div>

            {tags.length > 0 && (
              <div className="mt-6">
                <h2 className="font-semibold mb-3 text-green-800 dark:text-green-400">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-green-800 dark:text-emerald-200 border border-green-300 dark:border-emerald-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {photos.length > 0 && (
              <div className="mt-8">
                <h2 className="font-semibold mb-4 text-green-800 dark:text-green-400 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Your Photos ({availablePhotos.length}/5)
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {photos.map((photoName, index) => {
                    const hasPhoto = photoName && photoName.trim() !== '';
                    return (
                      <div
                        key={index}
                        onClick={() => hasPhoto && setCurrentPhotoIndex(availablePhotos.indexOf(photoName))}
                        className={`relative aspect-square rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${hasPhoto
                            ? 'border-green-400 hover:border-green-600 hover:shadow-lg'
                            : 'border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50'
                          }`}
                      >
                        {hasPhoto ? (
                          <>
                            <AuthImage
                              src={`/api/photo/${photoName}`}
                              alt={`Photo ${index + 1}`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-all flex items-center justify-center">
                              <span className="text-white font-semibold opacity-0 hover:opacity-100">View</span>
                            </div>
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-400 dark:text-gray-500">Empty</span>
                          </div>
                        )}
                        <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                          {index + 1}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
