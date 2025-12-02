'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Leaf, Save } from 'lucide-react';
import TagManager from '@/components/profile/TagManager';
import PasswordChanger from '@/components/profile/PasswordChanger';
import PhotoManager from '@/components/profile/PhotoManager';
import { toNumber, toDateString } from '@/lib/neo4j-utils';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isRedirecting, setIsRedirecting] = useState(false);

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

        const genderReverseMap: { [key: number]: string } = { 1: 'male', 2: 'female', 0: 'other', '-1': '' };
        const sexualPreferenceReverseMap: { [key: number]: string } = { 1: 'male', 2: 'female', 3: 'both', '-1': '' };

        const genderNum = toNumber(data.gender) ?? -1;
        const sexPrefNum = toNumber(data.sexualPreference) ?? -1;
        const birthDateStr = toDateString(data.birthDate);

        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          gender: genderReverseMap[genderNum] || '',
          sexualPreference: sexualPreferenceReverseMap[sexPrefNum] || '',
          biography: data.biography || '',
          birthDate: birthDateStr,
          latitude: data.latitude ? String(data.latitude) : '',
          longitude: data.longitude ? String(data.longitude) : '',
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const genderMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'other': 0 };
      const sexualPreferenceMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'both': 3 };

      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: genderMap[formData.gender] ?? 0,
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
      setTimeout(() => {
        router.push('/profile');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                Latitude
              </label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="0.000001"
                placeholder="-90 to 90"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="longitude" className="block text-sm font-medium mb-1 text-green-700 dark:text-green-300">
                Longitude
              </label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="0.000001"
                placeholder="-180 to 180"
                className="w-full px-3 py-2 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
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
