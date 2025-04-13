// src/app/press/page.tsx
// https://www.tinderpressroom.com/
import React from 'react';
import { Download, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export default function PressPage() {
  const pressReleases = [
    {
      id: 1,
      title: "Web Matcha Surpasses 10 Million Active Users Worldwide",
      date: "April 1, 2025",
      excerpt: "The dating platform celebrates a major milestone as global user base continues to grow rapidly.",
      category: "Company News"
    },
    {
      id: 2,
      title: "Web Matcha Launches New Premium Tier With Enhanced Matching Features",
      date: "March 15, 2025",
      excerpt: "New subscription plan offers advanced algorithms and exclusive features to increase match quality.",
      category: "Product Update"
    },
    {
      id: 3,
      title: "Web Matcha Expands to 10 New Countries in Southeast Asia",
      date: "February 28, 2025",
      excerpt: "The dating app continues global expansion with localized features for new markets.",
      category: "Expansion"
    },
    {
      id: 4,
      title: "Web Matcha Named One of 'Best Dating Apps of 2025' by Tech Review",
      date: "February 12, 2025",
      excerpt: "Industry recognition highlights platform's innovative approach to online dating.",
      category: "Award"
    },
    {
      id: 5,
      title: "Web Matcha Partnerships Program Connects Local Businesses for Date Night Offers",
      date: "January 30, 2025",
      excerpt: "New business initiative creates opportunities for restaurants and entertainment venues.",
      category: "Partnerships"
    },
  ];

  const mediaCoverage = [
    {
      id: 1,
      title: "How Web Matcha is Changing the Online Dating Landscape",
      publication: "TechCrunch",
      date: "March 23, 2025",
      excerpt: "An in-depth look at how Web Matcha's algorithm is creating more meaningful connections.",
      link: "https://techcrunch.com"
    },
    {
      id: 2,
      title: "The Success Story Behind Web Matcha's Rapid Growth",
      publication: "Forbes",
      date: "March 10, 2025",
      excerpt: "Inside the dating app that's become a unicorn in just three years.",
      link: "https://forbes.com"
    },
    {
      id: 3,
      title: "Web Matcha CEO Talks Future of Dating Technology",
      publication: "The Verge",
      date: "February 20, 2025",
      excerpt: "An exclusive interview about AI-powered matching and the future of relationships.",
      link: "https://theverge.com"
    },
    {
      id: 4,
      title: "Study Shows Web Matcha Creates More Lasting Relationships",
      publication: "Relationship Today",
      date: "February 8, 2025",
      excerpt: "Research indicates the platform's unique algorithm leads to more compatible partnerships.",
      link: "https://relationshiptoday.com"
    },
  ];

  // Media kit downloads
  const mediaKitFiles = [
    { name: "Web Matcha Logo Pack", format: "ZIP", size: "12.4 MB" },
    { name: "Brand Guidelines", format: "PDF", size: "3.8 MB" },
    { name: "Product Screenshots", format: "ZIP", size: "28.6 MB" },
    { name: "Executive Team Photos", format: "ZIP", size: "16.2 MB" },
    { name: "Company Fact Sheet", format: "PDF", size: "1.2 MB" },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Press & Media</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get the latest news, press releases, and media resources for Web Matcha.
          </p>
        </div>
      </section>

      {/* Press Contacts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Press Contact</h2>
            
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <p className="text-xl mb-6">
                For press inquiries, please contact our media relations team:
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-8">
                <div className="flex items-center">
                  <Mail className="text-green-500 mr-3" size={24} />
                  <a href="mailto:press@webmatcha.com" className="text-lg text-green-600 hover:underline">
                    press@webmatcha.com
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Globe className="text-green-500 mr-3" size={24} />
                  <a href="tel:+12125551234" className="text-lg text-green-600 hover:underline">
                    +1 (212) 555-1234
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Press Releases</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            The latest announcements and news from Web Matcha
          </p>

          <div className="max-w-5xl mx-auto">
            {pressReleases.map((pressRelease) => (
              <div 
                key={pressRelease.id} 
                className="border-b border-gray-200 py-8 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="md:w-1/4">
                    <div className="text-gray-500">{pressRelease.date}</div>
                    <div className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {pressRelease.category}
                    </div>
                  </div>
                  
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      <Link href={`/press/${pressRelease.id}`} className="hover:text-green-600 transition-colors">
                        {pressRelease.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">{pressRelease.excerpt}</p>
                    <Link 
                      href={`/press/${pressRelease.id}`}
                      className="text-green-600 font-medium hover:text-green-700 transition-colors"
                    >
                      Read More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="mt-8 text-center">
              <Link 
                href="/press/archive" 
                className="inline-block px-6 py-3 border border-green-600 text-green-600 rounded-full font-medium hover:bg-green-50 transition-colors"
              >
                View All Press Releases
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Media Coverage</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Web Matcha in the news
          </p>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {mediaCoverage.map((article) => (
              <div 
                key={article.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-green-600">{article.publication}</span>
                    <span className="text-gray-500 text-sm">{article.date}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h3>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  
                  <a 
                    href={article.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 font-medium hover:text-green-700 transition-colors"
                  >
                    Read Article →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Media Kit</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Download official Web Matcha assets for media use
          </p>

          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Assets for Download</h3>
                <p className="text-gray-600">
                  Please review our <Link href="/brand-guidelines" className="text-green-600 hover:underline">brand guidelines</Link> when using these assets.
                </p>
              </div>
              
              <ul className="divide-y divide-gray-200">
                {mediaKitFiles.map((file, index) => (
                  <li key={index} className="py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="bg-gray-100 rounded-lg p-2 mr-4">
                        <Download size={20} className="text-gray-500" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{file.name}</h4>
                        <div className="text-sm text-gray-500">{file.format} • {file.size}</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                      Download
                    </button>
                  </li>
                ))}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                <button className="px-6 py-3 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
                  Download Complete Media Kit (62.2 MB)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Upcoming Events</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Meet Web Matcha representatives at these upcoming events
          </p>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center mb-8 pb-8 border-b border-gray-200">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-600">18-20</div>
                    <div className="text-lg font-medium">May 2025</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">TechConnect Conference</h3>
                    <p className="text-gray-600 mb-2">San Francisco, CA</p>
                    <p className="text-gray-600">
                      Our CEO will be speaking about &quot;The Future of AI in Dating Apps&quot; on May 19th at 2:00 PM.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center mb-8 pb-8 border-b border-gray-200">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-600">8-10</div>
                    <div className="text-lg font-medium">June 2025</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Global Dating Insights Summit</h3>
                    <p className="text-gray-600 mb-2">London, UK</p>
                    <p className="text-gray-600">
                      Join our product team for a panel discussion on &quot;Innovation in Match Quality&quot; on June 9th.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="md:w-1/4 mb-4 md:mb-0 flex flex-col items-center">
                    <div className="text-3xl font-bold text-green-600">22-24</div>
                    <div className="text-lg font-medium">July 2025</div>
                  </div>
                  <div className="md:w-3/4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">App Growth Summit</h3>
                    <p className="text-gray-600 mb-2">New York, NY</p>
                    <p className="text-gray-600">
                      Our CMO will present &quot;Building a Global Dating Brand&quot; on July 23rd at 11:30 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Media Interview Requests</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Looking to interview our executives or feature Web Matcha in a story?
          </p>
          <a 
            href="mailto:press@webmatcha.com" 
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transition duration-300"
          >
            Contact Our Press Team
          </a>
        </div>
      </section>
    </div>
  );
}
