interface Profile {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  pw: string;
}

export interface ProfileRegJson extends Profile {
  pw2: string;
  birthDate: string;
  biography?: string;
  gender?: string;
  sexualPreference?: string;
};

export interface ProfileDb extends Profile{
  id:string;
  birthDate: Date;
  biography?: string;
  gender?: string;
  sexualPreference?: string;
  fameRating?: number;
  photo0?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface ProfileUpdateJson {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  sexualPreference: string;
  biography: string;
  birthdate: Date;
}

export interface Reslocal{
  authenticated:boolean;
  username:string;
  id:string;
  activated:boolean;
}
