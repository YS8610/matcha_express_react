'use client';

import { AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface AlertBoxProps {
  type: 'error' | 'success' | 'info' | 'warning';
  message: ReactNode;
  onClose?: () => void;
  title?: string;
  animated?: boolean;
}

export default function AlertBox({
  type,
  message,
  onClose,
  title,
  animated = true,
}: AlertBoxProps) {
  const baseStyles = 'flex items-start gap-3 p-4 border rounded-lg';
  const animationClass = animated ? 'animate-in fade-in slide-in-from-top' : '';

  const typeStyles = {
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200',
  };

  const iconMap = {
    error: <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />,
    success: <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />,
    info: <InfoIcon className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" aria-hidden="true" />,
  };

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${animationClass} text-sm`}>
      {iconMap[type]}
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p>{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
          aria-label="Close alert"
        >
          ✕
        </button>
      )}
    </div>
  );
}
