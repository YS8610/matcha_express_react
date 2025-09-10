export interface ProfileJson {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  pw: string;
  pw2: string;
  biography?: string;
  gender?: string;
  sexualPreference?: string;
  age?: number;
};

export interface ProfileDb {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  pw: string;
  pw2: string;
  biography?: string;
  gender?: string;
  sexualPreference?: string;
  age?: number;
  fameRating?: number;
  createdAt: string;
  updatedAt: string;
};