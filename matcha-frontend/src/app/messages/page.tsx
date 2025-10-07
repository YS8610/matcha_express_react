'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, Construction } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-green-400 to-green-600 p-4 rounded-full">
              <MessageCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
        </div>

        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 text-center border border-green-100">
          <div className="flex justify-center mb-4">
            <div className="bg-yellow-100 p-4 rounded-full">
              <Construction className="w-12 h-12 text-yellow-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h2>
          <p className="text-gray-600 mb-6">
            The messaging feature is currently under development. You&apos;ll be able to chat with your matches soon!
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
            <p className="text-sm font-medium text-green-800 mb-2">What you can do now:</p>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Browse profiles and find matches</li>
              <li>• Like profiles you&apos;re interested in</li>
              <li>• Check who viewed your profile</li>
              <li>• Update your profile and photos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}