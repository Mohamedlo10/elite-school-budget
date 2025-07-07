import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resetSubmissions } from '../submissions/submissionsSlice';
import { resetDepartments } from '../departments/departmentsSlice';
import { resetUsers } from '../users/usersSlice';
import { resetCategories } from '../categories/categoriesSlice';
import { resetPeriods } from '../periods/periodsSlice';
import { API_URL } from '@/config/constants';
import {Category, Department, Submission, SubmissionPeriod} from "@/types/models";
import { PayloadAction } from '@reduxjs/toolkit';

// Utility function to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expirationTime;
  } catch (error) {
    return true; // If we can't decode the token, consider it expired
  }
};

type DepartmentField = Department | null;

interface AuthState {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: DepartmentField;
  } | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface User {
  id: string;
  email: string;
  name?: string;
  department?: Department;
  role: 'ADMIN' | 'DEPARTMENT_HEAD' | 'STAFF';
  access_token?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'DEPARTMENT_HEAD' | 'STAFF';
    department?: {
      id: string;
      name: string;
      users: User[];
      submissions: Submission[];
      periods: SubmissionPeriod[];
      categories: Category[];
    };
  };
  access_token: string;
}

const initialState: AuthState = {
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,
};

const transformDepartment = (department: any): Department | null => {
  if (!department) return null;
  return {
    id: department.id,
    name: department.name,
    users: department.users || [],
    submissions: department.submissions || [],
    periods: department.periods || [],
    categories: department.categories || [],
  };
};

// Fonction utilitaire pour définir les cookies
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=86400; SameSite=Strict`;
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Authentication failed');
    }

    const data: LoginResponse = await response.json();
    
    // Check if token is valid before storing
    if (isTokenExpired(data.access_token)) {
      throw new Error('Received expired token');
    }
    
    // Store in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    // Store in cookies
    setCookie('token', data.access_token);
    setCookie('user', JSON.stringify(data.user));
    
    return {
      user: data.user,
      token: data.access_token,
    };
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkState',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || isTokenExpired(token)) {
      dispatch(logout());
      return rejectWithValue('Token expired or not found');
    }

    if (user) {
      return { token, user: JSON.parse(user) };
    }

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });

      if (!response.ok) {
        dispatch(logout());
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      return { token, user: userData };
    } catch (error) {
      dispatch(logout());
      return rejectWithValue('Error verifying token');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState: (state) => {
      state.user = null;
      state.token = null;
    },
    logout: (state) => {
      // Clear auth state
      state.user = null;
      state.token = null;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear cookies
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    },
    setUser: (state, action: PayloadAction<{ user: User }>) => {
      if (!action.payload.user.name) {
        throw new Error('User name is required');
      }
      
      state.user = {
        id: action.payload.user.id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        role: action.payload.user.role,
        department: transformDepartment(action.payload.user.department)
      };

      if (action.payload.user.access_token) {
        state.token = action.payload.user.access_token;
        localStorage.setItem('token', action.payload.user.access_token);
        document.cookie = `token=${action.payload.user.access_token}; path=/; max-age=86400; SameSite=Strict`;
      }
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isLoading = false;
      })
      .addCase(checkAuthState.rejected, (state) => {
        state.token = null;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload?.token;
        if (!action.payload.user.name) {
          throw new Error('User name is required');
        }
        state.user = {
          id: action.payload.user.id,
          name: action.payload.user.name,
          email: action.payload.user.email,
          role: action.payload.user.role,
          department: transformDepartment(action.payload.user.department)
        };
        state.error = null;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        document.cookie = `token=${action.payload.token}; path=/; max-age=86400; SameSite=Strict`;
      });
  },
});

export const { clearAuthState, logout } = authSlice.actions;

// Create a separate action creator for handling logout
export const logoutAndResetState = () => (dispatch: (arg0: { payload: undefined; type: "auth/clearAuthState" | "submissions/resetSubmissions" | "departments/resetDepartments" | "periods/resetPeriods" | "categories/resetCategories" | "users/resetUsers"; }) => void) => {
  // Clear all localStorage
  localStorage.clear();
  
  // Clear cookies
  document.cookie.split(";").forEach((c) => {
    document.cookie = c
      .replace(/^ +/, "")
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });

  // Reset all states
  dispatch(clearAuthState());
  dispatch(resetSubmissions());
  dispatch(resetDepartments());
  dispatch(resetPeriods());
  dispatch(resetCategories());
  dispatch(resetUsers());
};

export default authSlice.reducer;