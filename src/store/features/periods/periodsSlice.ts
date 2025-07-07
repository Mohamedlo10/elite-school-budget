import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/config/constants';
import { SubmissionPeriod } from '@/types/models';

interface PeriodsState {
  currentPeriod: SubmissionPeriod | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PeriodsState = {
  currentPeriod: null,
  isLoading: false,
  error: null,
};

export const fetchCurrentPeriod = createAsyncThunk(
  'periods/fetchCurrent',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}/current-period`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la période');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createPeriod = createAsyncThunk(
  'periods/create',
  async (periodData: {
    startDate: string;
    endDate: string;
    departmentId?: string;
  }, { rejectWithValue }) => {
    if (!periodData.departmentId) {
      return rejectWithValue('ID du département manquant');
    }

    try {

      const response = await fetch(`${API_URL}/departments/${periodData.departmentId}/periods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...periodData,
          status: 'OPEN'
        }),
      });


      console.log(periodData)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la période');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updatePeriodStatus = createAsyncThunk(
  'periods/updateStatus',
  async ({ 
    periodId,
    departmentId,
    status 
  }: { 
    periodId?: string;
    departmentId?: string;
    status: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}/periods/${periodId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const periodsSlice = createSlice({
  name: 'periods',
  initialState,
  reducers: {
    resetPeriods: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentPeriod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentPeriod.fulfilled, (state, action) => {
        state.currentPeriod = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCurrentPeriod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createPeriod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPeriod.fulfilled, (state, action) => {
        state.currentPeriod = action.payload;
        state.isLoading = false;
      })
      .addCase(createPeriod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePeriodStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePeriodStatus.fulfilled, (state, action) => {
        state.currentPeriod = action.payload;
        state.isLoading = false;
      })
      .addCase(updatePeriodStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetPeriods } = periodsSlice.actions;
export default periodsSlice.reducer; 