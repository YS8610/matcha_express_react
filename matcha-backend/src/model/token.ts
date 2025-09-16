export interface token{
  userId: string;
  email: string;
  username: string;
}

export interface AuthToken extends token{
  activated: boolean;
}
