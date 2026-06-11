'use client';

import { useAuthStore } from './useAuth';
import * as api from '@/lib/api';
import { useCallback } from 'react';

export const useAuthActions = () => {
  const { setUser, setToken, setLoading, setError, clearAuth } = useAuthStore();

  const handleRegister = useCallback(
    async (email: string, password: string, name: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.register(email, password, name);
        if (response.error) {
          setError(response.error);
          return false;
        }

        setError(null);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.login(email, password);
        if (response.error) {
          setError(response.error);
          return false;
        }

        const user = (response.data as any)?.user;
        if (user) {
          setUser(user);
          setToken((response.data as any)?.token);
        }

        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Login failed';
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setToken, setLoading, setError]
  );

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await api.logout();
      clearAuth();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, [clearAuth, setLoading]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.getMe();
      if (response.data?.user) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error('Fetch user error:', err);
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading]);

  return {
    handleRegister,
    handleLogin,
    handleLogout,
    fetchUser,
  };
};
