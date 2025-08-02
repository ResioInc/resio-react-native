import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, LoginRequest, LoginResponse, UserType } from '@/types';
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
  async (credentials: LoginRequest, { rejectWithValue, dispatch }) => {
    try {
      // Step 1: Authenticate user
      const loginResponse = await AuthAPI.login(credentials.email, credentials.password);
      
      // Step 2: Validate response structure
      if (!loginResponse.success || 
          !loginResponse.response?.user || 
          !loginResponse.response?.accessToken) {
        return rejectWithValue('Invalid login response from server');
      }
      
      const { user, accessToken } = loginResponse.response;
      
      // Step 3: Validate user permissions
      if (user.type !== UserType.RESIDENT) {
        return rejectWithValue('Only residents are allowed to use this app');
      }
      
      // Step 4: Save credentials securely (needed for lease check)
      await SecureStorage.getInstance().saveToken(accessToken);
      
      // Step 5: Verify user has valid lease
      const leaseResponse = await AuthAPI.checkLease();
      if (!leaseResponse.success || !leaseResponse.response?.hasLease) {
        return rejectWithValue('You do not have a valid lease. Please contact your property manager.');
      }
      
      return loginResponse;
    } catch (error: any) {
      // Handle different error types
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      
      if (error.code) {
        return rejectWithValue(error.message || 'Authentication failed');
      }
      
      const errorMessage = error.message || 'Network error. Please try again.';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthAPI.logout();
      await SecureStorage.getInstance().clearTokens();
    } catch (error: any) {
      // Logout should always succeed locally even if API fails
      console.warn('Logout API call failed:', error);
      await SecureStorage.getInstance().clearTokens();
    }
  }
);

export const refreshUser = createAsyncThunk(
  'auth/refreshUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthAPI.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to refresh user data');
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await SecureStorage.getInstance().getToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }
      
      const user = await AuthAPI.getCurrentUser();
      return user;
    } catch (error: any) {
      return rejectWithValue('Authentication expired. Please log in again.');
    }
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
        state.user = action.payload.response.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
      });
    
    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        state.isLoading = false;
        state.biometricEnabled = false;
      })
      .addCase(logout.rejected, (state) => {
        // Even if logout fails, clear local state
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.biometricEnabled = false;
      });
    
    // Refresh User
    builder
      .addCase(refreshUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(refreshUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(refreshUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to refresh user data';
      });
    
    // Check Auth Status
    builder
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string || 'Authentication check failed';
      });
  },
});

export const { clearError, setBiometricEnabled, setUser } = authSlice.actions;
export default authSlice.reducer; 