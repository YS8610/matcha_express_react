import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const alertStyles: Record<AlertType, string> = {
  error: 'bg-red-100 dark:bg-red-900/20 border-red-400 dark:border-red-600 text-red-700 dark:text-red-200',
  success: 'bg-green-100 dark:bg-green-900/20 border-green-400 dark:border-green-600 text-green-700 dark:text-green-200',
  warning: 'bg-amber-100 dark:bg-amber-900/20 border-amber-400 dark:border-amber-600 text-amber-700 dark:text-amber-200',
  info: 'bg-blue-100 dark:bg-blue-900/20 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-200',
};

const alertIcons: Record<AlertType, React.ReactNode> = {
  error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
  success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
  warning: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
  info: <Info className="w-5 h-5 flex-shrink-0" />,
};

export default function Alert({ type, message, onClose, className = '', children }: AlertProps) {
  return (
    <div className={`border px-4 py-3 rounded-md flex items-start gap-2 ${alertStyles[type]} ${className}`}>
      {alertIcons[type]}
      <div className="flex-1">
        <p className="text-sm">{message}</p>
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
