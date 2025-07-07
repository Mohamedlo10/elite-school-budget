"use client";

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { useEffect } from 'react';
import { checkAuthState } from '@/store/features/auth/authSlice';

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initial auth check
    store.dispatch(checkAuthState());

    // Set up periodic token validation (every minute)
    const interval = setInterval(() => {
      store.dispatch(checkAuthState());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return <Provider store={store}>{children}</Provider>;
}