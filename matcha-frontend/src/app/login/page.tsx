import LoginForm from '@/components/auth/LoginForm';
import { Leaf } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
        <div className="absolute -bottom-8 left-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-10 dark:opacity-5"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-sm border border-green-200 dark:border-green-900/50 rounded-2xl shadow-xl dark:shadow-2xl p-6 sm:p-8" style={{ backgroundColor: 'var(--background)' }}>
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full blur-lg opacity-40 dark:opacity-30"></div>
                <div className="relative bg-gradient-to-br from-green-400 to-green-600 dark:from-green-700 dark:to-green-800 p-4 rounded-full shadow-lg">
                  <Leaf className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-green-400 dark:from-green-300 dark:via-green-400 dark:to-green-300 bg-clip-text text-transparent mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Steep into your <span className="font-semibold text-green-600 dark:text-green-400">perfect</span> connections
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
