// src/app/careers/page.tsx
// Styled to match https://www.lifeattinder.com/
import React from 'react';
import { ArrowRight, Users, Code, TrendingUp, Globe, Coffee, Heart } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
  const departments = [
    { name: 'Engineering', icon: <Code size={24} />, count: 12 },
    { name: 'Product Management', icon: <TrendingUp size={24} />, count: 5 },
    { name: 'Design', icon: <Coffee size={24} />, count: 4 },
    { name: 'Marketing', icon: <Globe size={24} />, count: 7 },
    { name: 'Human Resources', icon: <Users size={24} />, count: 3 },
    { name: 'Customer Success', icon: <Heart size={24} />, count: 8 }
  ];

  const openPositions = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'New York, NY (Remote Option)',
      type: 'Full-time'
    },
    {
      id: 2,
      title: 'UX/UI Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'Full-time'
    },
    {
      id: 3,
      title: 'Growth Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      id: 4,
      title: 'Product Manager',
      department: 'Product Management',
      location: 'New York, NY',
      type: 'Full-time'
    },
    {
      id: 5,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA (Remote Option)',
      type: 'Full-time'
    },
    {
      id: 6,
      title: 'Customer Support Specialist',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time'
    },
    {
      id: 7,
      title: 'iOS Developer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time'
    },
    {
      id: 8,
      title: 'Android Developer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-600"></div>
        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Help us connect people and create meaningful relationships around the world.
          </p>
          <a 
            href="#open-positions" 
            className="inline-block bg-white text-green-600 font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transition duration-300"
          >
            View Open Positions
          </a>
        </div>
      </section>

      {/* About Our Company */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600">
              At Web Matcha, we believe everyone deserves to find their perfect match. We&apos;re building 
              technology that helps people connect based on shared interests, values, and compatibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Work With Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Competitive salary and equity packages</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Comprehensive health, dental, and vision benefits</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Flexible work arrangements and unlimited PTO</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Professional development budget</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Mental health and wellness programs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Remote-friendly culture with collaborative team events</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                    <Heart size={16} />
                  </span>
                  <div>
                    <h4 className="font-bold">Meaningful Connections</h4>
                    <p className="text-gray-600">We prioritize quality over quantity in relationships.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                    <Users size={16} />
                  </span>
                  <div>
                    <h4 className="font-bold">Inclusivity</h4>
                    <p className="text-gray-600">We create a platform where everyone feels welcome.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                    <TrendingUp size={16} />
                  </span>
                  <div>
                    <h4 className="font-bold">Continuous Improvement</h4>
                    <p className="text-gray-600">We&apos;re always learning and evolving our products.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-green-100 text-green-600 p-1 rounded-full mr-3">
                    <Globe size={16} />
                  </span>
                  <div>
                    <h4 className="font-bold">Global Impact</h4>
                    <p className="text-gray-600">We aim to connect people across cultures and borders.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Teams</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {departments.map((dept, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full text-white mr-4">
                    {dept.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{dept.name}</h3>
                    <p className="text-green-600">{dept.count} open positions</p>
                  </div>
                </div>
                <Link 
                  href={`#${dept.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-green-600 font-medium flex items-center mt-2 hover:text-green-700"
                >
                  View positions <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="open-positions" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Open Positions</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Join our team of passionate individuals building the future of online relationships.
          </p>

          <div className="max-w-4xl mx-auto">
            {openPositions.map((job) => (
              <div 
                key={job.id} 
                className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600">
                      <span className="mr-4">{job.department}</span>
                      <span className="mr-4">{job.location}</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <Link 
                    href={`/careers/${job.id}`}
                    className="mt-4 md:mt-0 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-full inline-flex items-center transition-colors"
                  >
                    Apply Now <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Life at Web Matcha</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <p className="text-lg mb-6">
                  &quot;Working at Web Matcha has been the most rewarding experience of my career. I&apos;ve grown professionally while building products that genuinely help people find meaningful connections.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm opacity-80">Senior Product Designer, 3 years</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl">
                <p className="text-lg mb-6">
                  &quot;The culture at Web Matcha encourages innovation and allows us to experiment with new ideas. We&apos;re constantly challenging ourselves to create better user experiences.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-bold">David Chen</h4>
                    <p className="text-sm opacity-80">Engineering Manager, 2 years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Don&apos;t See a Perfect Match?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            We&apos;re always looking for talented individuals to join our team. Send us your resume and we&apos;ll keep you in mind for future opportunities.
          </p>
          <a 
            href="mailto:careers@webmatcha.com" 
            className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transition duration-300"
          >
            Contact Our Recruiting Team
          </a>
        </div>
      </section>
    </div>
  );
}
