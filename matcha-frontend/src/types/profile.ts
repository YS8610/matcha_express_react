// src/types/profile.ts
export interface Profile {
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
