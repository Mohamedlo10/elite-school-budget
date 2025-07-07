"use client"

import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RoleRedirect() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      // Rediriger vers la page appropriée selon le rôle
      switch (user.role) {
        case 'ADMIN':
          router.push('/dashboard');
          break;
        case 'DEPARTMENT_HEAD':
          router.push('/dashboard');
          break;
        case 'STAFF':
        default:
          router.push('/dashboard');
          break;
      }
    }
  }, [user, router]);

  return null;
} 