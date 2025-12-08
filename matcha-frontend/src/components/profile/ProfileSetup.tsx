'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import imageCompression from 'browser-image-compression';
import TagSelector from '@/components/TagSelector';
import { FormInput, FormSelect, FormTextarea, Button, Alert } from '@/components/ui';
import {
  validateEnum,
  validateBiography,
  validateTag,
  validateCoordinates,
  validateFile,
  validateBirthDate,
} from '@/lib/validation';
import { toDateString } from '@/lib/neo4j-utils';

const MAX_INTERESTS = 5;
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
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const { addToast } = useToast();

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
            addToast('Location detected via GPS (high accuracy)', 'success', 3000);
          } else if (accuracy < 1000) {
            addToast('Location detected via WiFi positioning', 'success', 3000);
          } else if (accuracy < 10000) {
            addToast('Location detected via IP geolocation (district-level)', 'success', 3000);
          } else {
            const errorMsg = `Location detected but accuracy is low (~${Math.round(accuracy / 1000)}km). Consider enabling WiFi or manually adjusting your location.`;
            setError(errorMsg);
            addToast(errorMsg, 'warning', 4000);
          }
        },
        async (error) => {
          console.warn('Browser geolocation failed, trying IP-based fallback:', error.message);

          const services = [
            { url: 'http://ip-api.com/json/', lat: 'lat', lon: 'lon', city: 'city', country: 'country' },
            { url: 'https://ipapi.co/json/', lat: 'latitude', lon: 'longitude', city: 'city', country: 'country_name' },
          ];

          let success = false;

          for (const service of services) {
            try {
              console.log(`Trying IP service: ${service.url}`);
              const response = await fetch(service.url);

              if (!response.ok) continue;

              const data = await response.json();
              console.log('IP service response:', data);

              if (data[service.lat] && data[service.lon]) {
                const lat = parseFloat(data[service.lat]);
                const lon = parseFloat(data[service.lon]);

                setFormData(prev => ({
                  ...prev,
                  latitude: parseFloat(lat.toFixed(8)),
                  longitude: parseFloat(lon.toFixed(8)),
                }));
                setIsAutoDetectedLocation(false);
                setLocationLoading(false);
                success = true;

                const city = data[service.city] || 'Unknown';
                const country = data[service.country] || 'Unknown';
                addToast(`Location detected via IP: ${city}, ${country} (approximate)`, 'success', 4000);
                break;
              }
            } catch (err) {
              console.warn(`Service ${service.url} failed:`, err);
              continue;
            }
          }

          if (!success) {
            console.error('All IP geolocation services failed');
            const errorMsg = 'Unable to detect location. Please enter coordinates manually below.';
            setError(errorMsg);
            addToast(errorMsg, 'warning', 4000);
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
      console.warn('Browser geolocation not supported, trying IP-based fallback');

      (async () => {
        const services = [
          { url: 'http://ip-api.com/json/', lat: 'lat', lon: 'lon', city: 'city', country: 'country' },
          { url: 'https://ipapi.co/json/', lat: 'latitude', lon: 'longitude', city: 'city', country: 'country_name' },
        ];

        let success = false;

        for (const service of services) {
          try {
            console.log(`Trying IP service: ${service.url}`);
            const response = await fetch(service.url);

            if (!response.ok) continue;

            const data = await response.json();
            console.log('IP service response:', data);

            if (data[service.lat] && data[service.lon]) {
              const lat = parseFloat(data[service.lat]);
              const lon = parseFloat(data[service.lon]);

              setFormData(prev => ({
                ...prev,
                latitude: parseFloat(lat.toFixed(8)),
                longitude: parseFloat(lon.toFixed(8)),
              }));
              setIsAutoDetectedLocation(false);
              setLocationLoading(false);
              success = true;

              const city = data[service.city] || 'Unknown';
              const country = data[service.country] || 'Unknown';
              addToast(`Location detected via IP: ${city}, ${country} (approximate)`, 'success', 4000);
              break;
            }
          } catch (err) {
            console.warn(`Service ${service.url} failed:`, err);
            continue;
          }
        }

        if (!success) {
          console.error('All IP geolocation services failed');
          const errorMsg = 'Geolocation not supported. Please enter coordinates manually below.';
          setError(errorMsg);
          addToast(errorMsg, 'warning', 4000);
          setLocationLoading(false);
        }
      })();
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
      const errorMsg = 'Please fix the errors below';
      setError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
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

      addToast('Profile setup completed successfully! Welcome to Matcha!', 'success', 4000);
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
      addToast(errorMessage, 'error', 5000);
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
          <FormInput
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            label="First Name"
            placeholder="Your first name..."
            error={fieldErrors.firstName}
          />

          <FormInput
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            label="Last Name"
            placeholder="Your last name..."
            error={fieldErrors.lastName}
          />
        </div>

        <FormSelect
          id="gender"
          name="gender"
          value={formData.gender}
          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
          label="Gender"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          error={fieldErrors.gender}
        />

        <FormSelect
          id="sexualPreference"
          name="sexualPreference"
          value={formData.sexualPreference}
          onChange={(e) => setFormData({ ...formData, sexualPreference: e.target.value })}
          label="Sexual Preference"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'both', label: 'Both' },
          ]}
          error={fieldErrors.sexualPreference}
        />

        <FormInput
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
          label="Birth Date"
          max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
          error={fieldErrors.birthDate}
          required
        />

        <div>
          <label className="block text-sm font-medium mb-3">Location</label>
          {formData.latitude && formData.longitude && isAutoDetectedLocation && (
            <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ Location auto-detected during account activation ({formData.latitude.toFixed(8)}, {formData.longitude.toFixed(8)})
              </p>
              <p className="text-xs text-green-500 dark:text-green-400 mt-1">
                Use any of the options below to update your location
              </p>
            </div>
          )}
          <div className="space-y-4 border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-slate-800">
            <div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Auto-detect GPS</p>
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
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Manual Coordinates</p>
              <div className="grid grid-cols-2 gap-2">
                <FormInput
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude !== null ? String(formData.latitude) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const value = parseFloat(e.target.value);
                      const rounded = parseFloat(value.toFixed(8));
                      setFormData(prev => ({ ...prev, latitude: rounded }));
                    } else {
                      setFormData(prev => ({ ...prev, latitude: null }));
                    }
                  }}
                  label="Latitude (-90 to 90)"
                  placeholder="e.g., 37.77491234"
                  step="0.00000001"
                  min="-90"
                  max="90"
                />

                <FormInput
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude !== null ? String(formData.longitude) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      const value = parseFloat(e.target.value);
                      const rounded = parseFloat(value.toFixed(8));
                      setFormData(prev => ({ ...prev, longitude: rounded }));
                    } else {
                      setFormData(prev => ({ ...prev, longitude: null }));
                    }
                  }}
                  label="Longitude (-180 to 180)"
                  placeholder="e.g., -122.41943217"
                  step="0.00000001"
                  min="-180"
                  max="180"
                />
              </div>
            </div>

            {formData.latitude !== null && formData.longitude !== null && (
              <div className="text-xs text-gray-700 dark:text-gray-300 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 p-3 rounded">
                <strong>Current Location:</strong> {formData.latitude.toFixed(8)}, {formData.longitude.toFixed(8)}
              </div>
            )}
          </div>
        </div>

        <FormTextarea
          id="biography"
          name="biography"
          value={formData.biography}
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          label="Biography"
          placeholder="Tell us about yourself..."
          rows={4}
          maxLength={500}
          showCharCount={true}
          error={fieldErrors.biography}
        />

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
          <Alert type="error" message={error} onClose={() => setError('')}>
            {Object.keys(fieldErrors).length > 0 && (
              <ul className="list-disc list-inside text-xs space-y-1 mt-2">
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}

        <Button
          type="button"
          onClick={handleSubmit}
          fullWidth
          loading={loading}
          disabled={loading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.gender || !formData.sexualPreference || !formData.birthDate || !formData.biography || formData.interests.length === 0 || formData.photos.length === 0}
        >
          {loading ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </form>
    </div>
  );
}
