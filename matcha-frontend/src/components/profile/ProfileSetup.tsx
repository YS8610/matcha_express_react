'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import imageCompression from 'browser-image-compression';
import {
  validateEnum,
  validateBiography,
  validateTag,
  validateCoordinates,
  validateFile,
  validateBirthDate,
} from '@/lib/validation';
import { toDateString } from '@/lib/neo4j-utils';

const MAX_INTERESTS = 10;
const MIN_INTERESTS = 1;

export default function ProfileSetup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    sexualPreference: '',
    biography: '',
    birthDate: '',
    interests: [] as string[],
    photos: [] as File[],
    latitude: null as number | null,
    longitude: null as number | null,
  });
  const [interestInput, setInterestInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isAutoDetectedLocation, setIsAutoDetectedLocation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const validateFormField = (fieldName: string, value: unknown): string | null => {
    switch (fieldName) {
      case 'gender':
        return validateEnum(String(value), ['male', 'female', 'other'], 'Gender');
      case 'sexualPreference':
        return validateEnum(String(value), ['male', 'female', 'both'], 'Sexual preference');
      case 'biography':
        return validateBiography(String(value));
      case 'interests':
        return validateTag(String(value));
      case 'coordinates':
        if (formData.latitude !== null && formData.longitude !== null) {
          return validateCoordinates(formData.latitude, formData.longitude);
        }
        return null;
      case 'photos':
        if (value && typeof value === 'object' && Array.isArray(value) && value.length > 0) {
          const firstPhoto = value[0];
          return validateFile(firstPhoto);
        }
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        if (response?.data) {
          const typedData = response.data as Record<string, unknown>;
          setFormData(prev => ({
            ...prev,
            firstName: (typedData.firstName as string) || '',
            lastName: (typedData.lastName as string) || '',
            birthDate: typedData.birthDate ? toDateString(typedData.birthDate as string) : prev.birthDate,
          }));
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

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


  const handleGetLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
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
    const lowerInterest = interestInput.toLowerCase();

    if (!interestInput.trim()) {
      setFieldErrors(prev => ({
        ...prev,
        interests: 'Please enter an interest',
      }));
      return;
    }

    if (formData.interests.includes(lowerInterest)) {
      setFieldErrors(prev => ({
        ...prev,
        interests: 'This interest is already added',
      }));
      return;
    }

    if (formData.interests.length >= MAX_INTERESTS) {
      setFieldErrors(prev => ({
        ...prev,
        interests: `Maximum ${MAX_INTERESTS} interests allowed`,
      }));
      return;
    }

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
      interests: [...formData.interests, lowerInterest],
    });
    setFieldErrors(prev => {
      const { interests, ...rest } = prev;
      return rest;
    });
    setInterestInput('');
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

    const genderError = validateEnum(formData.gender, ['male', 'female', 'other'], 'Gender');
    const sexualityError = validateEnum(formData.sexualPreference, ['male', 'female', 'both'], 'Sexual preference');
    const birthDateError = validateBirthDate(formData.birthDate);
    const biographyError = validateBiography(formData.biography);
    const coordinatesError =
      formData.latitude !== null && formData.longitude !== null
        ? validateCoordinates(formData.latitude, formData.longitude)
        : null;

    const newErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (genderError) newErrors.gender = genderError;
    if (sexualityError) newErrors.sexualPreference = sexualityError;
    if (birthDateError) newErrors.birthDate = birthDateError;
    if (biographyError) newErrors.biography = biographyError;
    if (coordinatesError) newErrors.coordinates = coordinatesError;
    if (formData.interests.length < MIN_INTERESTS) newErrors.interests = `Add at least ${MIN_INTERESTS} interest`;
    if (formData.interests.length > MAX_INTERESTS) newErrors.interests = `Maximum ${MAX_INTERESTS} interests allowed`;
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
        firstName: formData.firstName,
        lastName: formData.lastName,
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

      if (user) {
        updateUser({
          ...user,
          profileComplete: true,
        });
        localStorage.setItem('profileComplete', 'true');
      }

      router.push('/browse');
    } catch (err: unknown) {
      console.error('Profile setup error:', err);

      let errorMessage = 'Failed to setup profile';

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'object' && err !== null) {
        const errorObj = err as Record<string, unknown>;

        if (errorObj.message) {
          errorMessage = String(errorObj.message);

          if (errorMessage.includes('interests') || errorMessage.includes('tag')) {
            errorMessage = `⚠ Interest validation failed: Please ensure you have between ${MIN_INTERESTS} and ${MAX_INTERESTS} interests. Currently added: ${formData.interests.length}`;
          } else if (errorMessage.includes('photo')) {
            errorMessage = '⚠ Photo validation failed: Please upload valid photos (max 5)';
          } else if (errorMessage.includes('biography') || errorMessage.includes('bio')) {
            errorMessage = '⚠ Biography validation failed: Biography must be between 50 and 500 characters';
          } else if (errorMessage.includes('gender') || errorMessage.includes('sexuality')) {
            errorMessage = '⚠ Please select both gender and sexual preference';
          }
        } else if (errorObj.errors && Array.isArray(errorObj.errors)) {
          const firstError = (errorObj.errors[0] as Record<string, unknown>)?.message;
          if (firstError) {
            errorMessage = String(firstError);
          }
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Complete Your Profile</h2>

      {profileLoading && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-800 text-sm">Loading your profile information...</p>
        </div>
      )}

      <form className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Your first name..."
            />
            {fieldErrors.firstName && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Your last name..."
            />
            {fieldErrors.lastName && (
              <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

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
            max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
          {fieldErrors.birthDate && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.birthDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          {formData.latitude && formData.longitude && isAutoDetectedLocation && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-xs text-green-600">
                ✓ Location auto-detected during account activation ({formData.latitude.toFixed(2)}, {formData.longitude.toFixed(2)})
              </p>
              <p className="text-xs text-green-500 mt-1">
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
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Interests</label>
            <span className={`text-xs font-medium ${formData.interests.length >= MAX_INTERESTS ? 'text-red-600' : formData.interests.length > 0 ? 'text-green-600' : 'text-gray-500'}`}>
              {formData.interests.length}/{MAX_INTERESTS}
            </span>
          </div>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), formData.interests.length < MAX_INTERESTS && handleAddInterest())}
              disabled={formData.interests.length >= MAX_INTERESTS}
              className={`flex-1 px-3 py-2 border rounded-md ${formData.interests.length >= MAX_INTERESTS ? 'bg-gray-100 dark:bg-gray-800 cursor-not-allowed opacity-60' : ''}`}
              placeholder={formData.interests.length >= MAX_INTERESTS ? `Maximum ${MAX_INTERESTS} interests reached` : 'Add interest...'}
            />
            <button
              type="button"
              onClick={handleAddInterest}
              disabled={formData.interests.length >= MAX_INTERESTS}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                formData.interests.length >= MAX_INTERESTS
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600 active:scale-95'
              }`}
            >
              Add
            </button>
          </div>

          {fieldErrors.interests && (
            <p className={`text-xs mb-3 font-medium ${fieldErrors.interests.includes('Maximum') ? 'text-red-600' : fieldErrors.interests.includes('already') ? 'text-amber-600' : 'text-red-500'}`}>
              ⚠ {fieldErrors.interests}
            </p>
          )}

          {formData.interests.length >= MAX_INTERESTS && !fieldErrors.interests && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-3 font-medium">
              ℹ You&apos;ve reached the maximum number of interests ({MAX_INTERESTS}). Remove one to add a different interest.
            </p>
          )}

          {formData.interests.length > 0 && (
            <div className="mb-3 p-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                ✓ {formData.interests.length} interest{formData.interests.length !== 1 ? 's' : ''} added
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {formData.interests.map(interest => (
              <span
                key={interest}
                className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-emerald-900/40 dark:to-teal-900/40 text-green-800 dark:text-emerald-200 border border-green-300 dark:border-emerald-700 rounded-full text-sm flex items-center gap-2 transition-all hover:shadow-md"
              >
                #{interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-bold hover:scale-125 transition-transform"
                  title="Remove interest"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 cursor-pointer transition-colors"
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
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium mb-2">{error}</p>
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="list-disc list-inside text-red-700 dark:text-red-300 text-xs space-y-1">
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.gender || !formData.sexualPreference || !formData.birthDate || !formData.biography || formData.interests.length === 0 || formData.photos.length === 0}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );
}
