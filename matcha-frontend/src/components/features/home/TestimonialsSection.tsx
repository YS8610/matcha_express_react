// src/components/features/home/TestimonialsSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { type Testimonial } from '@/types/testimonial';
import { APP_TESTIMONIALS } from '@/constants/testimonials';

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
  autoPlayInterval?: number;
}

const TestimonialsSection = ({
  testimonials = APP_TESTIMONIALS,
  autoPlayInterval = 8000,
}: TestimonialsSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    
    const interval = setInterval(() => {
      handleSwipe('right');
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [testimonials, autoPlayInterval]);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || !cardRef.current) return;
    
    setIsAnimating(true);
    
    cardRef.current.style.transition = 'transform 0.5s ease-out';
    cardRef.current.style.transform = direction === 'left' 
      ? 'translateX(-120%) rotate(-20deg)' 
      : 'translateX(120%) rotate(20deg)';
    
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.style.transition = 'none';
        cardRef.current.style.transform = 'translateX(0) rotate(0)';
      }
      
      setCurrentIndex((prev) => 
        direction === 'left' 
          ? (prev - 1 + testimonials.length) % testimonials.length
          : (prev + 1) % testimonials.length
      );
      
      setIsAnimating(false);
    }, 500);
  };

  return (
    <section className="bg-gradient-to-b from-pink-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-pink-600 mb-2">Success Stories</h2>
          <p className="text-gray-600">
            Swipe through our matches
          </p>
        </div>
        
        {testimonials.length > 0 && (
          <div className="relative max-w-sm mx-auto h-[600px]">
            <div 
              ref={cardRef}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 border border-gray-100"
            >
              <div className="relative w-full h-[450px]">
                <Image
                  src={testimonials[currentIndex].imageUrl}
                  alt={testimonials[currentIndex].name}
                  fill
                  sizes="100%"
                  className="object-cover"
                  priority
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-5">
                  <div className="flex items-baseline">
                    <h4 className="text-white text-3xl font-bold mr-2">
                      {testimonials[currentIndex].name}
                    </h4>
                    <span className="text-white text-xl">
                      {testimonials[currentIndex].status.match(/\d+/)?.[0] || ""}
                    </span>
                  </div>
                  <p className="text-white/80 text-lg">
                    {testimonials[currentIndex].status}
                  </p>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-gray-700 text-lg">
                  "{testimonials[currentIndex].quote}"
                </p>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-8 items-center">
              <button 
                onClick={() => handleSwipe('left')}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-red-500 text-red-500 text-3xl shadow-lg hover:bg-red-50 transition-all"
                disabled={isAnimating}
                aria-label="Nope"
              >
                ✕
              </button>
              
              <button 
                onClick={() => handleSwipe('right')}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-red-500 text-white text-3xl shadow-lg hover:from-pink-600 hover:to-red-600 transition-all"
                disabled={isAnimating}
                aria-label="Like"
              >
                ♥
              </button>
            </div>
            
            <div className="absolute top-4 left-4 right-4 flex space-x-1">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full flex-1 transition-all duration-300 ${
                    index === currentIndex ? 'bg-pink-500' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
