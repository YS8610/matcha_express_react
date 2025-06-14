// src/components/auth/AuthFlow.tsx
import React, { useState } from 'react';
import { Heart, Eye, EyeOff, Camera, MapPin } from 'lucide-react';

interface AuthFlowProps {
  isAuthenticated: boolean;
  isProfileComplete: boolean;
  onLogin: (credentials: { username: string; password: string }) => Promise<void>;
  onRegister: (data: any) => Promise<void>;
  onCompleteProfile: (data: any) => Promise<void>;
}

const AuthFlow: React.FC<AuthFlowProps> = ({
  isAuthenticated,
  isProfileComplete,
  onLogin,
  onRegister,
  onCompleteProfile
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'profile'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({
    email: '', username: '', firstName: '', lastName: '', password: '', confirmPassword: ''
  });
  const [profileData, setProfileData] = useState({
    gender: '', preference: '', bio: '', tags: '', age: '', location: '', photos: [] as File[]
  });

  const currentMode = !isAuthenticated ? mode : !isProfileComplete ? 'profile' : 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (currentMode === 'login') {
        await onLogin(loginData);
      } else if (currentMode === 'register') {
        if (registerData.password !== registerData.confirmPassword) {
          throw new Error('Passwords do not match');
        }
        await onRegister(registerData);
      } else if (currentMode === 'profile') {
        await onCompleteProfile(profileData);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const requestLocation = () => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => setProfileData(prev => ({ ...prev, location: `${pos.coords.latitude},${pos.coords.longitude}` })),
      () => setProfileData(prev => ({ ...prev, location: 'Location unavailable' }))
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setProfileData(prev => ({ ...prev, photos: files.slice(0, 5) }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Heart className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Web Matcha</h1>
          <p className="text-gray-600">
            {currentMode === 'login' ? 'Welcome back!' : 
             currentMode === 'register' ? 'Join the community' : 
             'Complete your profile'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentMode === 'login' && (
            <>
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </>
          )}

          {currentMode === 'register' && (
            <>
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              <input
                type="text"
                placeholder="Username"
                value={registerData.username}
                onChange={(e) => setRegisterData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  required
                />
              </div>
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
            </>
          )}

          {currentMode === 'profile' && (
            <>
              <select
                value={profileData.gender}
                onChange={(e) => setProfileData(prev => ({ ...prev, gender: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
              <select
                value={profileData.preference}
                onChange={(e) => setProfileData(prev => ({ ...prev, preference: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              >
                <option value="">Sexual Preference</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="both">Both</option>
              </select>
              <input
                type="number"
                placeholder="Age"
                value={profileData.age}
                onChange={(e) => setProfileData(prev => ({ ...prev, age: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                min="18" max="100" required
              />
              <textarea
                placeholder="Tell us about yourself..."
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 h-24 resize-none"
                maxLength={500} required
              />
              <input
                type="text"
                placeholder="Interests (e.g., #hiking #coffee #music)"
                value={profileData.tags}
                onChange={(e) => setProfileData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                required
              />
              <button
                type="button"
                onClick={requestLocation}
                className="w-full p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <MapPin size={20} className="mr-2" />
                {profileData.location ? 'Location Updated' : 'Enable Location'}
              </button>
              <label className="block">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-pink-300 cursor-pointer">
                  <Camera className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-gray-500">Upload up to 5 photos</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {profileData.photos.length > 0 ? `${profileData.photos.length} photo(s) selected` : 'Click to browse'}
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
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 
             currentMode === 'login' ? 'Sign In' : 
             currentMode === 'register' ? 'Create Account' : 
             'Complete Profile'}
          </button>
        </form>

        {!isAuthenticated && (
          <div className="text-center mt-6">
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-pink-500 hover:text-pink-600"
            >
              {mode === 'login' ? "Don't have an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthFlow;
