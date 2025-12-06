'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage({ params }: { params: Promise<{ id: string; token: string }> }) {
  const router = useRouter();

  useEffect(() => {
    const storeAndRedirect = async () => {
      try {
        const resolvedParams = await params;
        const userId = resolvedParams?.id;
        const token = resolvedParams?.token;

        if (!userId || !token || userId.trim() === '' || token.trim() === '') {
          router.push('/reset-password');
          return;
        }

        if (typeof window !== 'undefined') {
          sessionStorage.setItem('resetUserId', userId);
          sessionStorage.setItem('resetToken', token);
        }

        router.push('/reset-password');
      } catch (error) {
        console.error('Error handling password reset:', error);
        router.push('/reset-password');
      }
    };

    storeAndRedirect();
  }, [params, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <p>Processing password reset...</p>
    </div>
  );
}
