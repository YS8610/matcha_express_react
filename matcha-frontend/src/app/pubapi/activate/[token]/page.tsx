'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function PubApiActivatePage() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    if (token) {
      router.push(`/activate/${token}`);
    }
  }, [token, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to activation page...</p>
      </div>
    </div>
  );
}
