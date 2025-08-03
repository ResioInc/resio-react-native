import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HomeState, Event, Bulletin, CommunityResource } from '@/types';
import { HomeAPI } from '@services/api/HomeAPI';

const initialState: HomeState = {
  events: [],
  bulletins: [],
  resources: [],
  linkedAccounts: [],
  unreadBulletinsCount: 0,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchHomeData = createAsyncThunk(
  'home/fetchData',
  async (propertyId?: number) => {
    const [events, bulletins, resources, unreadBulletinsCount] = await Promise.all([
      HomeAPI.getEvents(),
      HomeAPI.getBulletins(propertyId),
      HomeAPI.getCommunityResources(propertyId),
      propertyId ? HomeAPI.getUnreadBulletinsCount(propertyId) : Promise.resolve(0),
    ]);
    
    return { events, bulletins, resources, unreadBulletinsCount };
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
  async (propertyId: number | undefined, { rejectWithValue }) => {
    try {
      const bulletins = await HomeAPI.getBulletins(propertyId);
      return bulletins;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch bulletins'
      );
    }
  }
);

export const fetchUnreadBulletinsCount = createAsyncThunk(
  'home/fetchUnreadBulletinsCount',
  async (propertyId: number) => {
    const count = await HomeAPI.getUnreadBulletinsCount(propertyId);
    return count;
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
        // In iOS, bulletins are marked as read by setting messageReadCount to a non-zero value
        bulletin.messageReadCount = "1";
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
        state.unreadBulletinsCount = action.payload.unreadBulletinsCount;
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
      .addCase(fetchBulletins.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBulletins.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bulletins = action.payload;
        state.error = null;
      })
      .addCase(fetchBulletins.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch bulletins';
      });
    
    // Fetch Unread Bulletins Count
    builder
      .addCase(fetchUnreadBulletinsCount.fulfilled, (state, action) => {
        state.unreadBulletinsCount = action.payload;
      });
  },
});

export const { clearError, setLinkedAccounts, markBulletinAsRead } = homeSlice.actions;
export default homeSlice.reducer; 