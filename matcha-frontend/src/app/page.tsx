'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, MapPin, ChevronRight, Star, Filter, Sparkles } from 'lucide-react';

interface Profile {
  id: number;
  name: string;
  age: number;
  location: string;
  distance: number;
  bio: string;
  tags: string[];
  imageUrl: string;
  fameRating: number;
  online: boolean;
  lastActive: string | null;
}

const featuredProfiles: Profile[] = [
  {
    id: 1,
    name: 'Alexandra',
    age: 28,
    location: 'New York',
    distance: 5,
    bio: 'Coffee enthusiast, book lover, and hiking addict. Looking for someone to share adventures with!',
    tags: ['#travel', '#books', '#coffee', '#hiking', '#photography'],
    imageUrl: '/images/profiles/alexandra.png',
    fameRating: 4.8,
    online: true,
    lastActive: null
  },
  {
    id: 2,
    name: 'Michael',
    age: 32,
    location: 'Brooklyn',
    distance: 8,
    bio: 'Software engineer by day, musician by night. Passionate about tech, music and good food.',
    tags: ['#music', '#tech', '#foodie', '#guitar', '#coding'],
    imageUrl: '/images/profiles/michael.png',
    fameRating: 4.5,
    online: false,
    lastActive: 'Yesterday at 9:30 PM'
  },
  {
    id: 3,
    name: 'Sophia',
    age: 26,
    location: 'Queens',
    distance: 12,
    bio: 'Art curator with a passion for contemporary paintings. Love exploring galleries and trying new cuisines.',
    tags: ['#art', '#museum', '#painting', '#foodie', '#travel'],
    imageUrl: '/images/profiles/sophia.png',
    fameRating: 4.7,
    online: true,
    lastActive: null
  },
  {
    id: 4,
    name: 'James',
    age: 30,
    location: 'Manhattan',
    distance: 4,
    bio: 'Finance professional who loves sports, fitness and weekend getaways. Looking for someone who enjoys an active lifestyle.',
    tags: ['#fitness', '#sports', '#travel', '#cooking', '#running'],
    imageUrl: '/images/profiles/james.png',
    fameRating: 4.2,
    online: false,
    lastActive: 'Today at 10:15 AM'
  }
];

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  status: string;
  imageUrl: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "I never thought I'd find someone so compatible! After a month on Web Matcha, I met my partner and we've been inseparable since.",
    name: "Emily & David",
    status: "Dating for 8 months",
    imageUrl: "/images/testimonials/emilydavid.png"
  },
  {
    id: 2,
    quote: "The matching algorithm is incredible! It connected me with people who share my passions and values. I'm now engaged to someone I met here.",
    name: "Robert & Jessica",
    status: "Engaged after 1 year",
    imageUrl: "/images/testimonials/robertjessica.png"
  },
  {
    id: 3,
    quote: "As a busy professional, I appreciated how easy it was to connect with quality matches based on my preferences and location.",
    name: "Sarah",
    status: "Found her partner in 3 weeks",
    imageUrl: "/images/testimonials/sarah.png"
  }
];

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: <Heart className="feature-icon" />,
    title: "Smart Matching",
    description: "Our advanced algorithm considers location, interests, and compatibility to suggest ideal matches."
  },
  {
    icon: <MessageCircle className="feature-icon" />,
    title: "Real-time Chat",
    description: "Connect instantly with your matches through our seamless chat interface."
  },
  {
    icon: <MapPin className="feature-icon" />,
    title: "Proximity Dating",
    description: "Find potential partners nearby with our location-based matching system."
  },
  {
    icon: <Star className="feature-icon" />,
    title: "Fame Rating",
    description: "Stand out with a high fame rating based on profile completeness and interaction."
  },
  {
    icon: <Filter className="feature-icon" />,
    title: "Advanced Filters",
    description: "Fine-tune your search with detailed filters for age, location, interests, and more."
  },
  {
    icon: <Sparkles className="feature-icon" />,
    title: "Interest Tags",
    description: "Find people who share your passions with our intuitive tag system."
  }
];

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('matchaAuthToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuthStatus();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  const ProfileCard = ({ profile }: { profile: Profile }) => (
    <div className="profile-card card">
      <div className="profile-image-container" style={{ position: 'relative', width: '100%', height: '300px' }}>
        <Image 
          src={profile.imageUrl}
          alt={`${profile.name}'s profile`}
          fill
          style={{ objectFit: 'cover' }}
          className="profile-image"
        />
      </div>
      
      <div className="profile-details">
        <div className="profile-header d-flex justify-content-between align-items-center">
          <h3 className="profile-name">{profile.name}, {profile.age}</h3>
          <div className={`online-status ${profile.online ? 'online' : 'offline'}`}>
            <span className="status-indicator"></span>
            <span>{profile.online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
        
        <div className="profile-info">
          <MapPin size={16} />
          <span>{profile.location} • {profile.distance} miles away</span>
        </div>
        
        <p className="profile-bio">{profile.bio}</p>
        
        <div className="profile-tags">
          {profile.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        
        <div className="profile-footer d-flex justify-content-between align-items-center">
          <div className="fame-rating">
            <Star size={16} className="star" />
            <span>{profile.fameRating.toFixed(1)}</span>
          </div>
          
          <div className="profile-actions d-flex gap-sm">
            <Link href={`/profile/${profile.id}`} className="btn btn-outline">
              View Profile
            </Link>
            <button className="btn btn-connect">
              <Heart size={16} />
              Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Match</h1>
          <p className="hero-subtitle">
            Because love, too, can be industrialized.
          </p>
          
          {!isLoggedIn && (
            <div className="hero-cta">
              <Link href="/register" className="btn btn-primary btn-lg">
                Get Started
              </Link>
              <Link href="/about" className="btn btn-outline btn-lg">
                Learn More
              </Link>
            </div>
          )}
        </div>
      </section>

      {isLoggedIn && (
        <section className="featured-profiles-section section">
          <div className="section-header d-flex justify-content-between align-items-center">
            <h2 className="section-title">Suggested Matches</h2>
            <Link href="/browse" className="btn btn-outline d-flex align-items-center">
              See All <ChevronRight size={16} />
            </Link>
          </div>
          
          <div className="profiles-grid">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        </section>
      )}

      <section className="features-section section">
        <div className="section-header text-center">
          <h2 className="section-title">Why Choose Web Matcha</h2>
          <p className="section-subtitle">
            Our platform is designed to create meaningful connections based on compatibility, location, and shared interests.
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="testimonials-section section">
        <div className="section-header text-center">
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">
            Real people, real connections, real relationships.
          </p>
        </div>
        
        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-item ${index === currentTestimonial ? 'active' : ''}`}
            >
              <div className="testimonial-content">
                <div className="quote-mark">&ldquo;</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-image-container" style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <Image 
                      src={testimonial.imageUrl} 
                      alt={testimonial.name} 
                      fill
                      style={{ objectFit: 'cover', borderRadius: '50%' }}
                      className="author-image"
                    />
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">{testimonial.name}</h4>
                    <p className="author-status">{testimonial.status}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <div className="testimonial-dots">
            {testimonials.map((_, index) => (
              <button 
                key={index} 
                className={`dot ${index === currentTestimonial ? 'active' : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Find Your Match?</h2>
          <p className="cta-subtitle">
            Join thousands of users who have found meaningful connections on our platform.
          </p>
          
          {!isLoggedIn ? (
            <div className="cta-buttons">
              <Link href="/register" className="btn btn-primary btn-lg">
                Create an Account
              </Link>
              <Link href="/login" className="btn btn-outline btn-lg">
                Already a Member? Log In
              </Link>
            </div>
          ) : (
            <div className="cta-buttons">
              <Link href="/browse" className="btn btn-primary btn-lg">
                Browse Matches
              </Link>
              <Link href="/profile" className="btn btn-outline btn-lg">
                Update Your Profile
              </Link>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .hero-section {
          background: linear-gradient(135deg, var(--matcha-primary-dark) 0%, var(--matcha-primary) 100%);
          color: white;
          padding: var(--spacing-xxl) 0;
          text-align: center;
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-xl);
        }
        
        .hero-title {
          font-size: var(--font-xxxl);
          margin-bottom: var(--spacing-md);
          font-weight: 700;
        }
        
        .hero-subtitle {
          font-size: var(--font-lg);
          margin-bottom: var(--spacing-xl);
          opacity: 0.9;
        }
        
        .hero-cta {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }
        
        .btn-lg {
          padding: var(--spacing-md) var(--spacing-xl);
          font-size: var(--font-md);
        }
        
        .section {
          margin-bottom: var(--spacing-xxl);
        }
        
        .section-header {
          margin-bottom: var(--spacing-xl);
        }
        
        .section-title {
          font-size: var(--font-xxl);
          color: var(--matcha-text);
          margin-bottom: var(--spacing-sm);
        }
        
        .section-subtitle {
          color: var(--matcha-text-secondary);
          font-size: var(--font-md);
          max-width: 800px;
          margin: 0 auto;
        }
        
        .profiles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: var(--spacing-lg);
        }
        
        .profile-image-container {
          margin-bottom: var(--spacing-md);
          border-radius: var(--radius-md);
          overflow: hidden;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: var(--spacing-xl);
          margin-top: var(--spacing-xl);
        }
        
        .feature-card {
          background-color: var(--matcha-card-bg);
          border-radius: var(--radius-md);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-sm);
          transition: transform var(--transition-normal), box-shadow var(--transition-normal);
          text-align: center;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
        }
        
        .feature-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          border-radius: var(--radius-circle);
          background-color: var(--matcha-primary-light);
          color: white;
          margin: 0 auto var(--spacing-lg);
        }
        
        .feature-title {
          margin-bottom: var(--spacing-sm);
          font-size: var(--font-lg);
        }
        
        .feature-description {
          color: var(--matcha-text-secondary);
        }
        
        .testimonials-slider {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
          padding: var(--spacing-xl) 0;
        }
        
        .testimonial-item {
          display: none;
          animation: fadeIn var(--transition-normal);
        }
        
        .testimonial-item.active {
          display: block;
        }
        
        .testimonial-content {
          background-color: var(--matcha-card-bg);
          border-radius: var(--radius-lg);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
          position: relative;
        }
        
        .quote-mark {
          position: absolute;
          top: var(--spacing-lg);
          left: var(--spacing-lg);
          font-size: 60px;
          color: var(--matcha-primary-light);
          opacity: 0.3;
          line-height: 1;
          font-family: Georgia, serif;
        }
        
        .testimonial-quote {
          font-size: var(--font-lg);
          line-height: 1.6;
          margin-bottom: var(--spacing-lg);
          position: relative;
          padding-left: var(--spacing-md);
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .author-info {
          flex: 1;
        }
        
        .author-name {
          font-weight: 600;
          margin-bottom: var(--spacing-xs);
        }
        
        .author-status {
          color: var(--matcha-text-secondary);
          font-size: var(--font-sm);
        }
        
        .testimonial-dots {
          display: flex;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-top: var(--spacing-lg);
        }
        
        .dot {
          width: 10px;
          height: 10px;
          border-radius: var(--radius-circle);
          background-color: var(--matcha-divider);
          border: none;
          cursor: pointer;
          transition: background-color var(--transition-fast);
        }
        
        .dot.active {
          background-color: var(--matcha-primary);
          transform: scale(1.2);
        }
        
        .cta-section {
          background: linear-gradient(135deg, var(--matcha-secondary-dark) 0%, var(--matcha-secondary) 100%);
          color: white;
          padding: var(--spacing-xxl) 0;
          text-align: center;
          border-radius: var(--radius-lg);
        }
        
        .cta-title {
          font-size: var(--font-xxl);
          margin-bottom: var(--spacing-md);
        }
        
        .cta-subtitle {
          font-size: var(--font-lg);
          margin-bottom: var(--spacing-xl);
          opacity: 0.9;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .cta-buttons {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: var(--font-xxl);
          }
          
          .hero-subtitle {
            font-size: var(--font-md);
          }
          
          .hero-cta {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
          
          .profiles-grid, .features-grid {
            grid-template-columns: 1fr;
          }
          
          .cta-title {
            font-size: var(--font-xl);
          }
          
          .cta-subtitle {
            font-size: var(--font-md);
          }
          
          .cta-buttons {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
        }
      `}</style>
    </div>
  );
}
