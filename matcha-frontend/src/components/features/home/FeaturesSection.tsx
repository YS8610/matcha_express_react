import React from 'react';
import { type Feature } from '@/types/feature';
import { APP_FEATURES } from '@/constants/features';

interface FeaturesSectionProps {
  features?: Feature[];
}

const FeaturesSection = ({ 
  features = APP_FEATURES 
}: FeaturesSectionProps) => {
  return (
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
  );
};

export default FeaturesSection;
