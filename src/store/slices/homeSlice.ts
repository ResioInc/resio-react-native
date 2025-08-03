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
    
    // Filter out any undefined/null events
    const validEvents = events.filter((event) => event && event.id);
    
    if (events.length !== validEvents.length) {
      console.warn('🏠 fetchHomeData - Filtered out', events.length - validEvents.length, 'invalid events');
    }
    
    return { events: validEvents, bulletins, resources, unreadBulletinsCount };
  }
);

export const fetchEvents = createAsyncThunk(
  'home/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const events = await HomeAPI.getEvents();
      
      // Filter out any undefined/null events and sort by startTime
      const validEvents = events.filter((event) => event && event.id);
      const sortedEvents = validEvents.sort((event1, event2) => {
        const date1 = event1.startTime ? new Date(event1.startTime) : new Date(0);
        const date2 = event2.startTime ? new Date(event2.startTime) : new Date(0);
        return date1.getTime() - date2.getTime();
      });
      
      if (events.length !== validEvents.length) {
        console.warn('🏠 Redux fetchEvents - Filtered out', events.length - validEvents.length, 'invalid events');
      }
      
      return sortedEvents;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch events'
      );
    }
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

export const setEventRSVP = createAsyncThunk(
  'home/setEventRSVP',
  async ({ eventId, rsvp }: { eventId: number; rsvp: boolean }, { rejectWithValue }) => {
    try {
      await HomeAPI.setEventRSVP(eventId, rsvp);
      return { eventId, rsvp };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update RSVP'
      );
    }
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
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch events';
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
    
    // Set Event RSVP
    builder
      .addCase(setEventRSVP.fulfilled, (state, action) => {
        const { eventId, rsvp } = action.payload;
        const event = state.events.find(e => e.id === eventId);
        if (event) {
          event.rsvp = rsvp;
        }
      })
      .addCase(setEventRSVP.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update RSVP';
      });
  },
});

export const { clearError, setLinkedAccounts, markBulletinAsRead } = homeSlice.actions;
export default homeSlice.reducer; 