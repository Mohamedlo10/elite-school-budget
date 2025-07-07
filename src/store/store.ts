import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import departmentsReducer from './features/departments/departmentsSlice';
import usersReducer from './features/users/usersSlice';
import categoriesReducer from './features/categories/categoriesSlice';
import submissionsReducer from './features/submissions/submissionsSlice';
import periodsReducer from './features/periods/periodsSlice';
export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentsReducer,
    users: usersReducer,
    categories: categoriesReducer,
    submissions: submissionsReducer,
    periods: periodsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/login/fulfilled'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 