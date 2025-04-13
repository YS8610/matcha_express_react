// src/app/terms/page.tsx
// https://policies.tinder.com/terms/intl/en/
import React from 'react';

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-gray-700">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500">Last updated: April 12, 2025</p>
      </div>

      <div className="mb-8">
        <p className="text-lg">
          Welcome to Web Matcha. Please read these Terms of Service carefully before using the Web Matcha platform.
        </p>
      </div>

      <div className="mb-10 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">CONTENTS</h2>
        <ul className="space-y-2">
          <li><a href="#acceptance" className="text-red-500 hover:underline">1. Acceptance of Terms</a></li>
          <li><a href="#eligibility" className="text-red-500 hover:underline">2. Eligibility</a></li>
          <li><a href="#account" className="text-red-500 hover:underline">3. Account Creation and Security</a></li>
          <li><a href="#conduct" className="text-red-500 hover:underline">4. User Conduct</a></li>
          <li><a href="#content" className="text-red-500 hover:underline">5. Content</a></li>
          <li><a href="#ip" className="text-red-500 hover:underline">6. Intellectual Property</a></li>
          <li><a href="#termination" className="text-red-500 hover:underline">7. Termination</a></li>
          <li><a href="#warranty" className="text-red-500 hover:underline">8. Disclaimer of Warranties</a></li>
          <li><a href="#liability" className="text-red-500 hover:underline">9. Limitation of Liability</a></li>
          <li><a href="#law" className="text-red-500 hover:underline">10. Governing Law</a></li>
          <li><a href="#changes" className="text-red-500 hover:underline">11. Changes to Terms</a></li>
          <li><a href="#contact" className="text-red-500 hover:underline">12. Contact Information</a></li>
        </ul>
      </div>

      <div className="space-y-10">
        <div id="acceptance" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. ACCEPTANCE OF TERMS</h2>
          <p className="mb-4">
            By accessing or using Web Matcha (&quot;the Service&quot;), you agree to be bound by these Terms of
            Service. If you do not agree to these terms, you may not access or use the Service.
          </p>
        </div>

        <div id="eligibility" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. ELIGIBILITY</h2>
          <p className="mb-4">
            You must be at least 18 years old to use the Service. By using the Service, you represent
            and warrant that you are at least 18 years of age and have the right, authority, and
            capacity to enter into this agreement.
          </p>
        </div>

        <div id="account" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. ACCOUNT CREATION AND SECURITY</h2>
          <p className="mb-4">
            When creating an account, you agree to provide accurate, current, and complete information.
            You are responsible for maintaining the confidentiality of your account credentials and
            for all activities that occur under your account.
          </p>
          <p className="mb-4">
            You agree to immediately notify Web Matcha of any unauthorized use of your account or
            any other breach of security. Web Matcha cannot and will not be liable for any loss or
            damage arising from your failure to comply with this section.
          </p>
        </div>

        <div id="conduct" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. USER CONDUCT</h2>
          <p className="mb-4">
            You agree not to use the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Post content that is illegal, harmful, threatening, abusive, harassing, or defamatory</li>
            <li>Impersonate any person or entity</li>
            <li>Stalk or harass other users</li>
            <li>Collect or store personal data about other users without their consent</li>
            <li>Use automated scripts to access the Service</li>
            <li>Engage in commercial activities without prior written permission</li>
            <li>Violate any laws or regulations</li>
          </ul>
        </div>

        <div id="content" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. CONTENT</h2>
          <p className="mb-4">
            By submitting content to the Service, you grant Web Matcha a worldwide, non-exclusive,
            royalty-free license to use, reproduce, modify, adapt, publish, and display such content
            in connection with providing and promoting the Service.
          </p>
          <p className="mb-4">
            You represent and warrant that you own or have the necessary rights to all content you
            submit and that such content does not violate any third-party rights.
          </p>
        </div>

        <div id="ip" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. INTELLECTUAL PROPERTY</h2>
          <p className="mb-4">
            All trademarks, service marks, logos, trade names, and designs used on the Service are
            the property of Web Matcha or its licensors. Nothing in these Terms gives you the right
            to use any of these without prior written permission.
          </p>
        </div>

        <div id="termination" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. TERMINATION</h2>
          <p className="mb-4">
            Web Matcha reserves the right to suspend or terminate your account at any time for any
            reason without notice or liability. You may terminate your account at any time by
            following the instructions on the Service.
          </p>
        </div>

        <div id="warranty" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. DISCLAIMER OF WARRANTIES</h2>
          <p className="mb-4 uppercase">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            WEB MATCHA DISCLAIMS ALL WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
        </div>

        <div id="liability" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. LIMITATION OF LIABILITY</h2>
          <p className="mb-4 uppercase">
            IN NO EVENT SHALL WEB MATCHA BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE.
          </p>
        </div>

        <div id="law" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. GOVERNING LAW</h2>
          <p className="mb-4">
            These Terms shall be governed by the laws of the State of New York, without regard to
            its conflict of law provisions. Any disputes arising under these Terms shall be resolved
            exclusively in the state or federal courts located in New York County, New York.
          </p>
        </div>

        <div id="changes" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. CHANGES TO TERMS</h2>
          <p className="mb-4">
            Web Matcha reserves the right to modify these Terms at any time. We will provide notice
            of any material changes by posting the updated Terms on the Service and updating the
            &quot;last updated&quot; date. Your continued use of the Service after such changes constitutes
            your acceptance of the new Terms.
          </p>
        </div>

        <div id="contact" className="terms-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. CONTACT INFORMATION</h2>
          <p className="mb-2">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-1">
              <span className="font-semibold">Email:</span> legal@webmatcha.com
            </p>
            <p>
              <span className="font-semibold">Address:</span> 123 Match Street, New York, NY 10001
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
