import { createReducer } from '@reduxjs/toolkit';
import { CityName } from '../shared/entities/city/types';
import { SortingOption } from '../shared/entities/sorting/types'; // ← Добавьте импорт
import { AppState } from './types';
import { changeCity, setOffers, setSortingOption, setActiveCardId } from './actions';

const initialState: AppState = {
  city: CityName.Paris,
  offers: [],
  filteredOffers: [],
  sortingOption: 'Popular' as SortingOption, // ← Явно указываем тип
  activeCardId: null,
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
    })
    .addCase(setSortingOption, (state, action) => {
      state.sortingOption = action.payload;
    })
    .addCase(setActiveCardId, (state, action) => {
      state.activeCardId = action.payload;
    });
});

export default appReducer;
