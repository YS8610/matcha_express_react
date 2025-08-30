import RegisterForm from '@/components/auth/RegisterForm';
import { Leaf, Heart } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-green-600 animate-pulse" />
            <Heart className="w-12 h-12 text-green-500" />
            <Leaf className="w-10 h-10 text-green-600 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mb-2">Join Matcha</h1>
          <p className="text-green-600">Start brewing meaningful connections</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}