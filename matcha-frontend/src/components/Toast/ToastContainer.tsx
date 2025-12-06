'use client';

import { useToast } from '@/contexts/ToastContext';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-800 dark:text-emerald-200';
      case 'error':
        return 'text-red-800 dark:text-red-200';
      case 'warning':
        return 'text-yellow-800 dark:text-yellow-200';
      default:
        return 'text-blue-800 dark:text-blue-200';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm ${getBackgroundColor(toast.type)}`}
        >
          <div className={`mt-0.5 flex-shrink-0 ${getIconColor(toast.type)}`}>
            {getIcon(toast.type)}
          </div>
          <div className={`flex-grow text-sm font-medium ${getTextColor(toast.type)}`}>
            {toast.message}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={`ml-2 flex-shrink-0 ${getTextColor(toast.type)} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
