import React from 'react';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="hero-section">
        <h1>About Web Matcha</h1>
        <p className="lead">Connecting people with shared interests since 2023</p>
      </section>

      <section className="about-content">
        <div className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Web Matcha, we believe that meaningful connections are built on shared interests, 
            values, and compatibility. Our mission is to create a platform where individuals can 
            find their perfect match in a safe, engaging, and authentic environment.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Web Matcha was founded by a group of tech enthusiasts who were frustrated with the 
            superficial nature of existing dating platforms. We set out to create something different—a 
            platform that prioritizes genuine connections over quick swipes.
          </p>
          <p>
            Our name &quot;Matcha&quot; represents the perfect blend of compatibility, much like the 
            carefully cultivated tea leaves that create a harmonious flavor when prepared correctly.
          </p>
        </div>

        <div className="about-section">
          <h2>How It Works</h2>
          <p>
            Unlike other platforms, Web Matcha uses an advanced matching algorithm that considers 
            your interests, values, location, and preferences to suggest compatible matches. Our 
            system learns from your interactions to continuously improve your matching experience.
          </p>
        </div>

        <div className="about-section">
          <h2>Our Values</h2>
          <ul>
            <li><strong>Authenticity:</strong> We encourage users to be their true selves.</li>
            <li><strong>Safety:</strong> We prioritize user safety with robust verification and reporting systems.</li>
            <li><strong>Inclusivity:</strong> We welcome people of all backgrounds and orientations.</li>
            <li><strong>Quality:</strong> We focus on meaningful connections rather than quantity.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
