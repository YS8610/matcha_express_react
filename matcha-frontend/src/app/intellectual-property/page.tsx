// src/app/intellectual-property/page.tsx
// Styled similar to https://policies.tinder.com/intellectual-property/intl/en/?lang=en
import React from 'react';

export default function IntellectualPropertyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 text-gray-700">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Intellectual Property Policy</h1>
        <p className="text-gray-500">Last updated: April 12, 2025</p>
      </div>

      <div className="mb-8">
        <p className="text-lg">
          At Web Matcha, we respect the intellectual property rights of others and expect our users to do the same. 
          This policy outlines how we address intellectual property matters on our platform.
        </p>
      </div>

      <div className="mb-10 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">CONTENTS</h2>
        <ul className="space-y-2">
          <li><a href="#our-ip" className="text-green-500 hover:underline">1. Our Intellectual Property</a></li>
          <li><a href="#user-content" className="text-green-500 hover:underline">2. User-Generated Content</a></li>
          <li><a href="#copyright" className="text-green-500 hover:underline">3. Copyright Policy</a></li>
          <li><a href="#dmca" className="text-green-500 hover:underline">4. DMCA Compliance</a></li>
          <li><a href="#trademark" className="text-green-500 hover:underline">5. Trademark Policy</a></li>
          <li><a href="#reporting" className="text-green-500 hover:underline">6. Reporting Infringement</a></li>
          <li><a href="#contact" className="text-green-500 hover:underline">7. Contact Information</a></li>
        </ul>
      </div>

      <div className="space-y-10">
        <div id="our-ip" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. OUR INTELLECTUAL PROPERTY</h2>
          <p className="mb-4">
            The Web Matcha platform, including its name, logo, design elements, software, interfaces, content, 
            and features, are owned by or licensed to Web Matcha and are protected by copyright, trademark, 
            patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>
          <p className="mb-4">
            Unless explicitly stated otherwise, nothing in these terms gives you a right to use our name, logos, 
            trademarks, domain names, and other distinctive brand features. All rights, title, and interest in 
            and to the Web Matcha platform not expressly granted in this policy are reserved.
          </p>
        </div>

        <div id="user-content" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. USER-GENERATED CONTENT</h2>
          <p className="mb-4">
            By submitting, posting, or displaying content on or through the Web Matcha platform, you grant us a 
            worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, 
            transmit, display, and distribute such content in any and all media or distribution methods.
          </p>
          <p className="mb-4">
            You represent and warrant that you have all the rights, power, and authority necessary to grant the 
            rights granted herein to any content that you submit, including all necessary rights to upload your content 
            for purposes of the Web Matcha platform.
          </p>
        </div>

        <div id="copyright" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. COPYRIGHT POLICY</h2>
          <p className="mb-4">
            Web Matcha respects the intellectual property of others and expects our users to do the same. We will 
            respond to notices of alleged copyright infringement that comply with applicable law and are properly 
            provided to us.
          </p>
          <p className="mb-4">
            It is our policy to remove or disable access to material that we believe in good faith to be infringing, 
            to terminate the accounts of repeat infringers in appropriate circumstances, and to comply with applicable 
            laws and regulations.
          </p>
        </div>

        <div id="dmca" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. DMCA COMPLIANCE</h2>
          <p className="mb-4">
            If you believe that your work has been copied in a way that constitutes copyright infringement, please 
            provide us with the following information in accordance with the Digital Millennium Copyright Act (DMCA):
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>An electronic or physical signature of the person authorized to act on behalf of the owner of the copyright interest</li>
            <li>A description of the copyrighted work that you claim has been infringed</li>
            <li>A description of where the material that you claim is infringing is located on the site (including URL)</li>
            <li>Your address, telephone number, and email address</li>
            <li>A statement by you that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law</li>
            <li>A statement by you, made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner&apos;s behalf</li>
          </ul>
        </div>

        <div id="trademark" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. TRADEMARK POLICY</h2>
          <p className="mb-4">
            The Web Matcha name and logo are trademarks of our company. You may not use our trademarks without our 
            prior written permission. Additionally, the look and feel of the Web Matcha platform, including all page 
            headers, custom graphics, button icons, and scripts, is the service mark, trademark, and/or trade dress 
            of Web Matcha and may not be copied, imitated, or used, in whole or in part, without our prior written permission.
          </p>
          <p className="mb-4">
            All other trademarks, registered trademarks, product names, and company names or logos mentioned in the 
            platform are the property of their respective owners. Reference to any products, services, processes, or 
            other information, by trade name, trademark, manufacturer, supplier, or otherwise does not constitute or 
            imply endorsement, sponsorship, or recommendation by us.
          </p>
        </div>

        <div id="reporting" className="terms-section pb-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. REPORTING INFRINGEMENT</h2>
          <p className="mb-4">
            If you believe that your intellectual property rights have been violated, please send a notification to 
            our designated agent at the contact information below. Please include the following information:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Identification of the protected work claimed to have been infringed</li>
            <li>Identification of the material that is claimed to be infringing and information sufficient to permit us to locate the material</li>
            <li>Your contact information, including your address, telephone number, and an email address</li>
            <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the owner, its agent, or the law</li>
            <li>A statement that the information in the notification is accurate</li>
            <li>A statement, under penalty of perjury, that you are authorized to act on behalf of the owner of the right that is allegedly infringed</li>
          </ul>
        </div>

        <div id="contact" className="terms-section">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. CONTACT INFORMATION</h2>
          <p className="mb-2">
            For copyright or trademark issues, please contact us at:
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="mb-1">
              <span className="font-semibold">Email:</span> ip@webmatcha.com
            </p>
            <p className="mb-1">
              <span className="font-semibold">DMCA Agent:</span> Legal Department, Web Matcha
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
