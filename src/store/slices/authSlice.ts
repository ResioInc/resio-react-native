import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginRequest, LoginResponse } from '@/types';
import { AuthAPI } from '@services/api/AuthAPI';
import { SecureStorage } from '@services/storage/SecureStorage';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  biometricEnabled: false,
};

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest) => {
    const response = await AuthAPI.login(credentials.email, credentials.password);
    
    // Save tokens securely
    await SecureStorage.getInstance().saveToken(response.accessToken);
    await SecureStorage.getInstance().saveRefreshToken(response.refreshToken);
    
    return response;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await AuthAPI.logout();
    await SecureStorage.getInstance().clearTokens();
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async () => {
    const user = await AuthAPI.getCurrentUser();
    return user;
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    const token = await SecureStorage.getInstance().getToken();
    if (!token) {
      throw new Error('No token found');
    }
    
    const user = await AuthAPI.getCurrentUser();
    return user;
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
        state.isAuthenticated = false;
      });
    
    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
    
    // Refresh User
    builder
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
    
    // Check Auth Status
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, setBiometricEnabled, setUser } = authSlice.actions;
export default authSlice.reducer; 