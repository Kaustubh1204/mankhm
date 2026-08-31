export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  organization: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  adapterMode: 'BACKEND_CONNECTED' | 'DEV_ADAPTER';
}

export interface SignUpData {
  name: string;
  email: string;
  organization: string;
  password: string;
  role: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  adapterMode?: 'BACKEND_CONNECTED' | 'DEV_ADAPTER';
}
