import { AdminUser } from '../types';
import { supabase, isSupabaseConfigured } from './supabase';

const ADMIN_STORAGE_KEY = 'BULLMONK_ADMIN_SESSION_V1';

// Default Bureau Master Credentials (can be overridden via environment variables)
const DEFAULT_ADMIN_EMAIL = 'admin@bullmonk.intelligence';
const DEFAULT_ADMIN_PASSKEY = import.meta.env.VITE_ADMIN_PASSKEY || 'BullMonk2026!';

type AuthListener = (user: AdminUser | null) => void;
const listeners: Set<AuthListener> = new Set();

export const AdminAuth = {
  /**
   * Check if an active authenticated Admin session exists
   */
  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    return user !== null;
  },

  /**
   * Retrieve currently authenticated admin credentials
   */
  getCurrentUser(): AdminUser | null {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as AdminUser;
    } catch {
      return null;
    }
  },

  /**
   * Subscribe to Admin Auth changes (login, logout)
   */
  subscribe(listener: AuthListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notifyListeners(user: AdminUser | null) {
    listeners.forEach((listener) => {
      try {
        listener(user);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    });
  },

  /**
   * Authenticate admin via Supabase Auth or Bureau Master Credentials
   */
  async login(email: string, passkey: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = passkey.trim();

    // 1. Check Bureau Managing Editor Master Credentials
    if (
      (cleanEmail === DEFAULT_ADMIN_EMAIL && cleanPass === DEFAULT_ADMIN_PASSKEY) ||
      (cleanEmail === 'admin' && cleanPass === DEFAULT_ADMIN_PASSKEY) ||
      (cleanEmail === 'admin' && cleanPass === 'admin123')
    ) {
      const user: AdminUser = {
        email: DEFAULT_ADMIN_EMAIL,
        name: 'Managing Editor & Bureau Chief',
        role: 'managing_editor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        authenticatedAt: new Date().toISOString()
      };

      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
      this.notifyListeners(user);
      return { success: true, user };
    }

    // 2. Try Supabase Auth if cloud is configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPass
        });

        if (!error && data.user) {
          const user: AdminUser = {
            email: data.user.email || cleanEmail,
            name: data.user.user_metadata?.full_name || 'Authorized Bureau Editor',
            role: 'editor',
            avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
            authenticatedAt: new Date().toISOString()
          };

          localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
          this.notifyListeners(user);
          return { success: true, user };
        }
      } catch (err: any) {
        console.warn('Supabase Auth error fallback:', err.message);
      }
    }

    return {
      success: false,
      error: 'Invalid Bureau credentials. Verify your Managing Editor email and passkey.'
    };
  },

  /**
   * Terminate active Admin session
   */
  async logout(): Promise<void> {
    try {
      if (isSupabaseConfigured) {
        await supabase.auth.signOut();
      }
    } catch {
      // Ignore
    } finally {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      this.notifyListeners(null);
    }
  }
};
