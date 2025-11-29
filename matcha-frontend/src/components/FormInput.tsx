'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormInputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'date' | 'number' | 'tel';
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  isValid?: boolean;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
  max?: string;
  min?: string;
}

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  placeholder,
  disabled = false,
  required = false,
  autoComplete,
  max,
  min,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          max={max}
          min={min}
          className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white dark:bg-slate-700/50 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-base focus:outline-none ${
            error
              ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : isValid
              ? 'border-green-500 dark:border-green-500 focus:ring-2 focus:ring-green-500/20'
              : 'border-gray-300 dark:border-slate-600 focus:border-green-500 dark:focus:border-green-500 focus:ring-2 focus:ring-green-500/10'
          }`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-200">
          {isValid && (
            <CheckCircle className="w-5 h-5 text-green-500 animate-in scale-in" aria-hidden="true" />
          )}
          {error && (
            <AlertCircle className="w-5 h-5 text-red-500 animate-in scale-in" aria-hidden="true" />
          )}
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 font-medium animate-in fade-in">{error}</p>
      )}
    </div>
  );
}
