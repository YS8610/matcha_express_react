import { Target, MessageCircle, Lock } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Matcha</h1>
        <p className="text-xl text-gray-600 mb-8">
          Because love, too, can be industrialized
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Find Your Perfect Match</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of users who have found meaningful connections through our intelligent matching system.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Target className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-1">Smart Matching</h3>
              <p className="text-sm text-gray-600">
                Our algorithm considers location, interests, and compatibility
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <MessageCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="font-semibold mb-1">Real-time Chat</h3>
              <p className="text-sm text-gray-600">
                Connect instantly with your matches
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Lock className="w-10 h-10 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-1">Secure & Private</h3>
              <p className="text-sm text-gray-600">
                Your data is protected with industry-standard security
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <a
              href="/register"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 font-medium"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="border border-blue-500 text-blue-500 px-6 py-3 rounded-md hover:bg-blue-50 font-medium"
            >
              Sign In
            </a>
          </div>
        </div>
        
        <div className="text-sm text-gray-500">
          <p>Already trusted by 500+ users</p>
        </div>
      </div>
    </div>
  );
}
