// src/app/features/page.tsx
// https://tinder.com/feature/subscription-tiers/
import React from 'react';
import { FaStar, FaCrown } from 'react-icons/fa';
import { APP_FEATURES } from '@/constants/features';

export default function FeaturesPage() {
  return (
    <div className="bg-gradient-to-b from-pink-50 to-white min-h-screen">
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4">Upgrade Your Dating Experience</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the Matcha experience that&apos;s right for you
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div className="bg-gray-100 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Matcha Basic</h2>
              <p className="text-gray-600 my-2">The essentials</p>
              <p className="text-3xl font-bold text-pink-600 mt-4">Free</p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {APP_FEATURES.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>{feature.title}</span>
                  </li>
                ))}
                <li className="flex items-start text-gray-400">
                  <span className="mr-2">✗</span>
                  <span>See Who Likes You</span>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-2">✗</span>
                  <span>Unlimited Likes</span>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 px-4 bg-pink-100 text-pink-600 font-medium rounded-lg hover:bg-pink-200 transition-colors">
                Current Plan
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105 border-2 border-green-500 relative">
            <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-bold rounded-bl-lg">
              POPULAR
            </div>
            <div className="bg-green-50 p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center justify-center">
                Matcha Plus <FaStar className="ml-2 text-yellow-500" />
              </h2>
              <p className="text-gray-600 my-2">Unlock key features</p>
              <p className="text-3xl font-bold text-green-600 mt-4">$9.99<span className="text-sm font-normal">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>All Basic Features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>See Who Likes You</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Unlimited Likes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>5 Super Likes Per Day</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>1 Boost Per Month</span>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                Get Matcha Plus
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all hover:scale-105">
            <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-center">
              <h2 className="text-2xl font-bold text-white flex items-center justify-center">
                Matcha Platinum <FaCrown className="ml-2 text-yellow-300" />
              </h2>
              <p className="text-white opacity-90 my-2">VIP experience</p>
              <p className="text-3xl font-bold text-white mt-4">$19.99<span className="text-sm font-normal">/month</span></p>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>All Plus Features</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Priority Matching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Message Before Matching</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>See Read Receipts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>1 Boost Per Week</span>
                </li>
              </ul>
              <button className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors">
                Get Matcha Platinum
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 bg-white rounded-xl shadow-lg my-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Compare Features</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-gray-600">Matcha Basic</th>
                <th className="text-center py-4 px-4 font-semibold text-pink-600">Matcha Plus</th>
                <th className="text-center py-4 px-4 font-semibold text-purple-600">Matcha Platinum</th>
              </tr>
            </thead>
            <tbody>
              {APP_FEATURES.map((feature, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-4 px-4 font-medium">{feature.title}</td>
                  <td className="text-center py-4 px-4">
                    {index < 3 ? <span className="text-green-500">✓</span> : <span className="text-gray-300">✗</span>}
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-green-500">✓</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="text-green-500">✓</span>
                  </td>
                </tr>
              ))}
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">See Who Likes You</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Unlimited Likes</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Super Likes</td>
                <td className="text-center py-4 px-4">1 per day</td>
                <td className="text-center py-4 px-4">5 per day</td>
                <td className="text-center py-4 px-4">5 per day</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Boosts</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4">1 per month</td>
                <td className="text-center py-4 px-4">1 per week</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Priority Matching</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Message Before Matching</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 font-medium">Read Receipts</td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-gray-300">✗</span></td>
                <td className="text-center py-4 px-4"><span className="text-green-500">✓</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">How do the subscription plans work?</h3>
            <p className="text-gray-600">Our subscription plans are billed monthly and automatically renew until canceled. You can upgrade, downgrade, or cancel at any time from your account settings.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">What are Super Likes?</h3>
            <p className="text-gray-600">Super Likes let someone know you&apos;re really interested before they decide to like or pass on you. When you Super Like someone, they&apos;ll see a bright blue star when your profile appears for them.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">What are Boosts?</h3>
            <p className="text-gray-600">Boosts put your profile at the top of the stack in your area for 30 minutes, increasing your visibility and chances of matching by up to 10x.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Can I cancel anytime?</h3>
            <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your premium features will remain active until the end of your billing period.</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-pink-500 to-purple-600 py-16 px-4 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Match?</h2>
        <p className="text-xl max-w-2xl mx-auto mb-8">Join millions of singles discovering meaningful connections every day.</p>
        <button className="bg-white text-pink-600 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-gray-100 transition-colors">
          Get Started Now
        </button>
      </section>
    </div>
  );
}
