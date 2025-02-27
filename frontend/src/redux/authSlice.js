import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: {
    user: null,
    statusCode: null,
    message: null,
    success: false
  },
  isLoading: false,
  error: null,
  isAuthenticated: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload.data;
      state.isAuthenticated = action.payload.success;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.data = {
        user: null,
        statusCode: null,
        message: null,
        success: false
      };
      state.error = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action) => {
      state.data.user = action.payload;
    }
  }
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout,
  updateUser
} = authSlice.actions;

export default authSlice.reducer;
