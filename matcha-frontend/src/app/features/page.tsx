import React from 'react';
import { APP_FEATURES } from '@/constants/features';

export default function FeaturesPage() {
  return (
    <div className="features-page">
      <section className="hero-section">
        <h1>Our Features</h1>
        <p className="lead">Discover what makes Web Matcha different</p>
      </section>

      <section className="features-detail-section">
        {APP_FEATURES.map((feature, index) => (
          <div key={index} className="feature-detail-card">
            <div className="feature-icon-large">
              {feature.icon}
            </div>
            <div className="feature-content">
              <h2 className="feature-title">{feature.title}</h2>
              <p className="feature-description">{feature.description}</p>
              
              <div className="feature-expanded-info">
                {feature.title === "Smart Matching" && (
                  <div>
                    <h3>How our matching works:</h3>
                    <p>Our proprietary algorithm analyzes over 100 different data points from your profile, behavior, and preferences to find compatible matches. The more you interact with the platform, the smarter our matching becomes.</p>
                    <ul className="feature-benefits">
                      <li>Personality-based compatibility scoring</li>
                      <li>Interest alignment analysis</li>
                      <li>Location-based recommendations</li>
                      <li>Behavioral pattern recognition</li>
                    </ul>
                  </div>
                )}

                {feature.title === "Real-time Chat" && (
                  <div>
                    <h3>Communication tools:</h3>
                    <p>Our chat system includes features designed to make conversations flow naturally and keep you connected.</p>
                    <ul className="feature-benefits">
                      <li>Instant message delivery</li>
                      <li>Read receipts</li>
                      <li>Photo sharing capabilities</li>
                      <li>Emoji and GIF support</li>
                      <li>Voice note options</li>
                    </ul>
                  </div>
                )}

                {feature.title === "Proximity Dating" && (
                  <div>
                    <h3>Location features:</h3>
                    <p>Find potential matches within your preferred distance radius. Perfect for those who value the convenience of meeting locally.</p>
                    <ul className="feature-benefits">
                      <li>Customizable distance filters</li>
                      <li>Local event suggestions</li>
                      <li>Neighborhood matching</li>
                      <li>Travel mode for when you&apos;re visiting new places</li>
                    </ul>
                  </div>
                )}

                {feature.title === "Fame Rating" && (
                  <div>
                    <h3>Boost your visibility:</h3>
                    <p>Your fame rating reflects your profile quality and activity level. Higher ratings mean more visibility and better matches.</p>
                    <ul className="feature-benefits">
                      <li>Profile completeness bonuses</li>
                      <li>Engagement rewards</li>
                      <li>Verification boosts</li>
                      <li>Detailed analytics on your profile performance</li>
                    </ul>
                  </div>
                )}

                {feature.title === "Advanced Filters" && (
                  <div>
                    <h3>Fine-tune your search:</h3>
                    <p>Our detailed filtering system allows you to be as specific as you want in your search for the perfect match.</p>
                    <ul className="feature-benefits">
                      <li>Age and location preferences</li>
                      <li>Interest and hobby matching</li>
                      <li>Lifestyle compatibility filters</li>
                      <li>Relationship goal alignment</li>
                      <li>Education and career filters</li>
                    </ul>
                  </div>
                )}

                {feature.title === "Interest Tags" && (
                  <div>
                    <h3>Connect through common interests:</h3>
                    <p>Our tagging system helps you find people who share your specific passions and hobbies.</p>
                    <ul className="feature-benefits">
                      <li>Thousands of interest categories</li>
                      <li>Tag-based searching</li>
                      <li>Trending interest suggestions</li>
                      <li>Interest intensity matching</li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="premium-features">
        <h2>Premium Features</h2>
        <p>Unlock even more possibilities with our premium membership:</p>
        
        <div className="premium-features-grid">
          <div className="premium-feature-card">
            <h3>See Who Likes You</h3>
            <p>Get instant visibility on everyone who has shown interest in your profile.</p>
          </div>
          
          <div className="premium-feature-card">
            <h3>Priority Matching</h3>
            <p>Get seen by more users and appear at the top of search results.</p>
          </div>
          
          <div className="premium-feature-card">
            <h3>Advanced Analytics</h3>
            <p>Gain insights about your profile performance and visitor statistics.</p>
          </div>
          
          <div className="premium-feature-card">
            <h3>Unlimited Connections</h3>
            <p>Connect with as many profiles as you want without daily limits.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
