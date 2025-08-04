import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { WifiState, WifiConnectionStatus } from '@/types';
import { HomeAPI } from '@services/api/HomeAPI';
import WifiService from '@/services/wifi/WifiService';

const initialState: WifiState = {
  wifiInfo: null,
  connectionStatus: WifiConnectionStatus.UNKNOWN,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchWifiInfo = createAsyncThunk(
  'wifi/fetchInfo',
  async (leaseId: number | undefined, { rejectWithValue }) => {
    try {
      if (!leaseId) {
        return rejectWithValue('No lease ID available for WiFi information');
      }

      const unitInfo = await HomeAPI.getUnitInfo(leaseId);
      
      // Handle backend's hyphenated key structure
      const wifiInfo = unitInfo['unit-info']?.wifi || unitInfo.unitInfo?.wifi || null;
      
      return wifiInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch WiFi information'
      );
    }
  }
);

export const updateConnectionStatus = createAsyncThunk(
  'wifi/updateConnectionStatus',
  async (status: WifiConnectionStatus) => {
    return status;
  }
);

export const connectToWifi = createAsyncThunk(
  'wifi/connect',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const { wifi } = getState() as { wifi: WifiState };
      
      if (!wifi.wifiInfo) {
        return rejectWithValue('No WiFi information available');
      }

      // Call the actual WiFi service (mimics iOS behavior)
      await WifiService.connectToWifi(wifi.wifiInfo);
      
      // For now, simulate iOS simulator behavior - immediate toggle
      // In a real app, this would be handled by native module callbacks
      return WifiConnectionStatus.CONNECTED;
      
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to connect to WiFi'
      );
    }
  }
);

export const disconnectFromWifi = createAsyncThunk(
  'wifi/disconnect',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { wifi } = getState() as { wifi: WifiState };
      
      if (!wifi.wifiInfo) {
        return rejectWithValue('No WiFi information available');
      }
      
      // Call the actual WiFi service (mimics iOS behavior)
      await WifiService.disconnectFromWifi(wifi.wifiInfo.ssid);
      
      return WifiConnectionStatus.DISCONNECTED;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to disconnect from WiFi'
      );
    }
  }
);

// Slice
const wifiSlice = createSlice({
  name: 'wifi',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setConnectionStatus: (state, action) => {
      state.connectionStatus = action.payload;
    },
    clearWifiInfo: (state) => {
      state.wifiInfo = null;
      state.connectionStatus = WifiConnectionStatus.UNKNOWN;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch WiFi Info
    builder
      .addCase(fetchWifiInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWifiInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wifiInfo = action.payload;
        state.error = null;
        
        // If we get WiFi info, initialize connection status as unknown
        if (action.payload) {
          state.connectionStatus = WifiConnectionStatus.UNKNOWN;
        }
      })
      .addCase(fetchWifiInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch WiFi information';
      });

    // Update Connection Status
    builder
      .addCase(updateConnectionStatus.fulfilled, (state, action) => {
        state.connectionStatus = action.payload;
      });

    // Connect to WiFi
    builder
      .addCase(connectToWifi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(connectToWifi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connectionStatus = action.payload;
        state.error = null;
      })
      .addCase(connectToWifi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to connect to WiFi';
        state.connectionStatus = WifiConnectionStatus.DISCONNECTED;
      });

    // Disconnect from WiFi
    builder
      .addCase(disconnectFromWifi.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(disconnectFromWifi.fulfilled, (state, action) => {
        state.isLoading = false;
        state.connectionStatus = action.payload;
        state.error = null;
      })
      .addCase(disconnectFromWifi.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to disconnect from WiFi';
      });
  },
});

export const { clearError, setConnectionStatus, clearWifiInfo } = wifiSlice.actions;
export default wifiSlice.reducer;