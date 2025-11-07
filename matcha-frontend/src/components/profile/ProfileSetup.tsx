'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import imageCompression from 'browser-image-compression';
import {
  validateGender,
  validateSexuality,
  validateBiography,
  validateTag,
  validateCoordinates,
  validateFile,
} from '@/lib/validation';

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: '',
    sexualPreference: '',
    biography: '',
    interests: [] as string[],
    birthDate: '',
    photos: [] as File[],
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isAutoDetectedLocation, setIsAutoDetectedLocation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { user } = useAuth();

  const validateFormField = (fieldName: string, value: any): string | null => {
    switch (fieldName) {
      case 'gender':
        return validateGender(value);
      case 'sexualPreference':
        return validateSexuality(value);
      case 'biography':
        return validateBiography(value);
      case 'interests':
        return validateTag(value);
      case 'coordinates':
        if (formData.latitude !== null && formData.longitude !== null) {
          return validateCoordinates(formData.latitude, formData.longitude);
        }
        return null;
      case 'photos':
        if (value && value.length > 0) {
          const firstPhoto = value[0];
          return validateFile(firstPhoto);
        }
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (user?.latitude !== undefined && user?.longitude !== undefined && formData.latitude === null && formData.longitude === null) {
      setFormData(prev => ({
        ...prev,
        latitude: user.latitude as number,
        longitude: user.longitude as number,
      }));
      setIsAutoDetectedLocation(true);
    }
  }, [user?.latitude, user?.longitude, formData.latitude, formData.longitude]);

  useEffect(() => {
    if (user?.birthDate && formData.birthDate === '') {
      setFormData(prev => ({
        ...prev,
        birthDate: user.birthDate as string
      }));
      setStep(2);
    }
  }, [user?.birthDate]);

  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsAutoDetectedLocation(false);
          setLocationLoading(false);
        },
        (error) => {
          setError('Failed to get your location: ' + error.message);
          setLocationLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLocationLoading(false);
    }
  };

  const handleAddInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      const tagError = validateTag(interestInput);
      if (tagError) {
        setFieldErrors(prev => ({
          ...prev,
          interests: tagError,
        }));
        return;
      }
      setFormData({
        ...formData,
        interests: [...formData.interests, interestInput.toLowerCase()],
      });
      setFieldErrors(prev => {
        const { interests, ...rest } = prev;
        return rest;
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

      let fileError: string | null = null;
      for (const file of files) {
        fileError = validateFile(file);
        if (fileError) break;
      }

      if (fileError) {
        setFieldErrors(prev => ({
          ...prev,
          photos: fileError,
        }));
        return;
      }

      setFormData({
        ...formData,
        photos: files,
      });
      setFieldErrors(prev => {
        const { photos, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async () => {
    setError('');
    setFieldErrors({});
    setLoading(true);

    const genderError = validateGender(formData.gender);
    const sexualityError = validateSexuality(formData.sexualPreference);
    const biographyError = validateBiography(formData.biography);
    const coordinatesError =
      formData.latitude !== null && formData.longitude !== null
        ? validateCoordinates(formData.latitude, formData.longitude)
        : null;

    const newErrors: Record<string, string> = {};
    if (genderError) newErrors.gender = genderError;
    if (sexualityError) newErrors.sexualPreference = sexualityError;
    if (biographyError) newErrors.biography = biographyError;
    if (coordinatesError) newErrors.coordinates = coordinatesError;
    if (formData.interests.length === 0) newErrors.interests = 'Add at least one interest';
    if (formData.photos.length === 0) newErrors.photos = 'Upload at least one photo';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setLoading(false);
      setError('Please fix the errors below');
      return;
    }

    try {
      const genderMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'other': 0 };
      const sexualPreferenceMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'both': 3 };

      await api.updateProfile({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        gender: genderMap[formData.gender] ?? 0,
        sexualPreference: sexualPreferenceMap[formData.sexualPreference] ?? 3,
        biography: formData.biography,
        birthDate: formData.birthDate,
      });

      if (formData.latitude !== null && formData.longitude !== null) {
        try {
          await api.updateUserLocation(formData.latitude, formData.longitude);
        } catch (locationError) {
          console.error('Failed to update location:', locationError);
        }
      }

      for (const interest of formData.interests) {
        try {
          await api.addTag(interest);
        } catch (tagError) {
          console.error(`Failed to add tag ${interest}:`, tagError);
        }
      }

      for (let i = 0; i < formData.photos.length; i++) {
        const options = {
          maxSizeMB: 0.095,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          fileType: 'image/jpeg',
        };
        const compressedFile = await imageCompression(formData.photos[i], options);
        await api.uploadPhoto(compressedFile, i);
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
            {fieldErrors.gender && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.gender}</p>
            )}
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
            {fieldErrors.sexualPreference && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.sexualPreference}</p>
            )}
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
            <p className="text-xs text-gray-600 mt-1">You must be at least 18 years old</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            {formData.latitude && formData.longitude && isAutoDetectedLocation && (
              <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-xs text-blue-600">
                  ✓ Location auto-detected during account activation ({formData.latitude.toFixed(2)}, {formData.longitude.toFixed(2)})
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  Click the button below to update if you&apos;d like a more precise location
                </p>
              </div>
            )}
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {locationLoading ? 'Getting location...' : 'Use My Current Location'}
            </button>
            {formData.latitude && formData.longitude && !isAutoDetectedLocation && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Location set ({formData.latitude.toFixed(2)}, {formData.longitude.toFixed(2)})
              </p>
            )}
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
            <div className="flex justify-between items-start mt-1">
              <p className="text-xs text-gray-500">
                {formData.biography.length}/500 characters
              </p>
              {fieldErrors.biography && (
                <p className="text-xs text-red-500">{fieldErrors.biography}</p>
              )}
            </div>
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
            {fieldErrors.interests && (
              <p className="text-xs text-red-500 mb-2">{fieldErrors.interests}</p>
            )}
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
            {fieldErrors.photos && (
              <p className="text-xs text-red-500 mt-2">{fieldErrors.photos}</p>
            )}

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
                      <Image
                        src={URL.createObjectURL(photo)}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-md border-2 border-gray-300"
                        unoptimized
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-800 text-sm font-medium mb-2">{error}</p>
              {Object.keys(fieldErrors).length > 0 && (
                <ul className="list-disc list-inside text-red-700 text-xs space-y-1">
                  {Object.entries(fieldErrors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              )}
            </div>
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
