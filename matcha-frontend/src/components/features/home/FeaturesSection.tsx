// src/components/features/FeaturesSection.tsx
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
    <section className="py-16 bg-gradient-to-r from-green-500 to-lime-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-3">Discover the Magic</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Swipe, match, and connect with people who share your interests and passions.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex flex-col md:flex-row items-center mb-16 ${
                index % 2 === 0 ? '' : 'md:flex-row-reverse'
              }`}
            >
              <div className="w-full md:w-1/2 mb-6 md:mb-0">
                <div className="bg-white rounded-2xl shadow-xl p-8 mx-auto max-w-xs aspect-square flex items-center justify-center">
                  <div className="text-6xl text-gradient-primary">
                    {feature.icon}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 md:px-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/90 text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="bg-white text-green-500 font-bold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
            Start Matching Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
