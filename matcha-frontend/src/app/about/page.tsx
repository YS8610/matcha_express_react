// src/app/about/page.tsx
// Styled after https://tinder.com/about/ but in green instead.
import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero-section">
        <h1>About Web Matcha</h1>
        <p className="lead">Start something epic.</p>
      </section>
      
      <section className="about-content">
        <div className="about-section">
          <h2>It all starts with a match</h2>
          <p>
            Web Matcha is how people meet. With millions of users worldwide,
            we&apos;ve become one of the leading platforms for making new connections with people
            who share your interests and passions.
          </p>
        </div>
        
        <div className="about-section stats">
          <div className="stat-item">
            <h3>20B+</h3>
            <p>Matches Made</p>
          </div>
          <div className="stat-item">
            <h3>190+</h3>
            <p>Countries</p>
          </div>
          <div className="stat-item">
            <h3>40+</h3>
            <p>Languages</p>
          </div>
        </div>
        
        <div className="about-section">
          <h2>How Web Matcha Works</h2>
          <p>
            Swipe Right™ on a profile to Like someone, Swipe Left™ to pass.
            If someone likes you back, it&apos;s a Match! We use your interests, preferences,
            and activity to match you with people who align with what you&apos;re looking for.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Safety First</h2>
          <p>
            We&apos;re dedicated to making Web Matcha a safe and welcoming experience for everyone.
            Our Community Guidelines and safety features help ensure respectful interactions.
          </p>
        </div>
        
        <div className="about-section">
          <h2>Get Started</h2>
          <p>
            Download the app, create a profile, and start matching today.
            Your next meaningful connection could be just a swipe away.
          </p>
        </div>
      </section>
    </div>
  );
}
