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
  birthDate: string;
  biography?: string;
  gender?: number;
  sexualPreference?: number;
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

export interface ProfilePutJson {
  firstName: string;
  lastName: string;
  email: string;
  gender: number;
  sexualPreference: number;
  biography: string;
  birthDate: string;
}

export interface IntTypeNeo4j {
  low: number;
  high: number;
}

export interface DateTypeNeo4j {
  year: IntTypeNeo4j;
  month: IntTypeNeo4j;
  day: IntTypeNeo4j;
}

export interface ProfileGetJson {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: DateTypeNeo4j;
  biography: string;
  gender: number;
  sexualPreference: number;
  fameRating: number;
  photo0: string;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
}

export interface Reslocal{
  authenticated:boolean;
  username:string;
  id:string;
  activated:boolean;
}
