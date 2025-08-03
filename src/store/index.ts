import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import homeReducer from './slices/homeSlice';
import wifiReducer from './slices/wifiSlice';
import invitationsReducer from './slices/invitationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    home: homeReducer,
    wifi: wifiReducer,
    invitations: invitationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 