'use client';

import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'alert' | 'confirm';
  isLoading?: boolean;
}

export default function Modal({
  isOpen,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'alert',
  isLoading = false,
}: ModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 dark:bg-black/60"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative bg-white dark:bg-slate-800 rounded-lg shadow-xl dark:shadow-2xl max-w-sm w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 dark:text-gray-300">{message}</p>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-slate-700">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isLoading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
