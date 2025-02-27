import { createSlice } from '@reduxjs/toolkit';

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('authState');
    if (serializedState === null) {
      return {
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
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
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
  }
};

const initialState = loadState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
      localStorage.setItem('authState', JSON.stringify(state));
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.data = action.payload.data;
      state.isAuthenticated = action.payload.success;
      localStorage.setItem('authState', JSON.stringify(state));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      localStorage.setItem('authState', JSON.stringify(state));
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
      localStorage.removeItem('authState');
    },
    updateUser: (state, action) => {
      state.data.user = action.payload;
      localStorage.setItem('authState', JSON.stringify(state));
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
