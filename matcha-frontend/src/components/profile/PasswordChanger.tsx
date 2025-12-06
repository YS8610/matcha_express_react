'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/contexts/ToastContext';
import { getPasswordValidationChecks } from '@/lib/validation';

interface PasswordChangerProps {
  className?: string;
}

export default function PasswordChanger({ className = '' }: PasswordChangerProps) {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const passwordValidation = getPasswordValidationChecks(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.newPassword !== formData.confirmPassword) {
      const errorMsg = 'New passwords do not match';
      setError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
      return;
    }

    if (!passwordValidation.isValid) {
      const errorMsg = 'New password does not meet requirements';
      setError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      const errorMsg = 'New password must be different from current password';
      setError(errorMsg);
      addToast(errorMsg, 'warning', 3000);
      return;
    }

    try {
      setLoading(true);
      await api.updatePassword(formData.oldPassword, formData.newPassword, formData.confirmPassword);
      setSuccess('Password updated successfully!');
      addToast('Password changed successfully!', 'success', 3000);
      setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      const errorMsg = (err as Error).message || 'Failed to update password';
      setError(errorMsg);
      addToast(errorMsg, 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const PasswordInput = ({
    name,
    label,
    value,
    placeholder,
    showPassword,
    onToggle
  }: {
    name: string;
    label: string;
    value: string;
    placeholder: string;
    showPassword: boolean;
    onToggle: () => void;
  }) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-1 text-green-700 dark:text-green-400">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          required
          placeholder={placeholder}
          className="w-full px-3 py-2 pr-10 border border-green-300 dark:border-green-700 rounded-md bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-600 dark:focus:border-green-600 transition-colors"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  const ValidationItem = ({ check, label }: { check: boolean; label: string }) => (
    <div className={`flex items-center gap-2 text-sm ${check ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
      {check ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
      <span>{label}</span>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">Change Password</h3>

      {error && (
        <div className="text-red-700 dark:text-red-300 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md">{error}</div>
      )}

      {success && (
        <div className="text-green-700 dark:text-green-300 text-sm bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 rounded-md">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput
          name="oldPassword"
          label="Current Password"
          value={formData.oldPassword}
          placeholder="Enter your current password"
          showPassword={showPasswords.old}
          onToggle={() => togglePasswordVisibility('old')}
        />

        <PasswordInput
          name="newPassword"
          label="New Password"
          value={formData.newPassword}
          placeholder="Enter your new password"
          showPassword={showPasswords.new}
          onToggle={() => togglePasswordVisibility('new')}
        />

        {formData.newPassword && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Requirements:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              <ValidationItem check={passwordValidation.length} label="At least 8 characters" />
              <ValidationItem check={passwordValidation.lowercase} label="Lowercase letter" />
              <ValidationItem check={passwordValidation.uppercase} label="Uppercase letter" />
              <ValidationItem check={passwordValidation.number} label="Number" />
              <ValidationItem check={passwordValidation.special} label="Special character (@$!%*?&)" />
              <ValidationItem check={passwordValidation.commonWord} label="No common words" />
            </div>
          </div>
        )}

        <PasswordInput
          name="confirmPassword"
          label="Confirm New Password"
          value={formData.confirmPassword}
          placeholder="Confirm your new password"
          showPassword={showPasswords.confirm}
          onToggle={() => togglePasswordVisibility('confirm')}
        />

        {formData.confirmPassword && (
          <div className={`text-sm flex items-center gap-2 ${
            formData.newPassword === formData.confirmPassword ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
          }`}>
            {formData.newPassword === formData.confirmPassword ?
              <Check className="w-3 h-3" /> : <X className="w-3 h-3" />
            }
            <span>
              {formData.newPassword === formData.confirmPassword ?
                'Passwords match' : 'Passwords do not match'
              }
            </span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !passwordValidation.isValid || formData.newPassword !== formData.confirmPassword}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-2 px-4 rounded-md hover:from-green-700 hover:to-green-600 disabled:opacity-50 font-medium transition-all"
        >
          {loading ? 'Updating Password...' : 'Update Password'}
        </button>
      </form>

      <div className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-slate-900/30 border border-gray-200 dark:border-slate-700 p-3 rounded-md">
        <p className="font-medium mb-1 text-gray-700 dark:text-gray-300">Security Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Use a unique password that you don&apos;t use elsewhere</li>
          <li>Consider using a password manager</li>
          <li>Avoid using personal information in your password</li>
          <li>Change your password regularly</li>
        </ul>
      </div>
    </div>
  );
}
