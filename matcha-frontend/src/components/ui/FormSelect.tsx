import React from 'react';

interface FormSelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  id: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: FormSelectOption[];
  label?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export default function FormSelect({
  id,
  name,
  value,
  onChange,
  options,
  label,
  error,
  required = false,
  disabled = false,
  placeholder = 'Select...',
  className = '',
}: FormSelectProps) {
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
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`w-full px-3 py-2 border rounded-md transition-colors bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
          error
            ? 'border-red-500 dark:border-red-500'
            : 'border-gray-300 dark:border-slate-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
