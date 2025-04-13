// src/app/cookie-policy/page.tsx
// Styled after https://policies.tinder.com/cookie-policy/intl/en/
import React from 'react';

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-gray-700">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Cookie Policy</h1>
        <p className="text-gray-500">Last updated: April 12, 2025</p>
      </div>

      <div className="mb-8">
        <p className="text-lg">
          This Cookie Policy explains how Web Matcha (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) uses cookies and similar technologies 
          to recognize and remember you when you visit our website and services.
        </p>
      </div>

      <div className="mb-10 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">CONTENTS</h2>
        <ul className="space-y-2">
          <li><a href="#what-are-cookies" className="text-green-500 hover:underline">1. What Are Cookies</a></li>
          <li><a href="#types-of-cookies" className="text-green-500 hover:underline">2. Types of Cookies We Use</a></li>
          <li><a href="#purposes" className="text-green-500 hover:underline">3. Purposes of Cookies</a></li>
          <li><a href="#third-party" className="text-green-500 hover:underline">4. Third-Party Cookies</a></li>
          <li><a href="#control" className="text-green-500 hover:underline">5. Your Cookie Control Options</a></li>
          <li><a href="#updates" className="text-green-500 hover:underline">6. Updates to This Policy</a></li>
          <li><a href="#contact" className="text-green-500 hover:underline">7. Contact Information</a></li>
        </ul>
      </div>

      <div className="space-y-10">
        <div id="what-are-cookies" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. WHAT ARE COOKIES</h2>
          <p className="mb-4">
            Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit 
            certain web pages. They are widely used to make websites work more efficiently, provide a better user 
            experience, and provide information to the owners of the site.
          </p>
          <p className="mb-4">
            Other similar technologies like web beacons, pixels, and local storage can also store information on your 
            browser or device. In this policy, we use the term &quot;cookies&quot; to refer to all of these technologies.
          </p>
        </div>

        <div id="types-of-cookies" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. TYPES OF COOKIES WE USE</h2>
          <p className="mb-4">
            We use different types of cookies on our website:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>
              <strong>Essential cookies:</strong> These cookies are necessary for the website to function properly. 
              They enable core functionality such as security, network management, and account access. You cannot 
              opt out of these cookies.
            </li>
            <li>
              <strong>Performance/Analytics cookies:</strong> These cookies help us understand how visitors interact 
              with our website by collecting and reporting information anonymously. They help us improve the way our 
              website works.
            </li>
            <li>
              <strong>Functionality cookies:</strong> These cookies allow our website to remember choices you make 
              and provide enhanced, more personal features (such as your language preference or location).
            </li>
            <li>
              <strong>Targeting/Advertising cookies:</strong> These cookies are used to deliver advertisements that 
              are more relevant to you and your interests.
            </li>
          </ul>
        </div>

        <div id="purposes" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. PURPOSES OF COOKIES</h2>
          <p className="mb-4">
            We use cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>To provide a personalized experience and remember your preferences</li>
            <li>To authenticate users and protect user data</li>
            <li>To improve our website and services through analytics and research</li>
            <li>To ensure our website functions properly and efficiently</li>
            <li>To understand usage patterns to improve features and content</li>
            <li>To deliver relevant advertisements based on your interests</li>
            <li>To measure the effectiveness of our marketing campaigns</li>
          </ul>
        </div>

        <div id="third-party" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. THIRD-PARTY COOKIES</h2>
          <p className="mb-4">
            Some cookies are placed by third parties on our website. These third parties may include:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Analytics providers (like Google Analytics)</li>
            <li>Advertising networks</li>
            <li>Social media platforms</li>
            <li>Payment processors</li>
          </ul>
          <p className="mb-4">
            We do not control the use of cookies by these third parties. We encourage you to review the privacy and cookie 
            policies of these third parties for more information about their practices.
          </p>
        </div>

        <div id="control" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. YOUR COOKIE CONTROL OPTIONS</h2>
          <p className="mb-4">
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Delete cookies from your device</li>
            <li>Block cookies by activating the setting in your browser that allows you to refuse all or some cookies</li>
            <li>Set your browser to notify you when you receive a cookie</li>
          </ul>
          <p className="mb-4">
            Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features 
            of our website, and some services may not function properly.
          </p>
          <p className="mb-4">
            For more information about how to manage cookies in your browser, please visit:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><a href="https://support.google.com/chrome/answer/95647" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" className="text-green-500 hover:underline" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>
        </div>

        <div id="updates" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. UPDATES TO THIS POLICY</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. 
            Any changes will be posted on this page, and if the changes are significant, we will provide a more prominent notice.
          </p>
        </div>

        <div id="contact" className="terms-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. CONTACT INFORMATION</h2>
          <p className="mb-2">
            If you have any questions about our Cookie Policy, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-1">
              <span className="font-semibold">Email:</span> privacy@webmatcha.com
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
