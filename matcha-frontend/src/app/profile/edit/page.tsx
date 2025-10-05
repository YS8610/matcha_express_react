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
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    gender: '',
    sexualPreference: '',
    biography: '',
    birthDate: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await api.getProfile();

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

  return (
    <div className="container mx-auto px-4 py-8">
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
          <p className="text-green-600">Update your profile information</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium mb-1 text-green-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium mb-1 text-green-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-green-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium mb-1 text-green-700">
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
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="block text-sm font-medium mb-1 text-green-700">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="sexualPreference" className="block text-sm font-medium mb-1 text-green-700">
                Sexual Preference
              </label>
              <select
                id="sexualPreference"
                name="sexualPreference"
                value={formData.sexualPreference}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="biography" className="block text-sm font-medium mb-1 text-green-700">
              Biography
            </label>
            <textarea
              id="biography"
              name="biography"
              value={formData.biography}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-green-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-2 rounded-full hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-full hover:bg-gray-300 font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100 mt-6">
          <PhotoManager />
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100 mt-6">
          <TagManager />
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-6 border border-green-100 mt-6">
          <PasswordChanger />
        </div>
      </div>
    </div>
  );
}
