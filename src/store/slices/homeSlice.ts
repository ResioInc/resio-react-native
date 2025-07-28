import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HomeState, Event, Bulletin, CommunityResource } from '@/types';
import { HomeAPI } from '@services/api/HomeAPI';

const initialState: HomeState = {
  events: [],
  bulletins: [],
  resources: [],
  linkedAccounts: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHomeData = createAsyncThunk(
  'home/fetchData',
  async () => {
    const [events, bulletins, resources] = await Promise.all([
      HomeAPI.getEvents(),
      HomeAPI.getBulletins(),
      HomeAPI.getCommunityResources(),
    ]);
    
    return { events, bulletins, resources };
  }
);

export const fetchEvents = createAsyncThunk(
  'home/fetchEvents',
  async () => {
    const events = await HomeAPI.getEvents();
    return events;
  }
);

export const fetchBulletins = createAsyncThunk(
  'home/fetchBulletins',
  async () => {
    const bulletins = await HomeAPI.getBulletins();
    return bulletins;
  }
);

// Slice
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLinkedAccounts: (state, action) => {
      state.linkedAccounts = action.payload;
    },
    markBulletinAsRead: (state, action) => {
      const bulletin = state.bulletins.find(b => b.id === action.payload);
      if (bulletin) {
        bulletin.isRead = true;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch Home Data
    builder
      .addCase(fetchHomeData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.bulletins = action.payload.bulletins;
        state.resources = action.payload.resources;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load home data';
      });
    
    // Fetch Events
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.events = action.payload;
      });
    
    // Fetch Bulletins
    builder
      .addCase(fetchBulletins.fulfilled, (state, action) => {
        state.bulletins = action.payload;
      });
  },
});

export const { clearError, setLinkedAccounts, markBulletinAsRead } = homeSlice.actions;
export default homeSlice.reducer; 