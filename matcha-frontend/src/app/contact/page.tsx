// src/app/contact/page.tsx
// Styled after https://policies.tinder.com/contact/intl/en/
'use client';

import React, { useState } from 'react';
import { Send, HelpCircle, Mail, AlertCircle, Instagram, Twitter, Facebook } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitStatus({
        success: true,
        message: 'Thanks for reaching out! Our team will get back to you soon.'
      });

      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch {
      setSubmitStatus({
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-gray-800">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-gray-600">
          We're here to help. Choose an option below or send us a message.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white p-3 rounded-full mb-4">
            <HelpCircle size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Help Center</h3>
          <p className="text-gray-600 mb-4">
            Find answers to frequently asked questions in our Help Center.
          </p>
          <a
            href="#"
            className="text-pink-500 font-medium hover:text-pink-600 transition-colors mt-auto"
          >
            Visit Help Center
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white p-3 rounded-full mb-4">
            <Mail size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-gray-600 mb-4">
            Contact our support team directly for personalized assistance.
          </p>
          <a
            href="mailto:support@webmatcha.com"
            className="text-pink-500 font-medium hover:text-pink-600 transition-colors mt-auto"
          >
            support@webmatcha.com
          </a>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
          <div className="bg-gradient-to-br from-pink-400 to-red-500 text-white p-3 rounded-full mb-4">
            <AlertCircle size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
          <p className="text-gray-600 mb-4">
            Having problems with your account or found a bug? Let us know.
          </p>
          <a
            href="#contact-form"
            className="text-pink-500 font-medium hover:text-pink-600 transition-colors mt-auto"
          >
            Report Problem
          </a>
        </div>
      </div>

      <div id="contact-form" className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Form info section */}
          <div className="bg-gradient-to-br from-pink-500 to-red-500 text-white p-8 md:w-1/3">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8">
              We value your feedback and are here to answer any questions you may have.
              Our team typically responds within 24 hours.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <Mail className="mr-3" size={20} />
                <span>support@webmatcha.com</span>
              </div>

              <div>
                <h3 className="font-semibold mb-1">Support Hours</h3>
                <p>Monday - Friday: 9AM - 6PM EST</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer"
                     className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded-full">
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"
                     className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded-full">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer"
                     className="bg-white bg-opacity-20 hover:bg-opacity-30 transition-all p-2 rounded-full">
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:w-2/3">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {submitStatus && (
              <div
                className={`p-4 rounded-lg mb-6 ${
                  submitStatus.success
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  What can we help you with?
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a topic</option>
                  <option value="Account Issues">Account Issues</option>
                  <option value="Technical Support">Technical Support</option>
                  <option value="Billing Questions">Billing Questions</option>
                  <option value="Safety Concerns">Safety Concerns</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Partnership">Partnership</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Please provide details about your inquiry..."
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium py-3 px-6 rounded-lg hover:from-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-300 flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <span className="flex items-center">
                    Send Message <Send size={16} className="ml-2" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
