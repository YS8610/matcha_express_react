export interface token{
  id: string;
  email: string;
  username: string;
}

export interface AuthToken extends token{
  activated: boolean;
}
