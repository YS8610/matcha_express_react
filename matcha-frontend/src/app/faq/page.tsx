// src/app/faq/page.tsx
// Styled based on https://tinder.com/faq/
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'account', name: 'Account & Profile' },
    { id: 'matching', name: 'Matching & Swiping' },
    { id: 'messaging', name: 'Messaging' },
    { id: 'subscription', name: 'Subscriptions & Billing' },
    { id: 'safety', name: 'Safety & Privacy' },
    { id: 'technical', name: 'Technical Issues' },
  ];

  const faqs = [
    {
      id: 1,
      question: 'How do I create an account?',
      answer: "Creating an account is easy! You can sign up using your email, Google account, or Facebook account. Click on the \"Sign Up\" button on our homepage and follow the prompts to set up your profile. You'll need to verify your email address and add some photos to get started.",
      category: 'account'
    },
    {
      id: 2,
      question: 'How do I edit my profile?',
      answer: "To edit your profile, go to your profile page by clicking on your profile icon in the top right corner. Then click the \"Edit Profile\" button. From there, you can change your photos, update your bio, add interests, and modify your basic information.",
      category: 'account'
    },
    {
      id: 3,
      question: 'How does the matching algorithm work?',
      answer: "Our matching algorithm considers various factors including your location, interests, preferences, and swiping history to suggest compatible profiles. The more you use Web Matcha, the better our algorithm gets at understanding your type and preferences.",
      category: 'matching'
    },
    {
      id: 4,
      question: 'What happens when I swipe right on someone?',
      answer: "When you swipe right on someone, you're indicating interest in them. If they also swipe right on you, it's a match! You'll be notified, and you can then start messaging each other through our chat feature.",
      category: 'matching'
    },
    {
      id: 5,
      question: 'How do I unmatch someone?',
      answer: "To unmatch someone, go to your messages, open the conversation with the person you want to unmatch, tap the three dots in the top right corner, and select \"Unmatch.\" Once you unmatch someone, they will no longer appear in your matches, and you won't be able to message each other.",
      category: 'matching'
    },
    {
      id: 6,
      question: 'Can I send messages to anyone?',
      answer: "You can only send messages to users you've matched with. When both users have swiped right on each other, a match is created, and the messaging feature becomes available. This helps ensure that conversations are between people who have a mutual interest.",
      category: 'messaging'
    },
    {
      id: 7,
      question: 'Why did my message disappear?',
      answer: "Messages may disappear if the other person unmatched you, deleted their account, or reported your message. If you're experiencing issues with messages not sending or disappearing unexpectedly, please contact our support team for assistance.",
      category: 'messaging'
    },
    {
      id: 8,
      question: 'What are the different subscription options?',
      answer: "We offer three subscription tiers: Basic (free), Matcha Plus, and Matcha Platinum. The premium tiers offer features like unlimited likes, seeing who likes you, priority matching, and more. You can view detailed plan comparisons on our Features page.",
      category: 'subscription'
    },
    {
      id: 9,
      question: 'How do I cancel my subscription?',
      answer: "To cancel your subscription, go to your account settings, select \"Manage Subscription,\" and then \"Cancel Subscription.\" Follow the prompts to complete the cancellation. Please note that canceling your subscription doesn't automatically delete your account.",
      category: 'subscription'
    },
    {
      id: 10,
      question: 'How does Web Matcha protect my privacy?',
      answer: "We take privacy seriously. Your personal information is encrypted and protected according to our Privacy Policy. We never share your data with third parties without your consent. You can control what information is visible on your profile and who can see it.",
      category: 'safety'
    },
    {
      id: 11,
      question: 'How do I report inappropriate behavior?',
      answer: "If someone is behaving inappropriately, you can report them by going to their profile, tapping the three dots in the top right corner, and selecting \"Report.\" Choose the reason for your report and provide any additional details. Our safety team reviews all reports promptly.",
      category: 'safety'
    },
    {
      id: 12,
      question: 'The app keeps crashing. What should I do?',
      answer: "If the app is crashing, try these steps: 1) Close and restart the app, 2) Check for app updates, 3) Ensure your device has the latest OS update, 4) Clear the app cache, 5) Reinstall the app. If issues persist, please contact our support team with details about your device and the problem.",
      category: 'technical'
    },
    {
      id: 13,
      question: "Why can't I see any matches?",
      answer: "There could be several reasons: 1) You're new to the platform and haven't made any matches yet, 2) Your location settings may be incorrect, 3) Your preferences might be too restrictive, 4) There may be fewer users in your area. Try expanding your preferences or checking your location settings.",
      category: 'matching'
    },
    {
      id: 14,
      question: 'How do I delete my account?',
      answer: "To delete your account, go to your account settings, scroll to the bottom, and select \"Delete Account.\" You'll be asked to confirm the deletion and provide feedback. Please note that account deletion is permanent and all your data will be removed from our servers.",
      category: 'account'
    },
    {
      id: 15,
      question: 'What is a "Super Like"?',
      answer: "A Super Like is a special way to show someone you're really interested in them. When you Super Like someone, they'll see a blue star on your profile when you appear in their stack. Free users get one Super Like per day, while premium subscribers get more.",
      category: 'matching'
    },
  ];

  // Toggle question open/closed state
  const toggleQuestion = (id: number) => {
    if (openQuestions.includes(id)) {
      setOpenQuestions(openQuestions.filter((qId) => qId !== id));
    } else {
      setOpenQuestions([...openQuestions, id]);
    }
  };

  // Filter FAQs based on search term and active category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Find answers to common questions about Web Matcha
          </p>
          
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          {searchTerm && (
            <p className="mb-6 text-gray-600">
              {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'} for &quot;{searchTerm}&quot;
            </p>
          )}

          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No results found</h3>
              <p className="text-gray-600 mb-6">
                We couldn&apos;t find any matches for your search. Try using different keywords or browsing our categories.
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="text-green-600 font-medium hover:underline"
              >
                Clear search and show all FAQs
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg bg-white overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                    onClick={() => toggleQuestion(faq.id)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    {openQuestions.includes(faq.id) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  
                  {openQuestions.includes(faq.id) && (
                    <div className="px-5 pb-5">
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="max-w-3xl mx-auto mt-16 bg-green-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center bg-green-600 text-white font-medium py-3 px-6 rounded-full hover:bg-green-700 transition-colors"
            >
              Contact Support
            </Link>
            <a
              href="mailto:support@webmatcha.com"
              className="inline-flex items-center justify-center border border-green-600 text-green-600 font-medium py-3 px-6 rounded-full hover:bg-green-50 transition-colors"
            >
              Email Us
            </a>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-12 text-center">
          <button
            className="inline-flex items-center text-green-600 font-medium hover:text-green-700"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Suggest a New FAQ
          </button>
        </div>
      </div>
    </div>
  );
}
