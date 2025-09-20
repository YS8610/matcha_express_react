'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    sexualPreference: '',
    biography: '',
    interests: [] as string[],
    birthDate: '',
    photos: [] as File[],
  });
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.toLowerCase()],
      });
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(i => i !== interest),
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 5);
      setFormData({
        ...formData,
        photos: files,
      });
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      await api.updateProfile({
        gender: formData.gender,
        sexualPreference: formData.sexualPreference,
        biography: formData.biography,
        interests: formData.interests,
        birthDate: formData.birthDate,
      });

      for (const photo of formData.photos) {
        await api.uploadPhoto(photo);
      }

      router.push('/browse');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to setup profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-6">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className={`flex-1 h-2 rounded ${
                i <= step ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Sexual Preference</label>
            <select
              value={formData.sexualPreference}
              onChange={(e) => setFormData({ ...formData, sexualPreference: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select...</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="both">Both</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Birth Date</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
          </div>

          <button
            onClick={() => setStep(2)}
            disabled={!formData.gender || !formData.sexualPreference || !formData.birthDate}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Biography</label>
            <textarea
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              rows={4}
              maxLength={500}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Tell us about yourself..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.biography.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                className="flex-1 px-3 py-2 border rounded-md"
                placeholder="Add interest..."
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map(interest => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-1"
                >
                  #{interest}
                  <button
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!formData.biography || formData.interests.length === 0}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-4">
              Upload Photos (Max 5)
            </label>

            {/* Custom file upload button */}
            <div className="relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handlePhotoChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Choose Photos
              </label>
            </div>

            {/* Selected photos preview */}
            {formData.photos.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {formData.photos.length} photo{formData.photos.length > 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <div
                      key={index}
                      className="relative group"
                    >
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPhotos = formData.photos.filter((_, i) => i !== index);
                          setFormData({ ...formData, photos: newPhotos });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setStep(2)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || formData.photos.length === 0}
              className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Setting up...' : 'Complete Setup'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}