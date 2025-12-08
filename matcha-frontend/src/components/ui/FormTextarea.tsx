import React from 'react';

interface FormTextareaProps {
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
  showCharCount?: boolean;
}

export default function FormTextarea({
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
  rows = 4,
  maxLength,
  className = '',
  showCharCount = false,
}: FormTextareaProps) {
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error
            ? 'border-red-500 dark:border-red-500'
            : 'border-gray-300 dark:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
      <div className="flex justify-between items-start mt-1">
        {showCharCount && maxLength && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {value.length}/{maxLength} characters
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    </div>
  );
}
