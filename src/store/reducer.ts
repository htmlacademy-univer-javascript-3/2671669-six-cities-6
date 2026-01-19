import { createReducer } from '@reduxjs/toolkit';
import { CityName } from '../shared/entities/city/types'; // ← Импортируем enum
import { AppState } from './types';
import { changeCity, setOffers } from './actions';

const initialState: AppState = {
  city: CityName.Paris, // ← Используем enum!
  offers: [],
  filteredOffers: [],
};

const appReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(changeCity, (state, action) => {
      state.city = action.payload;
      state.filteredOffers = state.offers.filter(
        (offer) => offer.city === action.payload
      );
    })
    .addCase(setOffers, (state, action) => {
      state.offers = action.payload;
      state.filteredOffers = action.payload.filter(
        (offer) => offer.city === state.city
      );
    });
});

export default appReducer;
