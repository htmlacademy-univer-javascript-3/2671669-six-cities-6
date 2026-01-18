import { configureStore } from '@reduxjs/toolkit';
import offersReducer from '../slices/offers-slice/offers-slice';

export const store = configureStore({
  reducer: {
    offers: offersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
