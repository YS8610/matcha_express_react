export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  profileImageUrl: string | null;
}
