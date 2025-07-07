import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_URL } from '@/config/constants';
import { Submission } from '@/types/models';

interface SubmissionsState {
  submissions: Submission[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubmissionsState = {
  submissions: [],
  isLoading: false,
  error: null,
};

export const fetchDepartmentSubmissions = createAsyncThunk(
  'submissions/fetchDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des soumissions');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);


export const updateSubmissionStatus = createAsyncThunk(
  'submissions/updateStatus',
  async ({ 
    id, 
    status,
    comment 
  }: { 
    id?: string;
    status: string;
    comment?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status, comment: comment }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (submissionData: {
    title: string;
    description: string;
    quantity: number;
    unitPrice: number;
    reference?: string;
    justification?: string;
    categoryId: string;
    departmentId?: string;
    periodId?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la soumission');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchUserSubmissions = createAsyncThunk(
  'submissions/fetchUserSubmissions',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération de vos soumissions');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateSubmissionComment = createAsyncThunk(
  'submissions/updateComment',
  async ({ 
    id, 
    comment 
  }: { 
    id: string;
    comment: string;
  }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/submissions/${id}/comment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ feedback: comment }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du commentaire');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchAllSubmissions = createAsyncThunk(
  'submissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/submissions`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des soumissions');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState,
  reducers: {
    resetSubmissions: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartmentSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDepartmentSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
        const index = state.submissions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.submissions.push(action.payload);
      })
      .addCase(fetchUserSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateSubmissionComment.fulfilled, (state, action) => {
        const index = state.submissions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.submissions[index] = action.payload;
        }
      })
      .addCase(fetchAllSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchAllSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSubmissions } = submissionsSlice.actions;
export default submissionsSlice.reducer; 