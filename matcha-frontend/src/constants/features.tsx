// src/constants/features.tsx
import React from 'react';
import { Heart, MessageCircle, MapPin, Star, Filter, Sparkles } from 'lucide-react';
import { type Feature } from '@/types/feature';

export const APP_FEATURES: Feature[] = [
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
