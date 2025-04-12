import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    setCurrentIndex(0);
  }, [testimonials]);

  useEffect(() => {
    if (testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [testimonials, autoPlayInterval]);

  return (
    <section className="testimonials-section section">
      <div className="section-header text-center">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">
          Real people, real connections, real relationships.
        </p>
      </div>

      {testimonials.length > 0 && (
        <div className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`testimonial-item ${index === currentIndex ? 'active' : ''}`}
            >
              <div className="testimonial-content">
                <div className="quote-mark">&ldquo;</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-author">
                  <div className="author-image-container relative w-[60px] h-[60px]">
                    <Image
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                      fill
                      sizes="60px"
                      className="author-image object-cover rounded-full"
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
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default TestimonialsSection;
