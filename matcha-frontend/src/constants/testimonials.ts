// src/constants/testimonials
import { type Testimonial } from '@/types/testimonial';

export const APP_TESTIMONIALS: Testimonial[] = [
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
