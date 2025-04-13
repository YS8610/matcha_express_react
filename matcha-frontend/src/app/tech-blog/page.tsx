// src/app/tech-blog/page.tsx
// A tech blog page https://www.lifeattinder.com/blog
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Calendar, User, Search } from 'lucide-react';

export default function TechBlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: 'Scaling Our Matching Algorithm to Handle Millions of Users',
      excerpt: 'How we optimized our infrastructure to process matches in real-time across our growing user base.',
      author: 'David Chen',
      date: 'April 5, 2025',
      tags: ['Infrastructure', 'Algorithms', 'Scaling'],
      category: 'Engineering',
      imageUrl: '/images/blog/matching-algorithm.png',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Building a Responsive UI with Next.js and Tailwind CSS',
      excerpt: 'Learn how we redesigned our user interface for better performance and accessibility across all devices.',
      author: 'Emily Rodriguez',
      date: 'March 28, 2025',
      tags: ['Frontend', 'Next.js', 'Tailwind', 'Design'],
      category: 'Design',
      imageUrl: '/images/blog/responsive-ui.png',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'How We Use Machine Learning to Improve Match Quality',
      excerpt: 'Our data science team explains how we analyze user interactions to create better matches over time.',
      author: 'Michael Zhang',
      date: 'March 15, 2025',
      tags: ['Machine Learning', 'Data Science', 'Recommendations'],
      category: 'Data Science',
      imageUrl: '/images/blog/machine-learning.png',
      readTime: '10 min read'
    },
    {
      id: 4,
      title: 'Implementing Real-time Chat with WebSockets',
      excerpt: 'A technical deep dive into our messaging system architecture and how we handle millions of conversations daily.',
      author: 'Sophia Johnson',
      date: 'March 3, 2025',
      tags: ['Real-time', 'WebSockets', 'Backend'],
      category: 'Engineering',
      imageUrl: '/images/blog/real-time-chat.png',
      readTime: '7 min read'
    },
    {
      id: 5,
      title: 'Our Journey to a Microservices Architecture',
      excerpt: 'Why we moved from a monolith to microservices and the lessons we learned along the way.',
      author: 'James Wilson',
      date: 'February 22, 2025',
      tags: ['Microservices', 'Architecture', 'DevOps'],
      category: 'Engineering',
      imageUrl: '/images/blog/microservices.png',
      readTime: '9 min read'
    },
    {
      id: 6,
      title: 'Designing for Trust: UI Patterns That Build User Confidence',
      excerpt: 'How our design team creates interfaces that help users feel secure and comfortable while dating online.',
      author: 'Olivia Martinez',
      date: 'February 10, 2025',
      tags: ['UX Design', 'Trust', 'User Research'],
      category: 'Design',
      imageUrl: '/images/blog/trust-patterns.png',
      readTime: '5 min read'
    }
  ];

  const categories = [
    { name: 'All', count: blogPosts.length },
    { name: 'Engineering', count: blogPosts.filter(post => post.category === 'Engineering').length },
    { name: 'Design', count: blogPosts.filter(post => post.category === 'Design').length },
    { name: 'Data Science', count: blogPosts.filter(post => post.category === 'Data Science').length },
    { name: 'Product', count: blogPosts.filter(post => post.category === 'Product').length },
    { name: 'Culture', count: blogPosts.filter(post => post.category === 'Culture').length },
  ];

  // Get all unique tags from blog posts
  const allTags = [...new Set(blogPosts.flatMap(post => post.tags))];

  // Filter posts based on search term
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-gradient-to-b from-green-50 to-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Web Matcha Tech Blog</h1>
            <p className="text-xl mb-8">
              Insights from our engineering, design, and data science teams on how we&apos;re building 
              the future of online relationships.
            </p>
            <div className="max-w-xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row">
          {/* Main Content */}
          <div className="lg:w-3/4 lg:pr-8">
            {searchTerm && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Search Results for &quot;{searchTerm}&quot;
                </h2>
                <p className="text-gray-600">
                  Found {filteredPosts.length} {filteredPosts.length === 1 ? 'result' : 'results'}
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} className="mr-1" />
                      <span className="mr-4">{post.date}</span>
                      <User size={14} className="mr-1" />
                      <span>{post.author}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      <Link href={`/tech-blog/${post.id}`} className="hover:text-green-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <span 
                            key={index} 
                            className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {post.tags.length > 2 && (
                          <span className="text-gray-500 text-xs">+{post.tags.length - 2} more</span>
                        )}
                      </div>
                      <span className="text-gray-500 text-sm">{post.readTime}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - just for UI purposes */}
            <div className="mt-12 flex justify-center">
              <div className="inline-flex rounded-md shadow-sm">
                <button className="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-green-600 text-sm font-medium text-white">
                  1
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button className="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4 mt-12 lg:mt-0">
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button 
                      onClick={() => setSearchTerm(category.name === 'All' ? '' : category.name)}
                      className={`flex items-center justify-between w-full px-2 py-2 rounded-lg transition-colors ${
                        category.name === 'All' && searchTerm === '' || 
                        category.name !== 'All' && searchTerm === category.name 
                          ? 'bg-green-100 text-green-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(tag)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      searchTerm === tag 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Get the latest engineering insights and updates directly to your inbox.
              </p>
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 mb-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Engineering Team</h2>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Interested in working on these challenges? We&apos;re always looking for talented engineers, 
            designers, and data scientists.
          </p>
          <Link 
            href="/careers" 
            className="inline-flex items-center bg-white text-green-600 font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transition duration-300"
          >
            View Open Positions <ChevronRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
