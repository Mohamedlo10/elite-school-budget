import { store } from '@/store/store';
import { logout } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';

export const handleLogout = () => {
  // Dispatch logout action which will clear all states
  store.dispatch(logout());
  
  // Redirect to login page
  window.location.href = '/auth/login';
}; 