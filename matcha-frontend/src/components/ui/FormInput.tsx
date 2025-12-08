import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface FormInputProps {
  type?: 'text' | 'email' | 'password' | 'date' | 'number';
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string;
  minLength?: number;
  maxLength?: number;
  className?: string;
  showValidation?: boolean;
  isValid?: boolean;
  autoComplete?: string;
}

export default function FormInput({
  type = 'text',
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  label,
  error,
  required = false,
  disabled = false,
  min,
  max,
  step,
  minLength,
  maxLength,
  className = '',
  showValidation = false,
  isValid = false,
  autoComplete,
}: FormInputProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium mb-2 text-green-700 dark:text-green-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          minLength={minLength}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={`w-full px-3 py-2.5 sm:py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
            error
              ? 'border-red-500 dark:border-red-500'
              : showValidation && isValid
              ? 'border-green-500 dark:border-green-500'
              : 'border-gray-300 dark:border-slate-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
        {showValidation && isValid && !error && (
          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
        {error && (
          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
