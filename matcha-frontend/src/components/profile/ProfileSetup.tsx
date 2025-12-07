'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import imageCompression from 'browser-image-compression';
import TagSelector from '@/components/TagSelector';
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [isAutoDetectedLocation, setIsAutoDetectedLocation] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [postalCode, setPostalCode] = useState('');
  const [postalCodeLoading, setPostalCodeLoading] = useState(false);
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


  const handleGetLocation = async () => {
    setLocationLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const accuracy = position.coords.accuracy;

          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsAutoDetectedLocation(false);
          setLocationLoading(false);

          if (accuracy < 100) {
            console.log('Location detected via GPS (high accuracy)');
          } else if (accuracy < 1000) {
            console.log('Location detected via WiFi positioning');
          } else if (accuracy < 10000) {
            console.log('Location detected via IP geolocation (district-level accuracy)');
          } else {
            setError(`Location detected but accuracy is low (~${Math.round(accuracy / 1000)}km). Consider enabling WiFi or manually adjusting your location.`);
          }
        },
        async (error) => {
          console.warn('Browser geolocation failed, trying server-side IP fallback:', error.message);

          try {
            setError('Unable to detect location automatically. Please adjust your location manually on the map.');
            setLocationLoading(false);
          } catch (fallbackError) {
            setError('Failed to detect location. Please set your location manually.');
            setLocationLoading(false);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please set your location manually.');
      setLocationLoading(false);
    }
  };

  const handlePostalCodeLookup = async () => {
    if (!postalCode.trim()) {
      setError('Please enter a postal code');
      return;
    }

    setPostalCodeLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&format=json&limit=1`,
        {
          headers: {
            'User-Agent': 'Matcha-Dating-App/1.0 (Educational Project)'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to lookup postal code');
      }

      const data = await response.json();

      if (!data || data.length === 0) {
        setError('Postal code not found. Please try a different code or use manual input.');
        setPostalCodeLoading(false);
        return;
      }

      const location = data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);

      setFormData(prev => ({
        ...prev,
        latitude: lat,
        longitude: lon,
      }));
      setIsAutoDetectedLocation(false);
      setError('');
    } catch (err) {
      setError('Failed to lookup postal code: ' + (err as Error).message);
    } finally {
      setPostalCodeLoading(false);
    }
  };

  const handleInterestsChange = (newInterests: string[]) => {
    setFormData({
      ...formData,
      interests: newInterests,
    });
    if (fieldErrors.interests) {
      setFieldErrors(prev => {
        const { interests, ...rest } = prev;
        return rest;
      });
    }
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
      const genderMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'other': 3 };
      const sexualPreferenceMap: { [key: string]: number } = { 'male': 1, 'female': 2, 'both': 3 };

      const genderValue = genderMap[formData.gender];
      const sexualPreferenceValue = sexualPreferenceMap[formData.sexualPreference];

      if (genderValue === undefined || genderValue < 1 || genderValue > 3) {
        setError('Invalid gender selection. Please select male, female, or other.');
        setLoading(false);
        return;
      }

      if (sexualPreferenceValue === undefined || sexualPreferenceValue < 1 || sexualPreferenceValue > 3) {
        setError('Invalid sexual preference selection. Please select male, female, or both.');
        setLoading(false);
        return;
      }

      await api.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: user?.email || '',
        gender: genderValue,
        sexualPreference: sexualPreferenceValue,
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
          <label className="block text-sm font-medium mb-3">Location</label>
          {formData.latitude && formData.longitude && isAutoDetectedLocation && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ Location auto-detected during account activation ({formData.latitude.toFixed(2)}, {formData.longitude.toFixed(2)})
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                Use any of the options below to update your location
              </p>
            </div>
          )}
          <div className="space-y-4 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Option 1: Auto-detect GPS</p>
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={locationLoading}
                className="w-full bg-green-500 dark:bg-green-600 text-white py-2 rounded-md hover:bg-green-600 dark:hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
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
                {locationLoading ? 'Getting location...' : 'Detect My Location'}
              </button>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Option 2: Lookup by Postal Code</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="Enter postal code"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                />
                <button
                  type="button"
                  onClick={handlePostalCodeLookup}
                  disabled={postalCodeLoading}
                  className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50 font-medium transition-all text-sm whitespace-nowrap"
                >
                  {postalCodeLoading ? 'Looking up...' : 'Lookup'}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Option 3: Manual Coordinates</p>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="latitude" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Latitude (-90 to 90)
                  </label>
                  <input
                    type="number"
                    id="latitude"
                    value={formData.latitude !== null ? formData.latitude : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : null }))}
                    step="0.0001"
                    min="-90"
                    max="90"
                    placeholder="e.g., 37.7749"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="longitude" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Longitude (-180 to 180)
                  </label>
                  <input
                    type="number"
                    id="longitude"
                    value={formData.longitude !== null ? formData.longitude : ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : null }))}
                    step="0.0001"
                    min="-180"
                    max="180"
                    placeholder="e.g., -122.4194"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>

            {formData.latitude !== null && formData.longitude !== null && (
              <div className="text-xs text-gray-700 dark:text-gray-300 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-3 rounded">
                <strong>Current Location:</strong> {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}
              </div>
            )}
          </div>
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
          <label className="block text-sm font-medium mb-2">Interests</label>
          <TagSelector
            selectedTags={formData.interests}
            onTagsChange={handleInterestsChange}
            maxTags={MAX_INTERESTS}
            minTags={MIN_INTERESTS}
            placeholder="Type to add interests (e.g., vegan, geek, piercing)..."
            showPopular={true}
            popularTagsCount={20}
            error={fieldErrors.interests}
          />
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
