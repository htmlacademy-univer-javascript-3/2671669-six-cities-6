import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {Offer} from '../../shared/entities/offer/types.ts';

type OffersState = {
  offers: Offer[];
  currentCity: string;
  isLoading: boolean;
};

const initialState: OffersState = {
  offers: [],
  currentCity: 'Paris',
  isLoading: false,
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    setOffers: (state, action: PayloadAction<Offer[]>) => {
      state.offers = action.payload;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.currentCity = action.payload;
    },
  },
});

export const { setOffers, setCity } = offersSlice.actions;
export default offersSlice.reducer;
