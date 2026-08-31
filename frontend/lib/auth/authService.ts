import { User, SignUpData, SignInData, AuthResponse } from './authTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Local Development Storage Keys
const USERS_STORAGE_KEY = 'cyclonesense_users_db';
const SESSION_STORAGE_KEY = 'cyclonesense_auth_session';
const TOKEN_STORAGE_KEY = 'cyclonesense_auth_token';

// Default Fixed Admin Credential for Dev Adapter
const DEFAULT_ADMIN_USER: User & { passwordHash: string } = {
  id: 'admin_fixed_master',
  name: 'System Administrator',
  email: 'admin@cyclonesense.ai',
  organization: 'CycloneSense Ops Command',
  role: 'ADMIN',
  createdAt: '2026-08-30T00:00:00.000Z',
  passwordHash: 'admin123',
};

// Default Fixed Standard User Credential for Dev Adapter
const DEFAULT_STANDARD_USER: User & { passwordHash: string } = {
  id: 'user_fixed_master',
  name: 'Dr. Alexander Vance',
  email: 'user@cyclonesense.ai',
  organization: 'National Meteorological Agency',
  role: 'USER',
  createdAt: '2026-08-30T00:00:00.000Z',
  passwordHash: 'user123',
};

class AuthService {
  private isBackendAvailable(): boolean {
    return Boolean(API_URL && API_URL.trim().length > 0);
  }

  public getAdapterMode(): 'BACKEND_CONNECTED' | 'DEV_ADAPTER' {
    return this.isBackendAvailable() ? 'BACKEND_CONNECTED' : 'DEV_ADAPTER';
  }

  private getStoredUsers(): (User & { passwordHash: string })[] {
    if (typeof window === 'undefined') return [DEFAULT_ADMIN_USER, DEFAULT_STANDARD_USER];

    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (!stored) {
        const initial = [DEFAULT_ADMIN_USER, DEFAULT_STANDARD_USER];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      const users: (User & { passwordHash: string })[] = JSON.parse(stored);
      
      if (!users.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN_USER.email.toLowerCase())) {
        users.unshift(DEFAULT_ADMIN_USER);
      }
      if (!users.some((u) => u.email.toLowerCase() === DEFAULT_STANDARD_USER.email.toLowerCase())) {
        users.push(DEFAULT_STANDARD_USER);
      }
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return users;
    } catch {
      return [DEFAULT_ADMIN_USER, DEFAULT_STANDARD_USER];
    }
  }

  // --- SIGN UP ---
  public async signUp(data: SignUpData): Promise<AuthResponse> {
    if (this.isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const json = await res.json();
        if (!res.ok) {
          return {
            success: false,
            error: json.message || 'Failed to create account. Please try again.',
            adapterMode: 'BACKEND_CONNECTED',
          };
        }

        return {
          success: true,
          user: json.user,
          token: json.token,
          adapterMode: 'BACKEND_CONNECTED',
        };
      } catch {
        return {
          success: false,
          error: 'Unable to connect to the authentication service. Please check network connection.',
          adapterMode: 'BACKEND_CONNECTED',
        };
      }
    }

    // Dev Adapter Mode: Persistent Local User Registration
    try {
      await new Promise((res) => setTimeout(res, 400));

      const users = this.getStoredUsers();
      const emailNormalized = data.email.trim().toLowerCase();

      if (users.some((u) => u.email.toLowerCase() === emailNormalized)) {
        return {
          success: false,
          error: 'An account with this email address already exists.',
          adapterMode: 'DEV_ADAPTER',
        };
      }

      const newUser: User & { passwordHash: string } = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: data.name.trim(),
        email: emailNormalized,
        organization: data.organization.trim(),
        role: data.role,
        createdAt: new Date().toISOString(),
        passwordHash: data.password,
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      const cleanUser: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        organization: newUser.organization,
        role: newUser.role,
        createdAt: newUser.createdAt,
      };

      return {
        success: true,
        user: cleanUser,
        adapterMode: 'DEV_ADAPTER',
      };
    } catch {
      return {
        success: false,
        error: 'Failed to save account in local storage adapter.',
        adapterMode: 'DEV_ADAPTER',
      };
    }
  }

  // --- SIGN IN ---
  public async signIn(data: SignInData): Promise<AuthResponse> {
    if (this.isBackendAvailable()) {
      try {
        const res = await fetch(`${API_URL}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.token) {
            const storage = data.rememberMe ? localStorage : sessionStorage;
            storage.setItem(TOKEN_STORAGE_KEY, json.token);
          }
          return {
            success: true,
            user: json.user || {
              id: 'user_live_active',
              name: data.email.split('@')[0] || 'Meteorologist',
              email: data.email,
              organization: 'Cyclone Intelligence Center',
              role: data.email.includes('admin') ? 'ADMIN' : 'USER',
              createdAt: new Date().toISOString(),
            },
            token: json.token || 'live_token_active',
            adapterMode: 'BACKEND_CONNECTED',
          };
        }
      } catch {
        // Fallback to local authentication adapter below
      }
    }

    // Dev Adapter Mode: Check against stored users + fixed admin & standard user credentials
    try {
      await new Promise((res) => setTimeout(res, 400));

      const users = this.getStoredUsers();
      const emailNormalized = data.email.trim().toLowerCase();

      const user = users.find(
        (u) => u.email.toLowerCase() === emailNormalized && u.passwordHash === data.password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password.',
          adapterMode: 'DEV_ADAPTER',
        };
      }

      const cleanUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        organization: user.organization,
        role: user.role,
        createdAt: user.createdAt,
      };

      const fakeToken = `dev_jwt_token_${cleanUser.id}_${Date.now()}`;

      const storage = data.rememberMe ? localStorage : sessionStorage;
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cleanUser));
      storage.setItem(TOKEN_STORAGE_KEY, fakeToken);

      return {
        success: true,
        user: cleanUser,
        token: fakeToken,
        adapterMode: 'DEV_ADAPTER',
      };
    } catch {
      return {
        success: false,
        error: 'Sign in failed due to storage error.',
        adapterMode: 'DEV_ADAPTER',
      };
    }
  }

  // --- GET CURRENT USER (SESSION RESTORE) ---
  public async getCurrentUser(): Promise<User | null> {
    if (this.isBackendAvailable()) {
      try {
        const token =
          localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
        if (!token) return null;

        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          this.signOut();
          return null;
        }

        const json = await res.json();
        return json.user || null;
      } catch {
        return null;
      }
    }

    // Dev Adapter Session Check
    try {
      const storedSession =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!storedSession) return null;

      return JSON.parse(storedSession) as User;
    } catch {
      return null;
    }
  }

  // --- REFRESH SESSION ---
  public async refreshSession(): Promise<User | null> {
    return this.getCurrentUser();
  }

  // --- SIGN OUT ---
  public async signOut(): Promise<void> {
    if (this.isBackendAvailable()) {
      try {
        const token =
          localStorage.getItem(TOKEN_STORAGE_KEY) || sessionStorage.getItem(TOKEN_STORAGE_KEY);
        await fetch(`${API_URL}/api/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Ignore logout network errors
      }
    }

    localStorage.removeItem(SESSION_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

export const authService = new AuthService();
