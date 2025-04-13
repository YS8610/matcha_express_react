// src/app/privacy/page.tsx
// Styled after https://policies.tinder.com/privacy/intl/en/
import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="privacy-policy-container max-w-4xl mx-auto px-4 py-8">
      <header className="policy-header text-center mb-12">
        <h1 className="text-3xl font-bold text-primary mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Effective Date: April 12, 2025</p>
      </header>

      <section className="policy-welcome mb-10">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Web Matcha's Privacy Policy</h2>
        <p className="mb-4">
          We know that you care about how your personal information is used and shared, and we take your
          privacy seriously. Please read the following to learn more about our Privacy Policy.
        </p>
        <p className="mb-4">
          By using or accessing the Services in any manner, you acknowledge that you accept the practices and
          policies outlined in this Privacy Policy, and you hereby consent that we will collect, use, and share
          your information in the following ways.
        </p>
        <p className="italic text-sm mb-4">
          Remember that your use of Web Matcha's Services is at all times subject to our <a href="/terms" className="text-primary underline">Terms of Use</a>,
          which incorporates this Privacy Policy.
        </p>
      </section>

      <section className="policy-toc mb-10 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">WHAT'S IN THIS POLICY?</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li><a href="#information" className="text-primary">Information We Collect</a></li>
          <li><a href="#use" className="text-primary">How We Use Your Information</a></li>
          <li><a href="#sharing" className="text-primary">Information Sharing and Disclosure</a></li>
          <li><a href="#choices" className="text-primary">Your Rights and Choices</a></li>
          <li><a href="#third-parties" className="text-primary">Third-Party Services</a></li>
          <li><a href="#retention" className="text-primary">Data Retention</a></li>
          <li><a href="#children" className="text-primary">Children's Privacy</a></li>
          <li><a href="#security" className="text-primary">Privacy and Security</a></li>
          <li><a href="#international" className="text-primary">International Users</a></li>
          <li><a href="#changes" className="text-primary">Changes to This Policy</a></li>
          <li><a href="#contact" className="text-primary">How To Contact Us</a></li>
        </ol>
      </section>

      <div className="policy-content space-y-12">
        <section id="information" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">1. Information We Collect</h2>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">Information you provide us directly:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Profile Information.</strong> When you create an account, you provide us with basic information like your name, email address, phone number, date of birth, gender, sexual orientation, photos, and interests.
              </li>
              <li>
                <strong>Content.</strong> When using our Services, you may choose to provide additional information in your profile such as your biography, your location or hometown, employment information, education history, and more.
              </li>
              <li>
                <strong>Purchases.</strong> If you choose to purchase a premium service or make in-app purchases, we collect information about those purchases.
              </li>
              <li>
                <strong>Communications.</strong> When you communicate with other users or with us, we collect information about your communications.
              </li>
            </ul>
          </div>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">Information we receive when you use our Services:</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Usage Information.</strong> We collect information about your activity on our services, such as date and time you logged in, features you've been using, searches, clicks and pages viewed, and your interactions with other users.
              </li>
              <li>
                <strong>Device Information.</strong> We collect information from and about the device(s) you use to access our Services, including hardware and software information, device identifiers, and mobile network information.
              </li>
              <li>
                <strong>Location Data.</strong> When you use our Services, we may collect information about your precise or approximate location as determined through data such as GPS, IP address and WiFi.
              </li>
            </ul>
          </div>
        </section>

        <section id="use" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">2. How We Use Your Information</h2>
          <p className="mb-4">
            The main reason we use your information is to deliver and improve our Services. Additionally, we use your information to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Create matches with other users according to your preferences</li>
            <li>Show you profiles of other users and help them discover yours</li>
            <li>Improve, test, and monitor the effectiveness of our Services</li>
            <li>Develop and test new features and services</li>
            <li>Monitor metrics such as total number of visitors, traffic, and demographic patterns</li>
            <li>Diagnose or fix technology problems</li>
            <li>Communicate with you, including sending notifications, updates, and support messages</li>
            <li>Prevent, detect and fight fraud or other illegal or unauthorized activities</li>
            <li>Ensure legal compliance, such as complying with court orders and valid subpoenas</li>
          </ul>
        </section>

        <section id="sharing" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">3. Information Sharing and Disclosure</h2>
          <p className="mb-4">
            Since our goal is to help you make meaningful connections, the main sharing of user information is with other users. We also share some users' information with service providers and partners who assist us in operating the Services, and in some cases, legal authorities.
          </p>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">With other users:</h3>
            <p className="mb-2">
              You share information with other users when you voluntarily disclose information on the Service (including your public profile). Please be careful with your information and make sure that the content you share is stuff that you're comfortable being publicly viewable.
            </p>
          </div>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">With our service providers and partners:</h3>
            <p className="mb-2">
              We use third parties to help us operate and improve our Services. These third parties assist us with various tasks, including data hosting and maintenance, analytics, customer care, marketing, advertising, payment processing and security operations.
            </p>
          </div>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">For corporate transactions:</h3>
            <p className="mb-2">
              We may transfer your information if we are involved, whether in whole or in part, in a merger, sale, acquisition, divestiture, restructuring, reorganization, dissolution, bankruptcy or other change of ownership or control.
            </p>
          </div>
          
          <div className="subsection mb-6">
            <h3 className="font-semibold mb-2">When required by law:</h3>
            <p className="mb-2">
              We may disclose your information if reasonably necessary: (i) to comply with a legal process, such as a court order, subpoena or search warrant, government/law enforcement investigation or other legal requirements; (ii) to assist in the prevention or detection of crime; or (iii) to protect the safety of any person.
            </p>
          </div>
        </section>

        <section id="choices" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">4. Your Rights and Choices</h2>
          <p className="mb-4">
            We want you to be in control of your information, so we provide you with the following tools:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Access/Update tools in the service.</strong> Tools and account settings that help you to access, rectify or delete information that you provided to us and that's associated with your account.
            </li>
            <li>
              <strong>Device permissions.</strong> Mobile platforms have permission systems for specific types of device data and notifications, such as phone contacts, pictures, location services, push notifications and advertising identifiers. You can change your settings on your device to either consent or oppose the collection of the corresponding information or the display of the corresponding notifications.
            </li>
            <li>
              <strong>Deletion.</strong> You can delete your account by using the corresponding functionality directly on the service.
            </li>
          </ul>
          
          <div className="subsection mt-6">
            <h3 className="font-semibold mb-2">Rights you may have:</h3>
            <p className="mb-2">
              Depending on your location, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The right to request access to and obtain a copy of your personal data</li>
              <li>The right to request rectification or erasure of your personal data</li>
              <li>The right to restrict the processing of your personal data</li>
              <li>The right to data portability (to receive your data in a structured, commonly used format)</li>
              <li>The right to object to the processing of your personal data</li>
              <li>The right to withdraw consent</li>
              <li>The right to lodge a complaint with a supervisory authority</li>
            </ul>
          </div>
        </section>

        <section id="third-parties" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">5. Third-Party Services</h2>
          <p className="mb-4">
            Our Services may contain links to third-party websites and services. We are not responsible for the content or practices of those websites or services. The collection, use, and disclosure of your information will be subject to the privacy policies of the third-party websites or services, and not this Privacy Policy. We urge you to read the privacy and security policies of these third parties.
          </p>
        </section>

        <section id="retention" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">6. Data Retention</h2>
          <p className="mb-4">
            We keep your personal information only as long as we need it for legitimate business purposes and as permitted by applicable law. If you decide to stop using our Services, you can close your account and your profile will no longer be visible to other users. Note that we will keep some of your information after closing your account, as described in our full Privacy Policy.
          </p>
        </section>

        <section id="children" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">7. Children's Privacy</h2>
          <p className="mb-4">
            Our Services are restricted to users who are 18 years of age or older. We do not permit users under the age of 18 on our platform and we do not knowingly collect personal information from anyone under the age of 18. If you suspect that a user is under the age of 18, please use the reporting mechanism available through the Service.
          </p>
        </section>

        <section id="security" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">8. Privacy and Security</h2>
          <p className="mb-4">
            We work hard to protect you from unauthorized access to or alteration, disclosure or destruction of your personal information. As with all technology companies, although we take steps to secure your information, we do not promise, and you should not expect, that your personal information will always remain secure.
          </p>
          <p className="mb-4">
            We regularly monitor our systems for possible vulnerabilities and attacks and regularly review our information collection, storage and processing practices to update our physical, technical and organizational security measures.
          </p>
        </section>

        <section id="international" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">9. International Users</h2>
          <p className="mb-4">
            By using our Services, you understand and acknowledge that your information will be transferred from your location to our facilities and servers in the United States, and potentially to other countries where our service providers operate.
          </p>
          <p className="mb-4">
            If you live in a region with laws governing data collection and use that may differ from U.S. law, please note that we may transfer information, including personal information, to a country and jurisdiction that does not have the same data protection laws as your jurisdiction.
          </p>
        </section>

        <section id="changes" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">10. Changes to This Policy</h2>
          <p className="mb-4">
            Because we're always looking for new and innovative ways to help you build meaningful connections, this policy may change over time. We will notify you before any material changes take effect so that you have time to review the changes.
          </p>
        </section>

        <section id="contact" className="policy-section">
          <h2 className="text-2xl font-semibold mb-4 text-primary">11. How To Contact Us</h2>
          <p className="mb-6">
            If you have questions about this Privacy Policy, here's how you can reach us:
          </p>
          <div className="contact-info p-4 bg-gray-50 rounded-lg">
            <p className="mb-2"><strong>Email:</strong> privacy@webmatcha.com</p>
            <p className="mb-2"><strong>Address:</strong> 123 Match Street, New York, NY 10001</p>
            <p><strong>Online:</strong> <a href="/contact" className="text-primary underline">Contact Form</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
