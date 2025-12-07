'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Leaf, Save, MapPin, Loader } from 'lucide-react';
import TagManager from '@/components/profile/TagManager';
import PasswordChanger from '@/components/profile/PasswordChanger';
import PhotoManager from '@/components/profile/PhotoManager';
import { toNumber, toDateString } from '@/lib/neo4j-utils';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    sexualPreference: '',
    biography: '',
    birthDate: '',
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (!user.profileComplete) {
      router.replace('/profile/setup');
      return;
    }

    const loadProfile = async () => {
      try {
        const response = await api.getProfile();
        const data = response.data;

        if (!data) {
          setError('Failed to load profile data');
          return;
        }

        const genderReverseMap: { [key: number]: string } = { 1: 'male', 2: 'female', 3: 'other', '-1': '' };
        const sexualPreferenceReverseMap: { [key: number]: string } = { 1: 'male', 2: 'female', 3: 'both', '-1': '' };

        const typedData = data as Record<string, string | number | undefined>;
        const genderNum = toNumber(typedData.gender) ?? -1;
        const sexPrefNum = toNumber(typedData.sexualPreference) ?? -1;
        const birthDateStr = toDateString(typedData.birthDate as string);

        setFormData({
          firstName: (typedData.firstName as string) || '',
          lastName: (typedData.lastName as string) || '',
          email: (typedData.email as string) || '',
          gender: genderReverseMap[genderNum] || '',
          sexualPreference: sexualPreferenceReverseMap[sexPrefNum] || '',
          biography: (typedData.biography as string) || '',
          birthDate: birthDateStr,
          latitude: typedData.latitude ? String(typedData.latitude) : '',
          longitude: typedData.longitude ? String(typedData.longitude) : '',
        });

        if (typedData.latitude && typedData.longitude) {
          setLocationDetected(true);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
        setError('Failed to load profile data');
      }
    };

    loadProfile();
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDetectLocation = () => {
    setLocationLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy;

          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          }));
          setLocationDetected(true);
          setLocationLoading(false);

          if (accuracy < 100) {
            addToast('Location detected with high accuracy (GPS)', 'success', 3000);
          } else if (accuracy < 1000) {
            addToast('Location detected (WiFi positioning)', 'success', 3000);
          } else if (accuracy < 10000) {
            addToast('Location detected (IP-based, district-level)', 'success', 3000);
          } else {
            addToast(`Location detected but accuracy is low (~${Math.round(accuracy / 1000)}km). Consider enabling WiFi.`, 'warning', 4000);
          }
        },
        (error) => {
          const errorMsg = 'Failed to detect location: ' + error.message;
          setError(errorMsg);
          addToast(errorMsg, 'error', 4000);
          setLocationLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      const errorMsg = 'Geolocation is not supported by your browser';
      setError(errorMsg);
      addToast(errorMsg, 'error', 3000);
      setLocationLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        const errorMsg = 'First name and last name are required';
        setError(errorMsg);
        addToast(errorMsg, 'warning', 3000);
        setLoading(false);
        return;
      }

      if (formData.biography.trim().length <= 5) {
        const errorMsg = 'Biography must be longer than 5 characters';
        setError(errorMsg);
        addToast(errorMsg, 'warning', 3000);
        setLoading(false);
        return;
      }

      const genderMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'other': 3 };
      const sexualPreferenceMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'both': 3 };

      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: genderMap[formData.gender] ?? 1,
        sexualPreference: sexualPreferenceMap[formData.sexualPreference] ?? 3,
        biography: formData.biography,
        birthDate: formData.birthDate,
      };

      await api.updateProfile(dataToSend);

      if (formData.latitude && formData.longitude) {
        await api.updateUserLocation(
          parseFloat(formData.latitude),
          parseFloat(formData.longitude)
        );
      }

      setSuccess('Profile updated successfully!');
      addToast('Profile saved successfully!', 'success', 3000);
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMsg);
      addToast(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !user || !user.profileComplete) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-white dark:bg-slate-900">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <Leaf className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Edit Profile
          </h1>
          <p className="text-green-600 dark:text-green-400">Update your profile information</p>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-300 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="sexualPreference" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                Sexual Preference
              </label>
              <select
                id="sexualPreference"
                name="sexualPreference"
                value={formData.sexualPreference}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="biography" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
              Biography
            </label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-vertical"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3 text-green-700 dark:text-green-300">
              Location
            </label>
            <div className="space-y-4 border border-green-200 dark:border-green-800 rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-detect GPS</p>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={locationLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 disabled:opacity-50 font-medium transition-all flex items-center justify-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      Detect My Location
                    </>
                  )}
                </button>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Manual Coordinates</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="latitude" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Latitude (-90 to 90)
                    </label>
                    <input
                      type="number"
                      id="latitude"
                      name="latitude"
                      value={formData.latitude}
                      onChange={(e) => {
                        if (e.target.value) {
                          const value = parseFloat(e.target.value);
                          const rounded = parseFloat(value.toFixed(4));
                          setFormData(prev => ({ ...prev, latitude: rounded.toString() }));
                        } else {
                          setFormData(prev => ({ ...prev, latitude: '' }));
                        }
                      }}
                      step="0.0001"
                      min="-90"
                      max="90"
                      placeholder="e.g., 37.7749"
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="longitude" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Longitude (-180 to 180)
                    </label>
                    <input
                      type="number"
                      id="longitude"
                      name="longitude"
                      value={formData.longitude}
                      onChange={(e) => {
                        if (e.target.value) {
                          const value = parseFloat(e.target.value);
                          const rounded = parseFloat(value.toFixed(4));
                          setFormData(prev => ({ ...prev, longitude: rounded.toString() }));
                        } else {
                          setFormData(prev => ({ ...prev, longitude: '' }));
                        }
                      }}
                      step="0.0001"
                      min="-180"
                      max="180"
                      placeholder="e.g., -122.4194"
                      className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                    />
                  </div>
                </div>
              </div>

              {formData.latitude && formData.longitude && (
                <div className="text-xs text-gray-700 dark:text-gray-300 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-3 rounded">
                  <strong>Current Location:</strong> {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 dark:hover:from-green-800 dark:hover:to-green-700 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2 rounded-full hover:bg-gray-300 dark:hover:bg-slate-600 font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900 mt-6">
          <PhotoManager />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900 mt-6">
          <TagManager />
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6 border border-green-100 dark:border-green-900 mt-6">
          <PasswordChanger />
        </div>
      </div>
    </div>
  );
}
