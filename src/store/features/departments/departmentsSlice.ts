import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Department } from '@/types/models';
import { API_URL } from '@/config/constants';

interface DepartmentsState {
  departments: Department[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  departments: [],
  isLoading: false,
  error: null,
};

// Action pour récupérer tous les départements
export const fetchDepartments = createAsyncThunk(
  'departments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des départements');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Action pour créer un département
export const createDepartment = createAsyncThunk(
  'departments/create',
  async (departmentData: { name: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(departmentData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du département');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

// Action pour supprimer un département
export const deleteDepartment = createAsyncThunk(
  'departments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du département');
      }

      return id;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, name }: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification du département');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    resetDepartments: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Gestion de fetchDepartments
      .addCase(fetchDepartments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Gestion de createDepartment
      .addCase(createDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Gestion de deleteDepartment
      .addCase(deleteDepartment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter(
          (dept) => dept.id !== action.payload
        );
        state.isLoading = false;
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Gestion de updateDepartment
      .addCase(updateDepartment.fulfilled, (state, action) => {
        const index = state.departments.findIndex(dept => dept.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
      });
  },
});

export const { resetDepartments } = departmentsSlice.actions;
export default departmentsSlice.reducer; 