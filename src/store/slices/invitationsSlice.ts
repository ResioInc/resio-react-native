import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Invitation } from '@/types/home';
import { HomeAPI } from '@services/api/HomeAPI';

interface InvitationsState {
  invitations: Invitation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: InvitationsState = {
  invitations: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchInvitations = createAsyncThunk(
  'invitations/fetchInvitations',
  async (_, { rejectWithValue }) => {
    try {
      const invitations = await HomeAPI.getInvitations();
      return invitations;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch invitations'
      );
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  'invitations/acceptInvitation',
  async (invitationId: number, { rejectWithValue }) => {
    try {
      await HomeAPI.acceptInvitation(invitationId);
      return invitationId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to accept invitation'
      );
    }
  }
);

export const declineInvitation = createAsyncThunk(
  'invitations/declineInvitation',
  async ({ invitationId, sender }: { invitationId: number; sender: boolean }, { rejectWithValue }) => {
    try {
      await HomeAPI.declineInvitation(invitationId, sender);
      return invitationId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to decline invitation'
      );
    }
  }
);

export const sendInvitation = createAsyncThunk(
  'invitations/sendInvitation',
  async ({ email, message }: { email: string; message: string }, { rejectWithValue }) => {
    try {
      await HomeAPI.sendInvitation(email, message);
      return { email, message };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to send invitation'
      );
    }
  }
);

// Slice
const invitationsSlice = createSlice({
  name: 'invitations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    removeInvitation: (state, action) => {
      state.invitations = state.invitations.filter(
        invitation => invitation.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    // Fetch Invitations
    builder
      .addCase(fetchInvitations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvitations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invitations = action.payload;
        state.error = null;
      })
      .addCase(fetchInvitations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to fetch invitations';
      });
    
    // Accept Invitation
    builder
      .addCase(acceptInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the accepted invitation from the list
        state.invitations = state.invitations.filter(
          invitation => invitation.id !== action.payload
        );
        state.error = null;
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to accept invitation';
      });
    
    // Decline Invitation
    builder
      .addCase(declineInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(declineInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the declined invitation from the list
        state.invitations = state.invitations.filter(
          invitation => invitation.id !== action.payload
        );
        state.error = null;
      })
      .addCase(declineInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to decline invitation';
      });
    
    // Send Invitation
    builder
      .addCase(sendInvitation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendInvitation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Optionally show success message or refresh invitations list
      })
      .addCase(sendInvitation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string || 'Failed to send invitation';
      });
  },
});

export const { clearError, removeInvitation } = invitationsSlice.actions;
export default invitationsSlice.reducer;