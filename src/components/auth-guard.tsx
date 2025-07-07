"use client";

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role } from '@/types/models';
import { PROTECTED_ROUTES } from '@/config/permissions';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const  [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      // Si pas de token, rediriger vers login
      if (!token) {
        setIsLoading(false);
        router.push('/auth/login');
        return;
      }

      // Si on est sur une page d'auth et qu'on est connecté, rediriger vers dashboard
      if (window.location.pathname.startsWith('/auth')) {
        setIsLoading(false);
        router.push('/dashboard');
        return;
      }

      // Vérifier les permissions basées sur le rôle
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const userRole = user.role as Role;
          const currentPath = window.location.pathname;

          // Trouve la route protégée qui correspond au chemin
          const route = Object.keys(PROTECTED_ROUTES).find(route => 
            currentPath.startsWith(route)
          );

          if (route) {
            const allowedRoles = PROTECTED_ROUTES[route as keyof typeof PROTECTED_ROUTES];
            if (!allowedRoles.includes(userRole)) {
              setIsLoading(false);
              router.push('/404');
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          setIsLoading(false);
          router.push('/auth/login');
        }
      }
    };

    checkAuth();
  }, [router]);

  return <>{!isLoading ? <div className="p-6 flex justify-center items-center h-screen">
    <Loader2 className="h-6 w-6 animate-spin" />
  </div> : children}</>;
} 