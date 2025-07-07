import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuthGuard() {
  const { token, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
    }
  }, [token, router]);

  return { isAuthenticated: !!token, user };
} 