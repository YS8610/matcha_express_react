'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ActivatePage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const storeAndRedirect = async () => {
      try {
        const resolvedParams = await params;
        const token = resolvedParams?.token;

        if (!token || token.trim() === '') {
          router.push('/activate');
          return;
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('activationToken', token);
        }

        router.push('/activate');
      } catch (error) {
        router.push('/activate');
      }
    };

    storeAndRedirect();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p>Processing activation...</p>
    </div>
  );
}
