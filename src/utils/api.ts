import { API_URL } from '@/config/constants';
//import { getAuthToken } from './auth';
/*
export const createApiHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};


export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...createApiHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
} */