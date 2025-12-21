'use client';

import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import ProfileView from './ProfileView';

interface ProfileModalProps {
  userId: string;
}

export default function ProfileModal({ userId }: ProfileModalProps) {
  const router = useRouter();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/browse');
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.back();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [router]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-6xl my-8">
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all shadow-lg"
            aria-label="Close profile"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Profile content with scroll */}
          <div className="overflow-y-auto max-h-[90vh]">
            <ProfileView userId={userId} isModal={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
