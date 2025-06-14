// src/components/auth/ProfileSetup.tsx
import React, { useState } from 'react';
import { Camera, MapPin } from 'lucide-react';

interface ProfileData {
  gender: string;
  preference: string;
  bio: string;
  tags: string;
  age: string;
  location: string;
  photos: File[];
}

interface ProfileSetupProps {
  onComplete: (data: ProfileData) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<ProfileData>({
    gender: '',
    preference: '',
    bio: '',
    tags: '',
    age: '',
    location: '',
    photos: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.preference) newErrors.preference = 'Sexual preference is required';
    if (!formData.age) newErrors.age = 'Age is required';
    if (parseInt(formData.age) < 18 || parseInt(formData.age) > 100) {
      newErrors.age = 'Age must be between 18 and 100';
    }
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (formData.bio.length > 500) newErrors.bio = 'Bio must be less than 500 characters';
    if (!formData.tags.trim()) newErrors.tags = 'At least one interest tag is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onComplete(formData);
    } catch (error) {
      setErrors({ general: 'Failed to complete profile. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setErrors({ photos: 'Maximum 5 photos allowed' });
      return;
    }
    setFormData(prev => ({ ...prev, photos: files }));
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: '' }));
    }
  };

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude},${position.coords.longitude}`
          }));
        },
        (error) => {
          console.error('Location error:', error);
          setFormData(prev => ({ ...prev, location: 'Location unavailable' }));
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <select
              value={formData.gender}
              onChange={(e) => handleInputChange('gender', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <select
              value={formData.preference}
              onChange={(e) => handleInputChange('preference', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.preference ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Sexual Preference</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="both">Both</option>
            </select>
            {errors.preference && <p className="text-red-500 text-sm mt-1">{errors.preference}</p>}
          </div>

          <div>
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
              min="18"
              max="100"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>

          <div>
            <textarea
              placeholder="Tell us about yourself..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 h-24 resize-none ${errors.bio ? 'border-red-500' : 'border-gray-300'}`}
              maxLength={500}
            />
            <div className="flex justify-between">
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
              <p className="text-gray-400 text-sm mt-1">{formData.bio.length}/500</p>
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Interests (e.g., #hiking #coffee #music)"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 ${errors.tags ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.tags && <p className="text-red-500 text-sm mt-1">{errors.tags}</p>}
          </div>

          <div>
            <button
              type="button"
              onClick={requestLocation}
              className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <MapPin size={20} className="mr-2" />
              {formData.location ? 'Location Updated' : 'Enable Location'}
            </button>
          </div>

          <div>
            <label className="block">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-300 cursor-pointer">
                <Camera className="mx-auto mb-2 text-gray-400" size={24} />
                <p className="text-gray-500">Upload up to 5 photos</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.photos.length > 0 ? `${formData.photos.length} photo(s) selected` : 'Click to browse files'}
                </p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                max={5}
              />
            </label>
            {errors.photos && <p className="text-red-500 text-sm mt-1">{errors.photos}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Completing Profile...' : 'Complete Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
