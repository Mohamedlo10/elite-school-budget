import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '@/types/models';
import { API_URL } from '@/config/constants';
import { error } from 'console';

interface UsersState {
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  isLoading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'utilisateur');
      }

      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
    departmentId?: string;
  }, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData),
      });


      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Erreur lors de la modification de l\'utilisateur ' + errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({userData, id}: {
    userData: {
      name: string;
      email: string;
      password: string;
      role: string;
      departmentId?: string;
    },
    id: string
  }, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.message || 'Erreur lors de la modification de l\'utilisateur ' + errorData.message);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDepartmentStaff = createAsyncThunk(
  'users/fetchDepartmentStaff',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}/staff`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du personnel');
      }

      const data = await response.json();

      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    resetUsers: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(fetchDepartmentStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentStaff.fulfilled, (state, action) => {
        state.users = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDepartmentStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetUsers } = usersSlice.actions;
export default usersSlice.reducer; 