// src/components/auth/RegisterPage.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { validatePassword, PasswordValidationResult } from '../../utils/passwordValidation';

interface RegisterData {
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

interface RegisterPageProps {
  onRegister: (data: RegisterData) => void;
  onShowLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ 
  onRegister, 
  onShowLogin 
}) => {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordValidation?.isValid) {
      newErrors.password = 'Please fix password requirements';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onRegister({
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim()
      });
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    if (field === 'password') {
      const validation = validatePassword(value);
      setPasswordValidation(validation);
    }
  };

  const getPasswordStrengthColor = () => {
    if (!passwordValidation) return 'bg-gray-200';
    
    switch (passwordValidation.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthWidth = () => {
    if (!passwordValidation) return '0%';
    
    switch (passwordValidation.strength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Web Matcha</h1>
          <p className="text-gray-600">Find your perfect match</p>
        </div>
        
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            {formData.password && passwordValidation && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Password strength:</span>
                  <span className={`text-sm font-medium ${
                    passwordValidation.strength === 'weak' ? 'text-red-500' :
                    passwordValidation.strength === 'medium' ? 'text-yellow-500' :
                    'text-green-500'
                  }`}>
                    {passwordValidation.strength.charAt(0).toUpperCase() + passwordValidation.strength.slice(1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: getPasswordStrengthWidth() }}
                  />
                </div>
                
                {passwordValidation.errors.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {passwordValidation.errors.map((error, index) => (
                      <div key={index} className="flex items-center text-sm text-red-600">
                        <X size={14} className="mr-1" />
                        {error}
                      </div>
                    ))}
                  </div>
                )}
                
                {passwordValidation.isValid && (
                  <div className="mt-2 flex items-center text-sm text-green-600">
                    <Check size={14} className="mr-1" />
                    Password meets all requirements
                  </div>
                )}
              </div>
            )}
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`w-full p-3 pr-12 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <div className="mt-1 flex items-center text-sm text-green-600">
                <Check size={14} className="mr-1" />
                Passwords match
              </div>
            )}
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-700">
              By creating an account, you agree to our Terms of Service and Privacy Policy. 
              You must be at least 18 years old to use this service.
            </p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isLoading || !passwordValidation?.isValid}
            className="w-full bg-pink-500 text-white p-3 rounded-lg hover:bg-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>

        <div className="text-center mt-4">
          <button 
            onClick={onShowLogin} 
            className="text-pink-500 hover:text-pink-600"
            disabled={isLoading}
          >
            Already have an account? Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
