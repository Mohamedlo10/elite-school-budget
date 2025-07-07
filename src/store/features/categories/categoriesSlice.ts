import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Category } from '@/types/models';
import {API_URL} from "@/config/constants";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface CategoryDto {
  name: string;
  description?: string;
  departmentId?: string;
}

const initialState: CategoriesState = {
  categories: [],
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createCategory = createAsyncThunk(
    'categories/create',
    async (categoryData: CategoryDto, { rejectWithValue }) => {
      try {
        const response = await fetch(`${API_URL}/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            name: categoryData.name,
            description: categoryData.description,
            departmentId: categoryData.departmentId
          }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Erreur lors de la création de la catégorie');
        }
  
        const data = await response.json();
        return data;
      } catch (error) {
        return rejectWithValue((error as Error).message);
      }
    }
  );

export const updateCategory = createAsyncThunk(
  'categories/update',
  async (
    { id, categoryData }: {
        id: string;
        categoryData: CategoryDto
      }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(categoryData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la catégorie');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la catégorie');
      }

      return categoryId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchDepartmentCategories = createAsyncThunk(
  'categories/fetchByDepartment',
  async (departmentId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/departments/${departmentId}/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories du département');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    resetCategories: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create category
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      // Update category
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      // Delete category
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      })
      // Fetch department categories
      .addCase(fetchDepartmentCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDepartmentCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchDepartmentCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer; 